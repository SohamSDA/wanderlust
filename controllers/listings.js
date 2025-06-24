const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js"); // Adjust path if needed

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showL = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("del", "Listing does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.editL = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/update.ejs", { listing });
};

module.exports.newLpost = async (req, res) => {
  const url = req.file.path;
  const filename = req.file.filename;
  if (!url || !filename) {
    req.flash("error", "Image upload failed. Please try again.");
    return res.redirect("/listings/new");
  }

  const { title, description, image, price, location, country } = req.body;
  const newListing = new Listing({
    title,
    description,
    image,
    price,
    location,
    country,
  });
  newListing.owner = req.user._id;
  newListing.image = { url, filename }; // Set the image field with the uploaded file details
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.updateListing = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(id, { ...req.body });

  if (typeof req.file !== "undefined" && req.file !== null) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename }; // Update the image field with the new file details
    await listing.save();
  }
  req.flash("success", "listing Updated!");
  res.redirect(`/listings/${id}`);
});

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("del", " Listing deleted!");
  res.redirect("/listings");
};
