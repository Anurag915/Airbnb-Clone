const User = require("../models/user.js");
module.exports.renderingSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new User({ username, email });
      const registeredUser = await User.register(newuser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "User created successfully");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  };

module.exports.renderingLoginForm = (req, res) => {
    res.render("users/login.ejs");
  };

  module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectURL || "/listings";
    res.redirect(redirectUrl);
  };

  module.exports.logout=(req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", "Logged out successfully!");
      res.redirect("/listings");
    });
  };