const os = require('os');
const util = require('./util.js');

const knex = require('knex')(require('../knexfile'))

const bookshelf = require('bookshelf')(knex);

const Book = bookshelf.Model.extend({
  tableName: 'books',
  libraries: function() {
    return this.hasMany(Library).through(LibraryBook, 'id', 'book_id', 'library_id');
  },
  libraryBooks: function() {
    return this.hasMany(LibraryBook);
  },
  formats: function() {
    return this.hasMany(Format).through(BookFormat, 'id', 'book_id', 'format_id');
  }
});

const LibraryBook = bookshelf.Model.extend({
  tableName: 'library_books'
});

const Library = bookshelf.Model.extend({
  tableName: 'libraries',
});

const BookFormat = bookshelf.Model.extend({
  tableName: 'book_formats',
});

const Format = bookshelf.Model.extend({
  tableName: 'formats',
});

export {
  Book,
  Library,
  Format,
  LibraryBook,
  BookFormat,
  bookshelf,
  knex
}
