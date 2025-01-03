const Listing = require("./models/listing.js");
const Review = require("./models/Reviews.js");
const { listingschema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
module.exports.isLoggedIn = (req, res, next) => {
  console.log("enter in logged in middleware");
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("error", "You need to login first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  console.log("enter in save redirect url middleware");
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }

  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.curruser._id)) {
    req.flash("error", "You are not authorized to edit this listing!");
    res.redirect(`/listings/${id}`);
    
  }
  next();
};

module.exports.validationTesting = (req, res, next) => {
  let { error } = listingschema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    console.log(errmsg);
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    console.log(errmsg);
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};


module.exports.isAuthorReview = async (req, res, next) => {
  let {id, reviewid } = req.params;
  let review = await Review.findById(reviewid);
  if (!review.author.equals(res.locals.curruser._id)) {
    req.flash("error", "You are not authorized to edit this listing!");
    res.redirect(`/listings/${id}`);
    return;
  }
  next();
}; 