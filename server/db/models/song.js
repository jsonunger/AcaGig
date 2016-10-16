import Sequelize from 'sequelize';
import db from '../_db';

const definitions = {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  artist: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

const options = {};

export default db.define('song', definitions, options);
