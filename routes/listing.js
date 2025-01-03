const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validationTesting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});
//rendering new form route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderingNewForm));
router.get("/new", isLoggedIn, listingController.renderingNewForm);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//index route
//create route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validationTesting,
    wrapAsync(listingController.createListing)
  );


//delete route
//show route
router
  .route("/:id")
  .put(isLoggedIn, isOwner,upload.single('listing[image]'),validationTesting, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))
  .get(wrapAsync(listingController.renderingShowForm));

module.exports = router;
