exports.seed = function(knex, Promise) {
	return knex('settings')
		.del()
		.then(function() {
			return knex('settings').insert([
				{
					user_id: 1,
					expanded: true,
					expandParent: true,
					addAsFirstChild: true
				}
			]);
		});
};
