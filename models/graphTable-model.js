const db = require('../database/dbConfig');

module.exports = {
	find,
	insert
};

function find(filter) {
	return db('graphTable').where(filter);
}

async function insert(rowData) {
	const { name } = rowData;
	const [alreadyNode] = await db('graphTable').where({ name });

	if (alreadyNode) {
		updatedNode = await db('graphTable')
			.where({ name })
      .update(rowData);
		return updatedNode;
	}

	return db('graphTable')
		.insert(rowData)
		.then(id => {
			db('graphTable').where({ name: rowData.name });
		})
		.catch(err => {throw err});
}

