import { extname } from 'path';
import express from 'express';
import configure from './configure';

export default function (db) {
  const app = express();
  configure(app, db);

  // Routes go here

  // Middleware for catching URLs with file extensions
  app.use(({ path }, { sendStatus }, next) => {
    if (extname(path).length) {
      sendStatus(404);
    } else {
      next(null);
    }
  });

  app.get('*', (req, { sendFile }) => sendFile(app.get('indexHTMLPath')));

  // Error handling
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });

  return app;
}
