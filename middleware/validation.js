const { reviewSchema, listingSchema, userSchema } = require("../schema.js");
const { cloudinary } = require("../cloudConfig.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.validateListing = async (req, res, next) => {
  try {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      await cloudinary.uploader.destroy(req.file.filename, {
        invalidate: true,
      });
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
    req.flash("error", error.message);
    let { id } = req.params;
    return res.redirect(`/listing/${id}`);
  }
  return next();
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    req.flash("error", error.message);
    return res.redirect("/signup");
  }
  return next();
};
