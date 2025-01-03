const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let listings = await Listing.find();
  res.render("AllListings/index.ejs", { listings });
};

module.exports.renderingNewForm = async (req, res) => {
  res.render("AllListings/new.ejs");
};

module.exports.renderingShowForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not existed!");
    res.redirect("/listings");
  }
  res.render("AllListings/show.ejs", { listing });
};

// module.exports.renderingNewForm = (req, res) => {
//   res.render("AllListings/new.ejs");
// };

module.exports.createListing = async (req, res, next) => {
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  let url=req.file.path;
  let filename=req.file.filename;
  newlisting.image={url,filename};
  let result = await newlisting.save();
  console.log(result);
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for editing does not existed!");
    res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url.replace("/upload", "/upload/w_200,h_200");
  res.render("AllListings/edit.ejs", { listing ,originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(404, "Bad request");
  // }
  // let l = await Listing.findById(id);
  // console.log(l);
  let { id } = req.params;
  
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
   
  );
  if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  console.log(listing);
  req.flash("success", "Listing Updated!");
  res.redirect("/listings");
};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const a = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
