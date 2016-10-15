import { join } from 'path';
import { red, yellow, cyan } from 'chalk';
import { format, log, inspect } from 'util';
import env from '../../env/';

const rootPath = join(__dirname, '../../../');
const indexPath = join(rootPath, './public/index.html');
const faviconPath = join(rootPath, './server/app/views/favicon.ico');

const logMiddleware = ({ method, path, query, body }, res, next) => {
  log(('---NEW REQUEST---'));
  console.log(format(red('%s: %s %s'), 'REQUEST', method, path));
  console.log(format(yellow('%s: %s'), 'QUERY', inspect(query)));
  console.log(format(cyan('%s: %s'), 'BODY', inspect(body)));
  next();
};

export default function (app) {
  app.setValue('env', env);
  app.setValue('projectRoot', rootPath);
  app.setValue('indexHTMLPath', indexPath);
  app.setValue('faviconPath', faviconPath);
  app.setValue('log', logMiddleware);
}
