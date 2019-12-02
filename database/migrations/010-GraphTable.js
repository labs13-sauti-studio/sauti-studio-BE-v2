exports.up = function(knex, Promise) {
	return knex.schema.dropTableIfExists('graphTable').then(() =>
		knex.schema.createTable('graphTable', table => {
			table.increments();
			table.string('name', 256).notNullable();
			table.string('text', 256).notNullable();
			table.specificType('Options', 'text ARRAY');
			table.specificType('Cons', 'text ARRAY');
			table.string('previous');
		})
	);
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('graphTable');
};
