const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
//login page
router.get("/login", (req, res) => res.render("login"));

//Register page
router.get("/register", (req, res) => res.render("register"));

//Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please Fill in all fields" });
  }

  //check password
  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }

  //Check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //gets here if validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        //user already exist
        errors.push({ msg: "User with this email already exist" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        //Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Set password to hashed
            newUser.password = hash;
            //Save User
            newUser
              .save()
              .then(user => {
                req.flash(
                  "sucess_msg",
                  "You are registered and you can now log in"
                );
                res.redirect("/user/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
//Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true
  })(req, res, next);
});

//Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/user/login");
});

module.exports = router;
