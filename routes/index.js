var express = require("express"),
    router = express.Router(),
    NYTFinder = require("../news-finders/NYTFinder");

router.get("/", function(req, res){
    res.send("<h1>Welcome to the home page</h1>");
});

router.get("/find", function(req, res){
    var newNews = [];
    newNews = NYTFinder.find(newNews);
    console.log(newNews + " " + newNews.length);
    res.send("<p>Finding...</p>");
})

module.exports = router;