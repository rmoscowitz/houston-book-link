import { Book, Library, bookshelf } from './models'

export const search = (params) => {
  // TODO where libraries
  // TODO fetch page
  const BookCollection = bookshelf.Collection.extend({
    model: Book
  })
  return new BookCollection().query(function(qb) {
    qb.whereRaw(`tsv @@ to_tsquery('${params.search}')`)
    qb.limit(params.limit)
    qb.offset(params.offset)
  }).fetch({
    debug: true,
    withRelated: ['libraries', 'libraryBooks', 'formats']
  }).then(function(books) {
    return books.map(function(book) {
      const out = book.toJSON();
      out.libraries = book.related("libraries").toJSON();
      out.libraryBook = book.related("libraryBooks").toJSON()
      // TODO merge lib books
      delete out.libraryBook.response
      out.formats = book.related("formats").toJSON()
      return out
    })
  }).catch(function(err) {
    console.error(err);
  });
}

export const libraries = () => {
  return Library.fetchAll().then((libraries) => {
    return libraries.map(l => l.toJSON());
  })
}
