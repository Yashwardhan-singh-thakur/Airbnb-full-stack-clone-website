const express = require("express");
const router = express.Router();
const passport = require("passport");
const WrapAsync = require("../utils/WrapAsync.js");
const { validateUser } = require("../middleware/validation.js");
const { redirectUrl } = require("../middleware/middlewares.js");
const userControllers = require("../controllers/usersController.js");

// Sign up form render and created new user routers
router
  .route("/signup")
  .get(userControllers.renderSignupForm)
  .post(redirectUrl, validateUser, WrapAsync(userControllers.signup));

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

// Callback route - Google redirects here after authentication
router.route("/auth/google/callback").get(
  redirectUrl,
  passport.authenticate("google", {
    failureRedirect: "/login",
    scope: ["profile", "email"],
    failureFlash: true,
  }),
  userControllers.googleAuthUserRegister
);
module.exports = router;
