require('dotenv').config();

module.exports = {
  DATABASE_URI: 'postgres://localhost:5432/acagig',
  SESSION_SECRET: process.env.SESSION_SECRET,
  LOGGING: console.log,
  FACEBOOK: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
  },
  GOOGLE: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }
};
