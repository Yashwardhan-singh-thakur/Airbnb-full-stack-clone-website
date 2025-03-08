const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.model.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  forwardGedcoding,
} = require("../middlewares.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const { updateMany } = require("../models/reviews.model.js");
const upload = multer({ storage });

// showAllListing & post new listing routers.
router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    forwardGedcoding,
    wrapAsync(listingsController.createNewListing)
  );

// Render new listing form.
router.route("/new").get(isLoggedIn, listingsController.renderNewForm);

// Render listing category route
router.route("/category/:category/:idx").get(
  wrapAsync(async (req, res) => {
    let { category, idx: sliderIdx } = req.params;
    let listings = await Listing.find({ category: category });
    res.render("./listings/index.ejs", { listings, sliderIdx });
  })
);

//Show individual listing, editListing and deleteListing routers.
router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    forwardGedcoding,
    wrapAsync(listingsController.editListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing));

// Render edit listing form.
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm)
);

module.exports = router;
