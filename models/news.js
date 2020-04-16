var mongoose = require("mongoose");

var newsSchema = mongoose.Schema({
    newspaper: String,
    title: String,
    image: String,
    body: String,
    link: String,
    date: Date //string date format YYYY-MM-DDTHH:MM:SSZ
});

module.exports = mongoose.model("News", newsSchema);