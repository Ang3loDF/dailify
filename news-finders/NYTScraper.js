//Get the last news from New York Times world section

//require packages
var request = require("request"),
    cheerio = require("cheerio");

//require models
var News = require("../models/news");

//base url of NYT
var url = "https://www.nytimes.com/"

//the object containing the scrape function for New York Times
var NYTscraper = {};

//the scrape function: get the NYT news and save them in the database
NYTscraper.scrape = function(){
    //list of all found news (both new and existing)
    var allNewsList = [];
    
    //send the request to obtain html page
    request("https://www.nytimes.com/section/world", function(err, response, html){
        
        if(!err && html && response.statusCode == 200){
            //initialize cheerio
            var $ = cheerio.load(html);
            //the table containing the last news
            var table = $(".css-13mho3u ol");

            if(table){
                //find all the news and loop through them
                table.find("li").each(function(i, el){
                    //if the news available are more then we want, stop looping
                    if(i > 10){
                        return false;
                    }
                    if(el){
                        //get the information about the news and save them into an object
                        var news = {}
                        news.title = $(el).find(".css-1j9dxys.e1xfvim30").text();
                        news.image = $(el).find("img.css-11cwn6f").attr("src");
                        news.body = $(el).find(".css-1echdzn.e1xfvim31").text();
                        news.link = url + $(el).find("div.css-1l4spti a").attr("href");
                        //instert the found news in the list
                        allNewsList.push(news);
                    }
                })
            }
        }

        //loop through every found news from last to first
        for(var i=allNewsList.length-1; i>=0; i--){
            //try to find the current news in the database
            (function(i){
                News.findOne({title: allNewsList[i].title}, function(err, news){
                    if(!err){
                        //if it doesn't exist already, add it
                        if(!news){
                            News.create(allNewsList[i], function(err, news){});
                        }
                    }
                })
            }(i));
        }
    })
}

module.exports = NYTscraper;