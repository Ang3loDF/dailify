var express = require("express"),
    router = express.Router();

var NYTscraper = require("../scrapers/NYTscraper");

router.get("/", function(req, res){
    res.send("<h1>Welcome to the home page</h1>");
});

router.get("/scrape", function(req, res){
    NYTscraper.scrape();
    res.send("<p>Scraped</p>");
})

module.exports = router;