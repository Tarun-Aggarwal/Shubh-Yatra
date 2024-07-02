const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview = async (req, resp) => {
	let listing = await Listing.findById(req.params.id);
	let newReview = new Review(req.body.review);
	newReview.author = req.user._id;
	listing.reviews.push(newReview);
	await newReview.save();
	await listing.save();
	req.flash("success", "New Review Created");
	resp.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, resp) => {
	let {id, reviewId} = req.params;
	await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	await Review.findByIdAndDelete(id);
	req.flash("success", "Review Deleted Successfully");
	resp.redirect(`/listings/${id}`);
}