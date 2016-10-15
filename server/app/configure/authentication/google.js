import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { createStrategyFn } from './utils';

module.exports = (app, db) => {
  const googleConfig = app.getValue('env').GOOGLE;

  const strategyFn = createStrategyFn(db.model('user'), 'Google');

  passport.use(new OAuth2Strategy(googleConfig, strategyFn));

  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => res.redirect('/'));
};
