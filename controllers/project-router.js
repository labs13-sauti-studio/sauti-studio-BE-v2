const router = require('express').Router();
const Projects = require('../models/project-models');
const nodes = require('../models/nodes-models');
const parseGraph = require('../helpers/graph-parser');

router.get('/', async (req, res) => {
	try {
		const projects = await Projects.find();
		res.status(200).json(projects);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	if (!id)
		res.status(400).json({ message: 'The id is missing from the request.' });

	try {
		const project = await Projects.getById(id);
		if (project) {
			res.status(200).json(project);
		} else {
			res
				.status(404)
				.json({ message: 'Project with specified ID does not exist.' });
		}
	} catch (error) {
		res
			.status(404)
			.json({ message: `The reason you're getting an error: ${error}` });
	}
});

router.get('/user/:id', async (req, res) => {
	const { id } = req.params;

	if (!id)
		res.status(400).json({ message: 'The id is missing from the request.' });

	try {
		const project = await Projects.getByUserId(id);
		if (project) {
			res.status(200).json(project);
		} else {
			res
				.status(404)
				.json({ message: 'Project with specified user Id does not exist.' });
		}
	} catch (error) {
		res
			.status(404)
			.json({ message: `The reason you're getting an error: ${error}` });
	}
});

router.post('/', async (req, res) => {
	const { project_title, graph_json, user_id, initial_node_id } = req.body;

	if (!project_title || !graph_json || !user_id || initial_node_id)
		res.status(400).json({
			message:
				'Please make sure the following are included in your request when adding a project: project_title, graph_json, user_id, initial_node_id'
		});

	const project_data = {
		project_title,
		graph_json,
		user_id,
		initial_node_id
	};

	try {
		res.status(201).json(await Projects.add(project_data));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { project_title, graph_json, user_id, initial_node_id } = req.body;

	if (!id)
		res.status(400).json({ message: 'The id is missing from the request.' });

	if (!project_title || !graph_json || !user_id || initial_node_id)
		res.status(400).json({
			message:
				'Please make sure the following are included in your request when adding a project: project_title, graph_json, user_id, initial_node_id'
		});

	const project_data = {
		id,
		project_title,
		graph_json,
		user_id,
		initial_node_id
	};

	try {
		res.status(200).json(await Projects.update(project_data));
	} catch (error) {
		res.status(500).json({
			message: `Unable to update the question ${id}`
		});
	}
});

router.delete('/:id', async (req, res) => {
	let { id } = req.params;

	if (!id)
		res.status(400).json({ message: 'The id is missing from the request.' });

	try {
		const deleteNodes = await nodes.deleteAllProjectNodes(id);

		const deleteRes = await Projects.remove(id);

		if (deleteRes)
			res.status(200).json({
				message: 'You have successfully deleted the Project',
				current: deleteRes
			});
	} catch (error) {
		res.status(500).json({ message: 'Unable to delete this Project.' });
	}
});

router.delete('/user/:id', async (req, res) => {
	let { id } = req.params;

	if (!id)
		res.status(400).json({ message: 'The id is missing from the request.' });

	try {
		const deleteRes = await Projects.removeAll(id);
		if (deleteRes)
			res.status(200).json({
				message: 'You have successfully deleted the Projects',
				current: deleteRes
			});
	} catch (error) {
		res.status(500).json({ message: 'Unable to delete these Projects.' });
	}
});

router.post('/publish/:id', async (req, res) => {
	const { id } = req.params;
	const { project_title, graph_json, user_id, initial_node_id } = req.body;

	if (!id)
		res.status(400).json({ message: 'The id is missing from the request.' });

	if (!project_title || !graph_json || !user_id || initial_node_id)
		res.status(400).json({
			message:
				'Please make sure the following are included in your request when publishing a project: project_title, graph_json, user_id, initial_node_id'
		});

	const project_data = {
		id,
		project_title,
		graph_json,
		user_id,
		initial_node_id
	};

	try {
		await Projects.update(project_data);
		const successful = await parseGraph(project_data);
		return res
			.status(200)
			.json({ message: 'Publishing successful!', successful });
	} catch (error) {
		res.status(500).json({
			message: `Unable to publish Project #${id}`
		});
	}
});

module.exports = router;
