import Sequelize from 'sequelize';
import env from '../env';

const options = {
  logging: env.LOGGING || console.log
};

export default new Sequelize(env.DATABASE_URI, options);
