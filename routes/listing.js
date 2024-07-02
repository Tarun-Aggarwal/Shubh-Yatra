if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isOwner, validateListing} = require("../middleware");
const listingController = require("../controllers/listings");

const multer  = require('multer')
const {storage} = require("../cloudConfig");
const upload = multer({ storage });

//index and create Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.createListing));

//Search Route
router.get("/search", listingController.renderSearchResult);

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show, Update and Delete Route
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Category Filter
router.get("/category/:category", listingController.renderFilteredCategory);


module.exports = router;
