var express = require("express"),
    router = express.Router(),
    middleware = require("./middleware")
    News = require("../lib/models/news");

// home page
router.get("/", function(req, res){
    if(req.isAuthenticated()) console.log("authenticated");
    else console.log("not authenticated");
    News.find({}).sort({date: -1}).limit(20).then(news => {
        res.render("index", {news: news});
    })
})

// profile page
router.get("/users/:userId", middleware.checkProfileOwnership, function(req, res){
    res.render("profile")
})

// respond for non-existing route
router.get("*", function(req, res){
    res.render("error", {error: "404"});
})

module.exports = router;