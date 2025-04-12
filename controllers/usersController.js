const User = require("../models/users.model.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user = new User({
      username,
      email,
    });
    let newUser = await User.register(user, password);
    req.login(newUser, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome to Wanderlust ${req.user.username}!`);
      let redirectUrl = res.locals.redirectUrl || "/";
      return res.redirect(redirectUrl);
    });
  } catch (err) {
    if (err.name === "UserExistsError") {
      req.flash("error", "A user with the given email is already registered.");
      return res.redirect("/signup");
    }
    throw err;
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loggedIn = async (req, res) => {
  req.flash("success", `Welcome to Wanderlust ${req.user.username}!`);
  let redirectUrl = res.locals.redirectUrl || "/";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully logged out!");
    res.redirect("/login");
  });
};

// google auth configration
module.exports.googleAuthUserRegister = (req, res) => {
  // Successful authentication, redirect home.
  let redirectUrl = res.locals.redirectUrl || "/";
  req.flash("success", `Welcome to Wanderlust ${req.user.username}!`);
  res.redirect(redirectUrl);
};
