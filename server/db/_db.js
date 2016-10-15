import Sequelize from 'sequelize';
import env from '../env';

const options = {
  logging: env.LOGGING
};

export default new Sequelize(env.DATABASE_URI, options);
