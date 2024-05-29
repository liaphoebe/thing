
exports.up = async knex => {
  return Promise.all([
    knex.schema.table('questions', function(table) {
        table.boolean('submitted').defaultTo(false);
        table.boolean('correctAnswer').defaultTo(false);
    }),
    knex.schema.table('answers', function(table) {
        table.boolean('selected').defaultTo(false);
    })
  ])
};

exports.down = async knex => {
    return Promise.all([
        knex.schema.table('questions', function (table) {
            table.dropColumn('submitted');
            table.dropColumn('correctAnswer');
        }),
        knex.schema.table('answers', function (table) {
            table.dropColumn('selected');
        })
    ])
};
