const User = require("../models/user");

module.exports.renderSignupForm = (req, resp) => {
  resp.render("users/signup.ejs");
};

module.exports.signupUser = async(req, resp, next) => {
  try{
    let {username, email, password} = req.body.user;
    let newUser = new User({
      username: username,
      email: email,
    });
    await User.register(newUser, password);
    req.login(newUser, (err) => {
      if(err){
        return next(err);
      }
      let redirectUrl = resp.locals.redirectUrl || "/listings";
      req.flash("success", "Welcome to WanderLust");
      resp.redirect(redirectUrl);
    })
  } catch(err){
    console.log(err);
    req.flash("error", err.message);
    resp.redirect("/signup") 
  }
};

module.exports.renderLoginForm = (req, resp) => {
  resp.render("users/login.ejs");
};

module.exports.loginSuccess = async(req, resp) => {
  req.flash("success", "Welcome Back to WanderLust!");
  let redirectUrl = resp.locals.redirectUrl || "/listings";
  resp.redirect(redirectUrl);
};

module.exports.logoutUser = (req, resp, next) => {
  if(!req.isAuthenticated()){
    req.flash("error", "You are already logged out!");
    return resp.redirect("/listings");
  }
  req.logout((err) => {
    if(err){
      return next(err);
    }
    req.flash("success", "You logged out successfully!");
    resp.redirect("/listings");
  });
};