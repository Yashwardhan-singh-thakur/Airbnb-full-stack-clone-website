const Listing = require("../models/listing.model.js");
const Review = require("../models/reviews.model.js");
const axios = require("axios");

// Authorization Middlewares
module.exports.isLoggedIn = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  }
  return next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  return next();
};

module.exports.isReviewOwner = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  return next();
};

module.exports.redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  return next();
};

// useing maptile api for forward Geocoding
module.exports.forwardGedcoding = async (req, res, next) => {
  try {
    if (req.body.listing.location && req.body.listing.country) {
      const key = process.env.MAP_API_KEY;
      let { location, country } = req.body.listing;
      let address = `${location} ${country}`;
      let url = ` https://api.maptiler.com/geocoding/$%7B${address}%7D.json?key=${key}`;
      let result = await axios.get(url);
      let geometry = result.data.features[0].geometry;
      req.body.listing.geometry = geometry;
      if (geometry === "undefined") {
        req.flash("error", "Please give a valid location");
      }
    }
  } catch (err) {
    next(err);
  }
  return next();
};
