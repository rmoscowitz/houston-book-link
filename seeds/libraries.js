
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('libraries').del()
    .then(function () {
      // Inserts seed entries
      return knex('libraries').insert([
        {
          overdrive_id: 1356,
          name: 'Houston Area Digital Media Catalog (TX)', 
          collection_token: 'v1L1BLQAAAA2p',
        },
        {
          overdrive_id: 1172,
          name: 'Harris County Public Library (TX)', 
          collection_token: 'v1L1BQAAAAA2e',
        },
      ]);
    });
};
