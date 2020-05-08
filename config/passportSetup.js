var LocalStrategy = require("passport-local"),
    privateKeys = require("./privateKeys"),
    User = require("../lib/models/user");

function setup(app, passport){
    app.use(require("express-session")({
        secret: privateKeys.SESSION_KEY,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    // use the email credential to find the user and the defoult authenticate method
    passport.use(new LocalStrategy({
        usernameField: "email"
    }, User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}

module.exports = setup;