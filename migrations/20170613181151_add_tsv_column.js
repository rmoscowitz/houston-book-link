
exports.up = function(knex, Promise) {
  return knex.schema
    .raw('alter table books add column tsv tsvector')
    .table('books', function(table) {
      table.index('tsv', 'tsv_idx', 'gin')
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('books', function(table) {
      table.dropIndex('tsv', 'tsv_idx');
      table.dropColumn('tsv');
    });
};
