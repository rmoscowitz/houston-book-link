var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : 'localhost',
    user     : 'dylan',
    password : '',
    database : 'mydb',
    charset  : 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);

var Book = bookshelf.Model.extend({
  tableName: 'books',
  libraries: function() {
    return this.hasMany(Library, 'library_id').through(LibraryBook, 'id');
  },
  libraryBooks: function() {
    return this.hasMany(LibraryBook);
  }
});

var LibraryBook = bookshelf.Model.extend({
  tableName: 'library_books',
  libraries: function() {
    return this.hasMany(Library);
  }
  // books: function() {
  //   return this.hasOne(Book);
  //   // return this.belongsTo(Book);
  //   // return this.belongsTo(Book, 'library_books_book_id_fkey');
  // },
  // libraries: function() {
  //   return this.hasOne(Library);
    // return this.belongsTo(Library);
    // return this.belongsTo(Library, 'library_books_library_id_fkey');
  // },
});

var Library = bookshelf.Model.extend({
  tableName: 'libraries',
  libraryBooks: function() {
    return this.belongsTo(LibraryBook);
  },
  books: function() {
    return this.belongsTo(Book).through(LibraryBook, 'library_books_library_id_fkey')
  }
});

Book.where('id', 1).fetch({withRelated: ['libraries', 'libraryBooks']}).then(function(book) {
  console.log(book.related("libraries").toJSON());
  console.log(book.related("libraryBooks").toJSON());
}).catch(function(err) {
  console.error(err);
});
