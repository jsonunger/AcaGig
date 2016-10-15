require('dotenv').config();

module.exports = {
  DATABASE_URI: 'postgres://localhost:5432/acagig',
  SESSION_SECRET: process.env.SESSION_SECRET,
  LOGGING: false
};
