// TODO read from ENV vars

const knex = require('knex')({
  client: 'pg',
  connection: {
    host     : 'localhost',
    user     : 'dylan',
    password : '',
    database : 'mydb',
    charset  : 'utf8'
  }
});

const bookshelf = require('bookshelf')(knex);

const Book = bookshelf.Model.extend({
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

const LibraryBook = bookshelf.Model.extend({
  tableName: 'library_books',
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
  Library
}
