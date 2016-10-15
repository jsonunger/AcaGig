import config from '../../../webpack.dev.config';

export default function (app) {
  if (process.env.NODE_ENV !== 'production') {
    const compiler = require('webpack')(config);
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    app.use(webpackHotMiddleware(compiler));
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    }));
  }
}
