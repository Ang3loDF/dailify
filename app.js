//require packages
var express = require("express"),
    app = express(),
    mongoose = require("mongoose");

//require routers
var indexRoutes = require("./routes/index");

//initialize enviroment variables
var port = process.env.PORT || 3000,
    databaseUrl = process.env.DATABASEURL || "mongodb://localhost:27017/web_news_assembler";

mongoose.connect(databaseUrl, {useUnifiedTopology: true, useNewUrlParser: true});

//use routes
app.use(indexRoutes);

app.listen(port, function(){
    console.log("Server has started. Listening on port " + port.toString());
});