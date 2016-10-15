let env;

if (process.env.NODE_ENV === 'production') {
  env = require('./production');
} else if (process.env.NODE_ENV === 'testing') {
  env = require('./testing');
} else {
  env = require('./development');
}

if (env.FACEBOOK) {
  env.FACEBOOK.profileFields = ['id', 'displayName', 'photos', 'emails'];
}

export default env;
