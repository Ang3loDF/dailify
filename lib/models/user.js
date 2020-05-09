var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    registrationDate: Date,
    interests: [String],
    likedNews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "News"
    }]
});

// use the email credential to find the user
userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

module.exports = mongoose.model("User", userSchema);