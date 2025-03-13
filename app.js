let mongoUrl;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  mongoUrl = "mongodb://127.0.0.1:27017/airbnb";
} else {
  mongoUrl = process.env.DB_URL;
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.model.js");
const { filters } = require("./utils/filters.js");
const userControllers = require("./controllers/usersController.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Google Auth
const FacebookStrategy = require("passport-facebook").Strategy; // Facebook  Auth

const listingRouter = require("./router/listings.router.js");
const reviewRouter = require("./router/reviews.router.js");
const userRouter = require("./router/users.router.js");

const port = 3000;
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public/Logo")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

main()
  .then(() => console.log("Connection succesfull"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl);
}

const store = MongoStore.create({
  mongoUrl: mongoUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

app.use(session(sessionOptions));
app.use(flash());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
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
          newUser = await User.register(user, profile.id);
          await newUser.save();
        }
        return cb(null, newUser);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);
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

// Error Handling Middlewares.
app.use("*", (req, res, next) => {
  next(new ExpressError(400, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  return res.status(statusCode).render("./listings/error.ejs", { message });
});

app.listen(port, () => {
  console.log("App is listening on port:", port);
});
