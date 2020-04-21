var express = require("express"),
    router = express.Router(),
    NYTFinder = require("../lib/news-finders/NYTFinder"),
    CNNFinder = require("../lib/news-finders/CNNFinder"),
    CNBCFinder = require("../lib/news-finders/CNBCFinder"),
    WSJFinder = require("../lib/news-finders/WSJFinder"),
    News = require("../lib/models/news");

router.get("/", function(req, res){
    News.find({}).sort({date: -1}).limit(20).then(news => {
        res.render("index.ejs", {news: news});
    })
});

module.exports = router;