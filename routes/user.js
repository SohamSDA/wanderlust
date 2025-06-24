const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Make sure this is at the top
const { userSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js"); // Adjust path if needed
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveredirectUrl,validateUser } = require("../middleware.js");
const {signupPage,newUser,userLoginPage,userLogin,userLogout} = require("../controllers/users")



router.route("/signup")
.get(signupPage)
.post( validateUser, newUser)

router.route("/login")
.get( userLoginPage)
.post(saveredirectUrl, passport.authenticate("local", {failureRedirect: '/login',failureFlash: true}), userLogin)

router.get("/logout", userLogout)

module.exports = router;