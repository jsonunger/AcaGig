import chalk from 'chalk';
import db from './db';
import { createServer } from 'http';
import createApp from './app';

// Create a node server instance!
const server = createServer();

const createApplication = () => {
  const app = createApp(db);
  server.on('request', app);
  return null;
};

const startServer = () => {

  const PORT = process.env.PORT || 8080;

  server.listen(PORT, () => {
    console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
  });

};

db.sync()
  .then(function() {
    console.log(chalk.green('Sequelize models synced to PostgreSQL'));
    return null;
  })
  .then(createApplication)
  .then(startServer)
  .catch(err => console.error(chalk.red(err.stack)));
