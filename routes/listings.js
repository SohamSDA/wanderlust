const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js"); // Adjust path if needed
const { isOwner, validateListing } = require("../middleware.js");
const {
  index,
  newListing,
  showL,
  editL,
  newLpost,
  updateListing,
  deleteListing,
} = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const cloudinary = require("../cloudConfig.js").cloudinary;

// Fetch all listings
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(newLpost)
  );

// Form to create a new listing
router.get("/new", isLoggedIn, newListing);

// Fetch a specific listing
router
  .route("/:id")
  .get(showL)
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    updateListing
  )
  .delete(isLoggedIn, isOwner, deleteListing);

router.get("/:id/edit", isLoggedIn, isOwner, editL);

module.exports = router;
