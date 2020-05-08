var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    middleware = require("./middleware")
    User = require("../lib/models/user");


// login form route
router.get("/login", function(req, res){
    res.render("auth/login");
})


// login logic route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/news",
    failureRedirect: "/login",
    failureFlash: {type: "error", message: "Username or password incorrect."},
    successFlash: {type: "success", message: "Correctly logged-in."}
}), function(){
})


// register form route
router.get("/register", function(req, res){
    res.render("auth/register");
})


// register logic route
router.post("/register", middleware.validateInputs, function(req, res){
    
    // create the user object
    const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        interests: req.body.topics,
        registrationDate: Date(Date.now())
    })

    // register the user with the passord
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", "Something went wrong. Try again.")
            return res.redirect("/register")
        }
        
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Correctly registered.")
            res.redirect("/news");
        })
    })
})


// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Correctly logged-out.")
    res.redirect("/news");
})


// profile page - route
router.get("/users/:userId", middleware.checkProfileOwnership, function(req, res){
    
    // find the user
    User.findById(req.params.userId, function(err, user){
        if(err) return res.render("error", {error: "404"})

        res.render("profile/profile", {user: user})
    })
    
})


// get the profile edit form - route
router.get("/users/:userId/edit", middleware.checkProfileOwnership, function(req, res){
    
    // find the user
    User.findById(req.params.userId, function(err, user){
        if(err) return res.render("error", {error: "404"})

        res.render("profile/edit", {user: user});
    })
})


// update the user logic - route
router.put("/users/:userId", middleware.checkProfileOwnership, middleware.validateInputs, function(req, res){
    
    // find the user
    User.findById(req.params.userId, function(err, user){
        if(err){
            req.flash("error", "Something went wrong. Try again.")
            return res.redirect("/users/" + req.params.userId);
        }

        // get interests through input name 'topics'
        user.interests = req.body.topics;
        // get name through input name 'name'
        user.name = req.body.name;
        // save the updated user
        user.save();

        req.flash("success", "Accout succesfully upgrated")
        res.redirect("/users/" + req.params.userId);
    })
})


// update the password logic - route
router.put("/users/:userId/password", middleware.checkProfileOwnership, middleware.validateInputs, function(req, res){
    
    // find the user
    User.findById(req.params.userId, function(err, user){
        if(err){
            req.flash("error", "Something went wrong. Try again.")
            return res.redirect("/users/" + req.params.userId);
        }

        // get the password through input name 'password' and update with passport-local-mongoose method
        user.setPassword(req.body.password, function(){
            user.save();
            
            req.flash("success", "Pasword succesfully upgrated")
            res.redirect("/users/" + req.params.userId);
        })
        
    })
})


module.exports = router;