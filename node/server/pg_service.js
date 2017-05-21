import Book from './models'

export const search = (params) => {
  // TODO where libraries
  // TODO fetch page
  return Book.query(function(qb) {
    qb.whereRaw(`tsv @@ to_tsquery('${params.search}')`)
    qb.limit(params.limit)
    qb.offset(params.offset)
  }).fetchAll({
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
      return book
    })
  }).catch(function(err) {
    console.error(err);
  });
}

export const libraries = () => {
  console.log("fill me in")
}
