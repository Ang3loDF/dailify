var User = require("../../lib/models/user")

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

module.exports = middleware;