const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./users.model.js");

const reviewSchema = Schema({
  comment: String,
  rating: { type: Number, min: 1, max: 5 },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = new mongoose.model("Review", reviewSchema);
