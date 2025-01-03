if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const methodoverride = require("method-override");
app.use(methodoverride("_method"));
engine = require("ejs-mate");
app.engine("ejs", engine);
const ExpressError = require("./utils/ExpressError.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const dburl=process.env.ATLASDB_URL;
async function main(params) {
  await mongoose.connect(dburl);
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

const store=MongoStore.create({
  mongoUrl:dburl,
  touchAfter:24*60*60,
  crypto:{
    secret:process.env.SECRET,
  }
});
store.on("error",function(e){
  console.log("Session store error",e);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser=req.user;
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/demouser", async (req, res) => {
  let fakeuser = new User({
    email: "student@gmail.com",
    username: "anurag",
  });
  let newuser = await User.register(fakeuser, "abc123@#");
  res.send(newuser);
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//Review post request

// app.get('/testlisting',async (req,res)=>{
//     let newData=new Listing({
//         title:'Test Listing',
//         description:'This is a test listing',
//         image:"",
//         price:100,
//         location:'Test Location',
//         country:'Test Country',
//     });
//     let result=await newData.save();
//     console.log(result);
//     res.send('Test Listing');
// });

// app.use((err,req,res,next)=>{
//     res.send("something went wrong!");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});
app.use((err, req, res, next) => {
  let { statuscode = 400, message = "something went wrong" } = err;
  res.status(statuscode).render("AllListings/error.ejs", { err });
  // res.status(statuscode).send({message});
});
app.listen(3000, () => console.log("Server Started"));
