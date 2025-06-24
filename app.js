require("dotenv").config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




// Route imports
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user.js");

function wrapAsync(fn) {
  return function (req, res, next) {
      fn(req, res, next).catch(next);
  };
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

  //sessions
  const sessionOptions = {
    secret: "mysupercode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 *3,
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    },
  };

  app.use(session(sessionOptions));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


  app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.del = req.flash("del");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  })


 
  

// Middleware
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes)



// 404 Error Handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
