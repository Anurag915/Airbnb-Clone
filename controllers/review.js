const Listing = require("../models/listing.js");
const Review = require("../models/Reviews.js");

module.exports.postReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review._id);
  await review.save();
  const a = await listing.save();
  req.flash("success", "New Review Added!");

  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewid } = req.params;
  let listing = await Listing.findById(id);

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  let review = await Review.findByIdAndDelete(reviewid);
  await listing.save();
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${listing._id}`);
};
