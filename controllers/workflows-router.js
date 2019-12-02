const router = require('express').Router();

const ussdModel = require('../models/ussd-model');
const nodeModel = require('../models/nodes-models');
const projectModel = require('../models/project-models');

const db = require('../database/dbConfig');

const screenGenerator = require('../helpers/screen-generator');

router.post('/ussd/:id', async (req, res) => {
	const project_id = req.params.id;

	if (!project_id) {
		res.status(400).json({
			error:
				'Please send a request with a valid project_id that has an integer value.'
		});
	}

	try {
		const parent_node = await projectModel.getParentNode(project_id);

		const splitText = req.body.text.split['*'][req.body.text.length - 1];

		const session = {
			session_id: req.body.sessionId,
			phone_num: req.body.phoneNumber,
			network_code: req.body.networkCode,
			service_code: req.body.serviceCode,
			text: splitText
		};

		let service = await ussdModel.startSession(session);

		let screen = await newscreen(service, session.text, parent_node);

		let display = await ussdModel.getScreen(screen);

		let counter = 0;
		let convertedTextOptions = await display.options
			.map(item => {
				counter++;
				return `${counter})${item}\n`;
			})
			.join('');

		res.send(`${display.text}\n${convertedTextOptions}\n`);
	} catch (error) {
		res.status(500).json({
			Error: error
		});
	}
});

router.post('/sim/:id', async (req, res) => {
	const project_id = req.params.id;
	const parent_node = await projectModel.getParentNode(project_id);

	if (!project_id) {
		res.status(400).json({
			error:
				'Please send a request with a valid project_id that has an integer value.'
		});
	}

	if (!parent_node) {
		res.status(400).json({
			error:
				'The project you were trying to access either does not exist or does not have a designated parent node.'
		});
	}

	const session = {
		session_id: req.body.user_id,
		text: req.body.text,
		workflow: project_id
	};

	try {
		let service = await ussdModel.startSession(session);

		let screen = await screenGenerator(service, session.text, parent_node);

		let display = await ussdModel.getScreen(screen);

		let counter = 0;
		let convertedTextOptions = await display.options
			.map(item => {
				counter++;
				return `${counter})${item}\n`;
			})
			.join('');

		const responseObject = { display, convertedTextOptions };

		res.status(200).send(responseObject);
	} catch (error) {
		res.status(500).json({
			Error: error
		});
	}
});

module.exports = router;
