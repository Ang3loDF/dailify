var express = require("express"),
    router = express.Router(),
    News = require("../lib/models/news");

router.get("/", function(req, res){
    if(req.isAuthenticated()) console.log("authenticated");
    else console.log("not authenticated");
    News.find({}).sort({date: -1}).limit(20).then(news => {
        res.render("index.ejs", {news: news});
    })
})

module.exports = router;