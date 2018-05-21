import { bookshelf, knex } from '../models.js';
const _ = require('lodash');

function upsertItems(tableName, conflictTarget, itemData, returns) {
  let firstObjectIfArray = Array.isArray(itemData) ? itemData[0] : itemData;
  let exclusions = Object.keys(firstObjectIfArray)
    .filter(c => c !== conflictTarget)
    .map(c => knex.raw('?? = EXCLUDED.??', [c, c]).toString())
    .join(",\n");

  let insertString = knex(tableName).insert(itemData).toString();
  let conflictString = knex.raw(`ON CONFLICT (${conflictTarget}) DO UPDATE SET ${exclusions} RETURNING ${returns};`).toString();
  let query = (insertString + conflictString).replace(/\?/g, '\\?');

  return knex.raw(query)
    .then(result => result.rows);
};

function to_tsvector(column) {
  return `to_tsvector(coalesce(${column}, ''))`;
}

export function updateTextSearchVector() {
  const searchables = [
    'title', 
    'series',
    'subtitle',
    'primary_creator_name',
    'media_type'
  ]
  const value = searchables.map(to_tsvector).join(' || ');
  return knex
    .raw(`update books set tsv = ${value}`);
}

/**
 * Deletes all books last_updated before a given timestamp, indicating
 * that it was not updated or created in the current extractor run
 * @param {timestamp} timestamp a unix timestamp in seconds
 * @returns {promise<int>} number of rows deleted
 */
export function deleteUpdatedBefore(timestamp) {
  return knex('books')
      .whereRaw('last_updated < ?', [timestamp])
      .del();
}

/**
 * Function for shoving overdrive data into the db.
 * @param {object} libraries a map from overdrive library id to our id
 * @param {object} formats a map from overdrive format id to our id
 * @param {object} response the response from the overdrive api
 * @returns {promise<object>} the ids updated/created
 */
export function processAndStore(libraries, formats, response) {
  const libraryId = response.id;
  // Turn all responses to our models for upsert
  const allModels = response.products
    .map(function(product) {
      const book = {
        overdrive_id: product.id,
        media_type: product.mediaType,
        title: product.title,
        series: product.series,
        subtitle: product.subtitle,
        sort_title: product.sortTitle,
        primary_creator_role: _.get(product, ['primaryCreator', 'role']),
        primary_creator_name: _.get(product, ['primaryCreator', 'name']),
        img_thumbnail: _.get(product, ['images', 'thumbnail', 'href']),
        img_cover: _.get(product, ['images', 'cover', 'href']),
        img_cover_150_wide: _.get(product, ['images', 'cover150Wide', 'href']),
        img_cover_300_wide: _.get(product, ['images', 'cover300Wide', 'href']),
        last_updated: new Date(Date.now())
      };
      const libraryBook = {
        library_id: libraries[libraryId],
        date_added: product.dateAdded,
        star_rating: product.starRating,
        overdrive_href: product.contentDetails[0].href,
        last_updated: new Date(Date.now())
      };
      const bookFormats = product.formats.map(format => {
        return {
          format_id: formats[format.id],
          last_updated: new Date(Date.now())
        }
      });
      return { book, libraryBook, bookFormats };
    });
  const books = allModels.map(models => models.book)

  /* 
   * We need a map from overdrive product id to a book id, 
   * so we can add the newly created/updated book ids to their
   * respective libraryBook and bookFromat associations.
   */
  const idsPromise = 
    upsertItems('books', 'overdrive_id', books, 'overdrive_id, id')
      .then(returns => returns.map(returned => [returned.overdrive_id, returned.id]))
      .then(idPairs => _.fromPairs(idPairs))

  return idsPromise
    .then(bookIds => {
      const libraryBooks = allModels.map(models => {
        const bookId = bookIds[models.book.overdrive_id];
        const libraryBook = models.libraryBook;
        libraryBook.book_id = bookId;
        return libraryBook;
      });
      return upsertItems('library_books', 'book_id, library_id', libraryBooks, 'library_id')
        .then(_ => bookIds);
    })
    .then(bookIds => {
      const bookFormats = _.flatten(allModels.map(models => {
        const bookId = bookIds[models.book.overdrive_id];
        const bookFormats = models.bookFormats.map(format => {
          format.book_id = bookId;
          return format;
        });
        return bookFormats;
      }));
      return upsertItems('book_formats', 'book_id, format_id', bookFormats, 'format_id')
        .then(_ => bookIds);
    });
}
