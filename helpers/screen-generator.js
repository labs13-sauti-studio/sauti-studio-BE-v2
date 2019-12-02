const ussdModel = require('../models/ussd-model');
const nodeModel = require('../models/nodes-models');
const projectModel = require('../models/project-models');

const db = require('../database/dbConfig');

const screenGenerator = async (curSession, request, initial_node) => {
	if (!curSession.history) curSession.history = [];

	if (!curSession.phone_num) {
		curSession.phone_num = '';
		curSession.servicecode = '';
		curSession.network_code = '';
	}

	const newSessionInfo = {
		session_id: curSession.session_id,
		phone_num: curSession.phone_num,
		service_code: curSession.service_code,
		network_code: curSession.network_code,
		text: curSession.text,
		page: curSession.page,
		history: curSession.history
	};

	let newscreen = '';

	if (request == '') {
		if (curSession.page == null) {
			let respo = await nodeModel.getNode(initial_node);

			let newscreen = respo[0]['node_id'];

			newSessionInfo.page = respo[0]['node_id'];

			curSession.history.push(newscreen);

			let update = await ussdModel.updateSessionPage(curSession, newscreen);

			return newscreen;
		} else {
			newscreen = curSession.page;

			return newscreen;
		}
	} else {
		//Go to Previous Option : 99
		if (request == '99') {
			curSession.history.pop();
			let previousPage = curSession.history[curSession.history.length - 1];
			try {
				newscreen = await nodeModel.getNode(previousPage);
				let update = await ussdModel.updateSessionPage(
					curSession,
					newscreen[0].node_id
				);

				if (!newscreen) return initial_node;

				return newscreen[0].node_id;
			} catch (error) {
				res.status(500).json({ Error: 'Unable to go back to previous node' });
			}
		}
		//Go Home Option : 00
		else if (request == '00') {
			let respo = await nodeModel.getNode(initial_node);

			let newscreen = respo[0]['node_id'];

			newSessionInfo.page = respo[0]['node_id'];

			curSession.history.push(newscreen);

			let update = await ussdModel.updateSessionPage(curSession, newscreen);

			return newscreen;
		} else if (request) {
			for (
				let possibleConnections = 1;
				possibleConnections < 10;
				possibleConnections++
			) {
				if (request === possibleConnections.toString()) {
					if (!curSession.page) curSession.page = initial_node;

					const choice = await db('nodes').where({ node_id: curSession.page });

					if (
						choice[0]['connections'][`${i - 1}`] == '' ||
						!choice[0]['connections'][`${i - 1}`]
					) {
						newscreen = curSession.page;
					} else {
						newscreen = choice[0]['connections'][`${i - 1}`];
					}

					curSession.history.push(newscreen);
					let update = await ussdModel.updateSessionPage(curSession, newscreen);

					return newscreen;
				}
			}
		}
	}
};

module.exports = screenGenerator;