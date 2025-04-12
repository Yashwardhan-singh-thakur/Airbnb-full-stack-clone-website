const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().min(3).max(30).required(),
    description: Joi.string().trim().min(10).max(140).required(),
    image: Joi.string().allow("", null),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    location: Joi.string().trim().min(3).max(30).required(),
    country: Joi.string().trim().min(3).max(20).required(),
  }),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5),
    comment: Joi.string().trim().min(3).max(180).required(),
  }).required(),
});

module.exports.userSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().max(40).required(),
  password: Joi.string().trim().min(3).max(20).required(),
});
