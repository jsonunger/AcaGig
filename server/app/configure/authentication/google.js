import passport from 'passport';
import OAuth2Strategy from 'passport-google-oauth';

module.exports = (app, db) => {
  const User = db.model('user');

  const googleConfig = app.getValue('env').GOOGLE;

  const strategyFn = (accessToken, refreshToken, profile, done) => {
    User.findByEmail(profile.emails[0].value)
      .then(user => {
        if (!user) {
          return User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id
          });
        } else if (user.googleId && user.googleId !== profile.id) {
          throw new Error('Account already associated with Google');
        } else {
          user.googleId = user.googleId || profile.id;
          return user.save();
        }
      })
      .then(user => done(null, user))
      .catch(function(err) {
        console.error('Error creating user from Google authentication', err);
        done(err);
      });

  };

  passport.use(new OAuth2Strategy(googleConfig, strategyFn));

  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
};
