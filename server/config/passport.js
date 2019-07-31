const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("../models/User");

module.exports = passport => {
  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: process.env.SPOTIFY_REDIRECT_URI
      },
      (accessToken, refreshToken, expires_in, profile, done) => {
        User.findOne({ spotifyId: profile.id }, (err, user) => {
          if (err) {
            return done(err);
          }

          if (!user) {
            const now = new Date();
            const { displayName, id, email } = profile;
            const user = new User({
              spotifyId: id,
              name: displayName,
              email,
              accessToken,
              accessTokenExpiry: now.setSeconds(now.getSeconds() + expires_in),
              refreshToken
            });
            user.save(function(err) {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            return done(err, user);
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
