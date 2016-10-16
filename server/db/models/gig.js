import Sequelize from 'sequelize';
import db from '../_db';
import moment from 'moment';

const definitions = {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  start: {
    type: Sequelize.DATE,
    allowNull: false
  },
  end: {
    type: Sequelize.DATE,
    get() {
      const end = this.getDataValue('end');
      if (!end) {
        const start = moment(this.getDataValue('start'));
        return new Date(start.add(2, 'hours'));
      } else {
        return end;
      }
    }
  }
};

const options = {};

export default db.define('gig', definitions, options);
