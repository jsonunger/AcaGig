import passport from 'passport';
import Strategy from 'passport-facebook';

module.exports = (app, db) => {
  const User = db.model('user');

  const facebookConfig = app.getValue('env').FACEBOOK;

  const strategyFn = (accessToken, refreshToken, profile, done) => {
    User.findByEmail(profile.emails[0].value)
      .then(user => {
        if (!user) {
          return User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            facebookId: profile.id
          });
        } else if (user.facebookId && user.facebookId !== profile.id) {
          throw new Error('Account already associated with Facebook');
        } else {
          user.facebookId = user.facebookId || profile.id;
          return user.save();
        }
      })
      .then(user => done(null, user))
      .catch(function(err) {
        console.error('Error creating user from Facebook authentication', err);
        done(err);
      });

  };

  passport.use(new Strategy(facebookConfig, strategyFn));

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
};
