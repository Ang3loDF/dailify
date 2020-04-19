var express = require("express"),
    router = express.Router(),
    NYTFinder = require("../lib/news-finders/NYTFinder"),
    CNNFinder = require("../lib/news-finders/CNNFinder"),
    CNBCFinder = require("../lib/news-finders/CNBCFinder"),
    WSJFinder = require("../lib/news-finders/WSJFinder");

router.get("/", function(req, res){
    res.send("<h1>Welcome to the home page</h1>");
});

router.get("/find", async function(req, res){
    var newNews = [];
    newNews = await NYTFinder.find(newNews);
    newNews = await CNNFinder.find(newNews);
    newNews = await CNBCFinder.find(newNews);
    newNews = await WSJFinder.find(newNews);
    console.log(newNews + " " + newNews.length);
    res.send("<p>Finding...</p>");
})

module.exports = router;