import Sequelize from 'sequelize';
import db from '../_db';

const definitions = {
  name: {
    type: Sequelize.STRING,
    set(val) {
      this.setDataValue('name', val.toLowerCase());
    },
    allowNull: false,
    validate: {
      len: {
        args: 2,
        msg: 'Must be at least 2 characters long'
      }
    }
  }
};

const options = {};

export default db.define('voicePart', definitions, options);
