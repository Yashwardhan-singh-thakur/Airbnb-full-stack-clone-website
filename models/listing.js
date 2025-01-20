const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./reviews.js");
const User = require("./users.js");
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: { type: String },
    filename: { type: String },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  category: {
    type: String,
    enum: [
      "Trending",
      "Domes",
      "Rooms",
      "Farms",
      "Amazing pools",
      "A-frames",
      "Beachfront",
      "Creative spaces",
      "Earth homes",
      "Artic",
      "Castels",
      "Bed&breakfast",
      "Camping",
      "Boats",
      "Houseboat",
      "Golfing",
      "Skiing",
      "Towers",
      "Camper vans",
      "Mountains",
    ],
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    let review = await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;
