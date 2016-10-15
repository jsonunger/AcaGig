export const createStrategyFn = (User, provider) => {
  const lowerProvider = provider.toLowerCase();
  return (accessToken, refreshToken, profile, done) => {
    User.findByEmail(profile.emails[0].value)
      .then(user => {
        if (!user) {
          return User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            [`${lowerProvider}Id`]: profile.id
          });
        } else if (user[`${lowerProvider}Id`] && user[`${lowerProvider}Id`] !== profile.id) {
          throw new Error(`Account already associated with ${provider}`);
        } else {
          user[`${lowerProvider}Id`] = user[`${lowerProvider}Id`] || profile.id;
          return user.save();
        }
      })
      .then(user => done(null, user))
      .catch(function(err) {
        console.error(`Error creating user from ${provider} authentication`, err);
        done(err);
      });
  };
};
