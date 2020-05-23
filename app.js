// require packages
var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    ejs = require("ejs"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),

    passportSetup = require("./config/passportSetup"),
    privateKeys = require("./config/privateKeys"),
    seed = require("./test/seed"),
    newsFind = require("./lib/news-finders/findProcess");

// require routers
var indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/user");


// initialize ejs
app.set("view engine", "ejs");


// initialize enviroment variables
var port = process.env.PORT || 3000,
    databaseUrl = process.env.DATABASE_URL || privateKeys.DATABASE_URL;


// connect with the database
mongoose.connect(databaseUrl, {useUnifiedTopology: true, useNewUrlParser: true});


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());

// passport configuration
passportSetup(app, passport);


// assing variables to every rendered page
app.use(function(req, res, next){
    //setup
    res.locals.errorMessage = req.flash("error")
    res.locals.successMessage = req.flash("success");
    res.locals.user = req.user;

    next();
})


//seed();


//launch the news finding process
newsFind.start(60000, function(){
    console.log("process ended");
})


// use routes
app.use(userRoutes);
app.use(indexRoutes);


app.listen(port, function(){
    console.log("Server has started. Listening on port " + port.toString());
});