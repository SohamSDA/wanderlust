const { userSchema } = require("../schema.js");
const User = require("../models/user"); 
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.signupPage = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.newUser = wrapAsync(async(req,res) => {
   try{
    let {username, email, password} = req.body;
    const newUser = new User({email , username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if(err){
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
    res.redirect("/listings");
    })
    
   }catch(e){
    req.flash("error", e.message); 
    res.redirect("/signup");
   }
})

module.exports.userLoginPage = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.userLogin = wrapAsync(async(req,res) => {
        req.flash("success","Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
})

module.exports.userLogout = (req, res) => {
    req.logout((err) => {
       if(err){
        next(err);
       }
       req.flash("success", "you are logged out");
       res.redirect("/listings");
    })
  }