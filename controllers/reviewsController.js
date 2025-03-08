const Listing = require("../models/listing.model.js");
const Review = require("../models/reviews.model.js");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let review = new Review(req.body.review);
  review.author = req.user;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listing/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let result = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  let review = await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listing/${id}`);
};
