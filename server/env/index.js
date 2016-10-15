let env;

if (process.env.NODE_ENV === 'production') {
  env = require('./production');
} else if (process.env.NODE_ENV === 'testing') {
  env = require('./testing');
} else {
  env = require('./development');
}
if (process.env.NODE_ENV !== 'testing') {
  env = {
    ...env,
    FACEBOOK: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'photos', 'emails']
    },
    GOOGLE: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    }
  };
}

export default env;
