var User = require("../../lib/models/user"),
    publicValues = require("../../config/publicValues");

var middleware = {}

middleware.checkProfileOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.userId, function(err, user){
            if(!err){
                if(user && user._id.equals(req.user._id)){
                    next();
                } else {
                    res.render("error", {error: "404"})
                }
            } else {
                req.flash("error", "Something went wrond. Try later.");
                res.redirect("/");
            }
        })
    } else {
        res.render("error", {error: "404"})
    }
}


// check the validity of any user inputs
middleware.validateInputs = function (req, res, next) {
    
    // if an email is passed check its validity
    if (req.body.email) {
        var mailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var maxLength = 254;
        // check the format and the max length
        if (!req.body.email.match(mailFormat) || req.body.email.length > 254){
            req.flash("error", "Invalid email");
            return res.redirect("back");
        }
    }

    // if a password is passed check its validity
    if (req.body.password) {
        var maxLength = 20;
        // check the max length
        if (req.body.password.length > maxLength) {
            req.flash("error", "Password must be shorter than " + maxLength + " characters");
            return res.redirect("back");
        }
    }

    // if a name is passed check its validity
    if (req.body.name) {
        var maxLength = 50;
        // check the max length
        if (req.body.name.length > maxLength) {
            req.flash("error", "Name must be shorter than " + maxLength + " characters");
            return res.redirect("back");
        }
    }

    // if topics are passed remove any non-valid topic
    if (req.body.topics) {
        for (let i = 0; i < req.body.topics.length; i++) {
            if (!publicValues.newsTopics.includes(req.body.topics[i])) {
                req.body.topics.splice(i, 1);
            }
        }
    }

    next();
}

module.exports = middleware;