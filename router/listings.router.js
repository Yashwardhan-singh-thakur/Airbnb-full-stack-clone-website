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
const listingsController = require("../controllers/listingsController.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// showAllListing & post new listing routers.
router.route("/").get(wrapAsync(listingsController.index));

// create new listing route
router
  .route("/listing")
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    forwardGedcoding,
    wrapAsync(listingsController.createNewListing)
  );

// Render new listing form.
router.route("/listing/new").get(isLoggedIn, listingsController.renderNewForm);

// Render listing category route
router
  .route("/listing/category/:category/:idx")
  .get(wrapAsync(listingsController.category));

//Show individual listing, editListing and deleteListing routers.
router
  .route("/listing/:id")
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
  "/listing/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm)
);

module.exports = router;
