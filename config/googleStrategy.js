const GoogleStrategy = require("passport-google-oauth20").Strategy; // Google Auth
const passport = require("passport");
const User = require("../models/users.model.js");
const { googleCallbackUrl } = require("./index.js");

const configureGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: googleCallbackUrl,
      },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          let newUser = await User.findOne({ googleId: profile.id });
          if (!newUser) {
            let user = new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
            });
            let newUser = await User.register(user, profile.id);
            await user.save();
          }
          return cb(null, newUser);
        } catch (err) {
          return cb(err, null);
        }
      }
    )
  );
};

module.exports = configureGoogleStrategy;
