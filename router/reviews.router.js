const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const { validateReview } = require("../middleware/validation.js");
const { isLoggedIn, isReviewOwner } = require("../middleware/middlewares.js");
const reviewsControllers = require("../controllers/reviewsController.js");

// Review Routing...................................

// reviews post route
router
  .route("/")
  .post(validateReview, isLoggedIn, wrapAsync(reviewsControllers.createReview));

//  review delete route
router
  .route("/:reviewId")
  .delete(
    isLoggedIn,
    isReviewOwner,
    wrapAsync(reviewsControllers.destroyReview)
  );

module.exports = router;
