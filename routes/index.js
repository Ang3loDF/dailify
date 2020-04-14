var express = require("express"),
    router = express.Router();

router.get("/", function(req, res){
    res.send("<h1>Welcome to the home page</h1>");
});

router.get("/find", function(req, res){
    res.send("<p>Finding...</p>");
})

module.exports = router;