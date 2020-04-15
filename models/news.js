var mongoose = require("mongoose");

var newsSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    link: String,
    date: Date
});

module.exports = mongoose.model("News", newsSchema);