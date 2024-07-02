const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl, validateUser } = require("../middleware");
const userController = require("../controllers/users");

//signup form and Signup User Route
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(validateUser, saveRedirectUrl, wrapAsync(userController.signupUser));

//login form and Login User Route
router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
    }),
    userController.loginSuccess
  );

//logout user
router.get("/logout", userController.logoutUser)

module.exports = router;