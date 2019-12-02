require('dotenv').config();

module.exports = {
	AT: {
		apiKey: process.env.AT_API_KEY,
		username: 'sandbox',
		format: 'json'
	}
};
