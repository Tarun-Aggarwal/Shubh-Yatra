const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, resp) => {
	const allListings = await Listing.find({});
	resp.render("listings/index.ejs", {allListings});
};

module.exports.renderSearchResult = async (req, resp) => {
	let country = req.query.country;
	let allListings = await Listing.find({country: country});
	resp.render("listings/search.ejs", {allListings, country})
}

module.exports.renderNewForm = (req, resp) => {
	resp.render("listings/new.ejs");
};

module.exports.createListing = async (req, resp, next) => {
	let response = await geocodingClient.forwardGeocode({
		query: req.body.listing.location,
		limit: 1
	})
	.send();
	let url = req.file.path;
	let filename = req.file.filename;
	let category = req.body.listing.category;
	let newListing = new Listing(req.body.listing);
	newListing.image = {url, filename};
	newListing.owner = req.user._id;
	newListing.geometry = response.body.features[0].geometry;
	newListing.category = category;
	let savedListing = await newListing.save();
	console.log(savedListing);
	req.flash("success", "New Listing Created");
	resp.redirect("/listings");
};

module.exports.showListing = async (req, resp) => {
	let {id} = req.params;
	let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",}}).populate("owner");
	if(!listing){
		req.flash("error", "Listing You requested for does not exist!");
		resp.redirect("/listings");
	}
	resp.render("listings/show.ejs", {listing});
};

module.exports.renderEditForm = async (req, resp) => {
	let {id} = req.params;
	let listing = await Listing.findById(id);
	if(!listing){
		req.flash("error", "Listing You requested for does not exist!");
		resp.redirect("/listings");
	}
	let originalUrl = listing.image.url;
	originalUrl = originalUrl.replace("/upload", "/upload/e_blur:300");
	resp.render("listings/edit.ejs", {listing, originalUrl});
};

module.exports.updateListing = async (req, resp) => {
	let {id} = req.params;
	if(typeof req.file !== "undefined"){
		let url = req.file.path;
		let filename = req.file.filename;
		req.body.listing.image = {url, filename};
	}
	let category = req.body.listing.category;
	await Listing.findByIdAndUpdate(id, {...req.body.listing, category: category});
	req.flash("success", "Listing Updated Successfully");
	resp.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, resp) => {
	let {id} = req.params;
	await Listing.findByIdAndDelete(id);
	req.flash("success", "Listing Deleted Successfully");
	resp.redirect("/listings");
};

module.exports.renderFilteredCategory = async (req, resp) => {
	let category = req.params.category;
	const allListings = await Listing.find({category: category});
	resp.render("listings/index.ejs", {allListings, category});
};