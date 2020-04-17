var express = require("express"),
    router = express.Router(),
    NYTFinder = require("../news-finders/NYTFinder"),
    CNNFinder = require("../news-finders/CNNFinder");

router.get("/", function(req, res){
    res.send("<h1>Welcome to the home page</h1>");
});

router.get("/find", async function(req, res){
    var newNews = [];
    newNews = await NYTFinder.find(newNews);
    newNews = await CNNFinder.find(newNews);
    console.log(newNews + " " + newNews.length);
    res.send("<p>Finding...</p>");
})

module.exports = router;