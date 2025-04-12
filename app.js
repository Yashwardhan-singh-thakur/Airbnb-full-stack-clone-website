const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const sessionOptions = require("./config/session.js");
const connectDB = require("./config/db.js");
const User = require("./models/users.model.js");
const { filters } = require("./utils/filters.js");
const configureGoogleStrategy = require("./config/googleStrategy.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./router/listings.router.js");
const reviewRouter = require("./router/reviews.router.js");
const userRouter = require("./router/users.router.js");

const port = 3000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public/Logo")));
app.use(express.static(path.join(__dirname, "public/image")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB(); // Database connected

configureGoogleStrategy();
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.filters = filters;
  next();
});

app.use("/", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

// Error Handling Middleware
app.use("*", (req, res, next) => {
  next(new ExpressError(400, "Page not found"));
});

// Custom error handle middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  return res.status(statusCode).render("./listings/error.ejs", { message });
});

app.listen(port, () => {
  console.log("App is listening on port:", port);
});
