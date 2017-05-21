var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : 'localhost',
    user     : 'calexander',
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
  },
  formats: function() {
    return this.hasMany(Format, 'format_id').through(BookFormat, 'id');
  }
});

var LibraryBook = bookshelf.Model.extend({
  tableName: 'library_books',
});

var Library = bookshelf.Model.extend({
  tableName: 'libraries',
});

var BookFormat = bookshelf.Model.extend({
    tableName: 'book_formats',
});

var Format = bookshelf.Model.extend({
  tableName: 'formats',
});

/*
Book.where('id', 1).fetch({withRelated: ['libraries', 'libraryBooks', 'formats']}).then(function(book) {
  debugger;
  console.log(book.related("libraries").toJSON());
  console.log(book.related("libraryBooks").toJSON());
  console.log(book.related("libraryBooks").toJSON());
}).catch(function(err) {
  console.error(err);
});
*/
