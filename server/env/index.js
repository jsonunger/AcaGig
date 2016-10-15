let configPath;

if (process.env.NODE_ENV === 'production') {
  configPath = require('./production');
} else if (process.env.NODE_ENV === 'testing') {
  configPath = require('./testing');
} else {
  configPath = require('./development');
}

export default configPath;
