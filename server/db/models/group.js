import Sequelize from 'sequelize';
import db from '../_db';
import { tz } from 'moment-timezone';

const AmericanTimezones = tz.names().filter(name => /^America\//.test(name));

const definitions = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: 2,
        msg: 'Must be at least 2 characters long'
      }
    }
  },
  timezone: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isTimezone(value) {
        if (!AmericanTimezones.includes(value)) {
          throw new Error('Must be American timezone');
        }
      }
    }
  }
};

const options = {};

export default db.define('group', definitions, options);
