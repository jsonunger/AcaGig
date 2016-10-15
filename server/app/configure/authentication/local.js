import passport from 'passport';
import { Strategy } from 'passport-local';

module.exports = function(app, db) {

  const User = db.model('user');

  const strategyFn = (email, password, done) => {
    User.findByEmail(email)
      .then(user => {
        if (!user || !user.correctPassword(password)) {
          done(null, false);
        } else {
          done(null, user);
        }
      })
      .catch(done);
  };

  const login = (req, res, next, user) => {
    return req.login(user, signupErr => {
      if (signupErr) return next(signupErr);
      res.status(201).json({
        user: user.sanitize()
      });
    });
  };

  passport.use(new Strategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

  app.post('/signup', (req, res, next) => {
    User.findByEmail(req.body.email)
      .then(user => {
        if (user) {
          const err = new Error('Email already associated with a user');
          err.status = 409;
          return next(err);
        }
        return User.create(req.body);
      })
      .then(user => login(res, res, next, user))
      .catch(next);
  });

  app.post('/login', (req, res, next) => {
    const authCb = (err, user) => {
      if (err) return next(err);

      if (!user) {
        const error = new Error('Invalid login credentials.');
        error.status = 401;
        return next(error);
      }

      return login(req, res, next, user);
    };

    passport.authenticate('local', authCb)(req, res, next);
  });
};
