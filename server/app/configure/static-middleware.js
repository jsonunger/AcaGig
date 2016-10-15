import { join } from 'path';
import express from 'express';
import favicon from 'serve-favicon';

export default function (app) {
  const root = app.getValue('projectRoot');

  const npmPath = join(root, './node_modules');
  const publicPath = join(root, './public');
  const srcPath = join(root, './src');

  app.use(favicon(app.getValue('faviconPath')));
  app.use(express.static(npmPath));
  app.use(express.static(publicPath));
  app.use(express.static(srcPath));

  return app;
}
