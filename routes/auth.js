var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../lib/models/user");

// login form route
router.get("/login", function(req, res){
    if(req.isAuthenticated()) console.log("authenticated");
    else console.log("not authenticated");
    res.render("auth/login");
})

// login logic route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: {type: "error", message: "Username or password incorrect."},
    successFlash: {type: "success", message: "Correctly logged-in."}
}), function(){
})

// register form route
router.get("/register", function(req, res){
    if(req.isAuthenticated()) console.log("authenticated");
    else console.log("not authenticated");
    res.render("auth/register");
})

// register logic route
router.post("/register", function(req, res){
    const newUser = new User({email: req.body.email})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", "Something went wrong. Try again.")
            return res.redirect("/register")
        }
        
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Correctly registered.")
            res.redirect("/");
        })
    })
})

// loagout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Correctly logged-out.")
    res.redirect("/");
})

module.exports = router;