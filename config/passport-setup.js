const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  // pass on the user id
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // find user and pass them on
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      // check if user already exists
      User.findOne({ googleId: profile.id }).then(existingUser => {
        console.log("profile:", profile);
        if (existingUser) {
          //if they exist, get them
          console.log("existing user found:", existingUser);
          done(null, existingUser);
        } else {
          // if not, create user in db
          try {
            newUser = User.create({
              username: profile.displayName,
              googleId: profile.id,
              thumbnail: profile._json.picture
            }).then(newUser => {
              console.log("New user created:", newUser);
              done(null, newUser);
            });
          } catch (err) {
            console.log("Error creating user:", err);
            done(err, null);
          }
        }
      });
    }
  )
);
