var mongoose = require("mongoose"),
    News = require("../lib/models/news")

function seed(){
    News.deleteOne({_id: "5e987de8e6b54b18843a3b66"}, function(err, news){
        if(!err){
            News.deleteOne({_id: "5e987de8e6b54b18843a3b67"}, function(err, news){
                if(!err){
                    News.find(function(err, news){
                        console.log("There are " + news.length + " left");
                    })
                }
            })
        }
    })
}

module.exports = seed;