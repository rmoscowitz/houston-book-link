
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('books', function(table) {
      table.increments('id').primary();

      table.string('overdrive_id').unique();

      table.string('media_type');
      table.string('title');
      table.string('series');
      table.string('subtitle');
      table.string('sort_title');
      table.string('primary_creator_role');
      table.string('primary_creator_name');
      table.string('img_thumbnail');
      table.string('img_cover');
      table.string('img_cover_150_wide');
      table.string('img_cover_300_wide');
    })
    .createTable('libraries', function(table) {
      table.increments('id').primary();

      table.string('overdrive_id').unique();
      table.string('name');
      table.string('collection_token');
    })
    .createTable('library_books', function(table) {
      table.integer('book_id').references('id').inTable('books');
      table.integer('library_id').references('id').inTable('libraries');
      table.primary(['book_id', 'library_id']);

      table.dateTime('date_added');
      table.float('star_rating');
      table.string('overdrive_href');
      table.json('response');
    })
    .createTable('formats', function(table) {
      table.increments('id').primary();
      table.string('key');
      table.string('label');
    })
    .createTable('book_formats', function(table) {
      table.integer('book_id').references('id').inTable('books');
      table.integer('format_id').references('id').inTable('formats');
      table.primary(['book_id', 'format_id']);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('book_formats')
    .dropTable('formats')
    .dropTable('library_books')
    .dropTable('libraries')
    .dropTable('books');
};
