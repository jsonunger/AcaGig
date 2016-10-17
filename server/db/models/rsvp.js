import Sequelize from 'sequelize';
import db from '../_db';

const definitions = {
  reply: {
    type: Sequelize.ENUM,
    values: ['YES', 'NO', 'MAYBE'],
    allowNull: false,
    validate: {
      isIn: {
        args: [['YES', 'NO', 'MAYBE']],
        msg: 'Must be either yes, no, or maybe'
      }
    },
    set(val) {
      this.setDataValue('reply', val.toUpperCase());
    }
  }
};

const options = {};

export default db.define('rsvp', definitions, options);
