exports.up = function(knex, Promise) {
  return knex.schema.createTable('responses', tbl => {
    tbl.increments();
    tbl.string('text');
    tbl
      .integer('owner')
      .references('id')
      .inTable('responses')
      .unsigned()
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .integer('workflow')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('workflows');
    tbl.integer('index');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('responses');
};
