const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router.get("/logout", userController.logout);

router
  .route("/signup")
  .get(userController.renderingSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  )
  .get(userController.renderingLoginForm);

module.exports = router;
