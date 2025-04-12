const { reviewSchema, listingSchema, userSchema } = require("../schema.js");
const { cloudinary } = require("../cloudConfig.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.validateListing = async (req, res, next) => {
  try {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      if (req.file && req.file.filename) {
        await cloudinary.uploader.destroy(req.file.filename, {
          invalidate: true,
        });
      }
      console.log("validation error", error.message);
      throw new ExpressError(400, error.message);
    }
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports.validateReview = (req, rres, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(422, error.message);
  }
  return next();
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    throw new ExpressError(422, error.message);
  }
  return next();
};
