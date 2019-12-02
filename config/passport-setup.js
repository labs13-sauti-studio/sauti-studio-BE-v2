const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Users = require('../models/user-models');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      verifyGoogleUser({ profile, token: accessToken }, done);
    }
  )
);

const verifyGoogleUser = async (userData, done) => {
  const { profile, token } = userData;
  const user = await Users.getByEmail(profile.emails[0].value).catch(err =>
    console.error(err)
  );

  try {
    if (!user) {
      const [id] = await Users.add({
        display_name: profile.displayName,
        email: profile.emails[0].value,
        google_id: profile.id,
        pic: profile._json.picture,
      });
      done(null, await Users.getById(id), token);
    } else {
      done(null, user, token);
    }
  } catch (err) {
    console.error(err);
  }
};

