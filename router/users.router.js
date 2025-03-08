const express = require("express");
const router = express.Router();
const User = require("../models/users.model.js");
const passport = require("passport");
const WrapAsync = require("../utils/WrapAsync.js");
const { redirectUrl } = require("../middlewares.js");
const userControllers = require("../controllers/users.js");

// Sign up form render and created new user routers
router
  .route("/signup")
  .get(userControllers.renderSignupForm)
  .post(redirectUrl, WrapAsync(userControllers.signup));

//Login form render and user athentication and loggedin
router
  .route("/login")
  .get(userControllers.renderLoginForm)
  .post(
    redirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),

    WrapAsync(userControllers.loggedIn)
  );

// User logout router.
router.route("/logout").get(userControllers.logout);

module.exports = router;
