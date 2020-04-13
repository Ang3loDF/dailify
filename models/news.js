var mongoose = require("mongoose");

var newsSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    link: String
});

module.exports = mongoose.model("News", newsSchema);