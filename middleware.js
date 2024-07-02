const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema, reviewSchema, userSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, resp, next) => {
  req.session.redirectUrl = req.originalUrl;
  if(!req.isAuthenticated()){
    req.flash("error", "You need to logged in First!");
    return resp.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req, resp, next) => {
  if(req.session.redirectUrl){
    resp.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req, resp, next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!resp.locals.currUser._id.equals(listing.owner._id)){
    req.flash("error", "You are not the owner of this listing!");
    return resp.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async (req, resp, next) => {
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!resp.locals.currUser._id.equals(review.author._id)){
    req.flash("error", "You are not the author of this Review!");
    return resp.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req, resp, next) => {
	let {error} = listingSchema.validate(req.body);
	if(error){
		console.log(error.message);
		throw new ExpressError(400, error);
	} else{
		next();
	}
}

module.exports.validateReview = (req, resp, next) => {
	let {error} = reviewSchema.validate(req.body);
	if(error){
		console.log(error.message);
		throw new ExpressError(400, error); 
	} else{
		next();
	}
}

module.exports.validateUser = (req, resp, next) => {
	let {error} = userSchema.validate(req.body);
	if(error){
		console.log(error.message);
    throw new ExpressError(400, error); 
	} else{
		next();
	}
}