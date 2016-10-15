import passport from 'passport';
import Strategy from 'passport-facebook';
import { createStrategyFn } from './utils';

module.exports = (app, db) => {
  const facebookConfig = app.getValue('env').FACEBOOK;

  const strategyFn = createStrategyFn(db.model('user'), 'Facebook');

  passport.use(new Strategy(facebookConfig, strategyFn));

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => res.redirect('/'));
};
