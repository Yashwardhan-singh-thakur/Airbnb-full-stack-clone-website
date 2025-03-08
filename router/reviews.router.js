const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/users.model.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.model.js");
const Review = require("../models/reviews.model.js");
const {
  isLoggedIn,
  isReviewOwner,
  validateReview,
} = require("../middlewares.js");
const reviewsControllers = require("../controllers/reviews.js");

// Review Routing...................................

// reviews post route
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewsControllers.createReview)
);

//  review delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviewsControllers.destroyReview)
);

module.exports = router;
