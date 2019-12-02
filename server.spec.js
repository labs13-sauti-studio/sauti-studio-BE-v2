const request = require('supertest');
const server = require('./server.js');

describe('GET', () => {
	it('should return 200', async () => {
		const res = await request(server).get('/home');
		expect(res.status).toBe(200);
	});
});
