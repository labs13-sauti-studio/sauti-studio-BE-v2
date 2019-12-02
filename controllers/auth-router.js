const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Users = require('../models/user-models');

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		prompt: 'select_account'
	})
);

router.get(
	'/google/redirect',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		res
			.status(200)
			.cookie('token', res.req.authInfo)
			.cookie('user_id', req.user.id)
			.redirect(`${process.env.FRONTEND_URL}/profile/${req.user.id}`);
	}
);

router.get(
	'/facebook',
	passport.authenticate('facebook', {
		authType: 'reauthenticate',
		scope: ['public_profile', 'email']
	})
);

router.get(
	'/facebook/redirect',
	passport.authenticate('facebook'),
	(req, res) => {
		res.status(200).redirect(`${process.env.FRONTEND_URL}/workflows`);
	}
);

module.exports = router;
