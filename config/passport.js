const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//User Model
const User = require("../models/User");

module.exports = passport => {
  //here passport parameter is passed from index.js
  passport.use(
    //usernamefield is replaced by email since we use email to authenticate
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //Match User
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: "That email is not registered"
            });
          }
          //Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            try {
              if (err) throw err;
            } catch (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password Incorrect" });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
