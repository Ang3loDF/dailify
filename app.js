// require packages
var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    ejs = require("ejs"),
    bodyParser = require("body-parser"),
    passport = require("passport"),

    passportSetup = require("./config/passportSetup"),
    seed = require("./test/seed"),
    newsFind = require("./lib/news-finders/findProcess");

// require routers
var indexRoutes = require("./routes/index"),
    authRoutes = require("./routes/auth");

// initialize ejs
app.set("view engine", "ejs");

// initialize enviroment variables
var port = process.env.PORT || 3000,
    databaseUrl = process.env.DATABASEURL || "mongodb://localhost:27017/web_news_combinator";

// connect with the database
mongoose.connect(databaseUrl, {useUnifiedTopology: true, useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));

// passport configuration
passportSetup(app, passport);

//seed();

//launch the news finding process
newsFind.start(60000, function(){
    console.log("process ended");
})


// use routes
app.use(indexRoutes);
app.use(authRoutes);

app.listen(port, function(){
    console.log("Server has started. Listening on port " + port.toString());
});