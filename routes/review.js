const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing");
const Review = require("../models/Reviews");
const { validateReview, isLoggedIn,isAuthorReview } = require("../middleware.js");
const { postReview, deleteReview } = require("../controllers/review");

router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(postReview)
);

router.delete(
  "/:reviewid",isLoggedIn,isAuthorReview,
  wrapAsync(deleteReview)
);

module.exports = router;
