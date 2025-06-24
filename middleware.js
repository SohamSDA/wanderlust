const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema,userSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must login before adding a listing");
        return res.redirect("/login");
}
next();
}

module.exports.saveredirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}


module.exports.isOwner = async (req,res,next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports. validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body.listing);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports. validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  module.exports. validateUser = (req, res, next) => {
    let { error } = userSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  module.exports.isAuthor = async(req,res,next) => {
    let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You are not permitted to perform this ");
    return res.redirect(`/listings/${id}`); 
  }
  next();
  }