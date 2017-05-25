
exports.up = function(knex, Promise) {
  return knex.schema
    .table('books', function(table) {
      table.timestamp('last_updated').defaultTo(knex.fn.now());
    })
    .table('library_books', function(table) {
      table.timestamp('last_updated').defaultTo(knex.fn.now());
    })
    .table('book_formats', function(table) {
      table.timestamp('last_updated').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('books', function(table) {
      table.dropColumn('last_updated');
    })
    .table('library_books', function(table) {
      table.dropColumn('last_updated');
    })
    .table('book_formats', function(table) {
      table.dropColumn('last_updated');
    });
};
