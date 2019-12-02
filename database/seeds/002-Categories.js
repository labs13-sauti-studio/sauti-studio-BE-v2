exports.seed = function(knex, Promise) {
	return knex('categories').insert([
		{ user_id: 1, category: 'Fun' },
		{ user_id: 1, category: 'Info' }
	]);
};
