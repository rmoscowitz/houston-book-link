import Book from './models'

module.exports = function(params) {
  return Book.query(function(qb) {
    qb.whereRaw("tsv @@ to_tsquery('george')")
    qb.limit(params.limit)
  }).fetchAll({
    debug: true,
    withRelated: ['libraries', 'libraryBooks', 'formats']
  }).then(function(books) {
    return books.map(function(book) {
      const out = book.toJSON();
      out.libraries = book.related("libraries").toJSON();
      out.libraryBook = book.related("libraryBooks").toJSON()
      delete out.libraryBook.response
      out.formats = book.related("formats").toJSON()
      return book
    })
  }).catch(function(err) {
    console.error(err);
  });
}
