const User = require("../models/users.js");

module.exports.renderSignupForm = (req, res) => {
  console.log("hellow");
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
      req.flash("success", "Welcome to Wanderlust", newUser.username);
      let redirectUrl = res.locals.redirectUrl || "/listings";
      return res.redirect(redirectUrl);
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loggedIn = async (req, res) => {
  try {
    let { username } = req.body;
    req.flash("success", "Welcome to Wanderlust", username, "!");
    console.log(req.session.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/login");
  }
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
