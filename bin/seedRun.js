import Bluebird from 'bluebird';
import { join } from 'path';
import chalk from 'chalk';
import db from '../server/db';
import filesystem from 'fs';
import program from 'commander';
import pluralize from 'pluralize';

const fs = Bluebird.promisifyAll(filesystem);

const status = {};

program
  .usage('[options]')
  .description('Seeds the AcaGig database')
  .option('-f, --force', 'Force sync (will delete everything currently in the database)')
  .parse(process.argv);

function seedDB () {
  console.log(chalk.green(`${program.force ? 'Force s' : 'S'}eeding the database`));
  return fs.readdirAsync(join(__dirname, '..', 'seedFiles'))
    .then(collections => Bluebird.map(collections, seedCollection));
}

function seedCollection (collection) {
  const modelName = collection.slice(0, -5);
  const model = db.model(modelName);
  const upperModelName = pluralize(modelName).toUpperCase();
  console.log(chalk.cyan(`Seeding ${chalk.red(upperModelName)}`));
  return fs.readFileAsync(join(__dirname, '..', 'seedFiles', collection), 'utf8')
    .then(contents => {
      const instances = JSON.parse(contents);
      status[modelName] = instances.length;
      return Bluebird.map(instances, instance => model.create(instance));
    });
}

db.sync({ force: program.force })
  .then(seedDB)
  .then(() => process.exit())
  .catch(err => {
    console.error(err.message);
    console.error(err.errors);
    process.exit(1);
  });

process.on('exit', code => {
  if (code === 0) {
    Object.keys(status).forEach(key => {
      let name = pluralize(key, status[key]);
      console.log(`${status[key]} ${chalk.red(name.toUpperCase())} seeded`);
    });
  }
});
