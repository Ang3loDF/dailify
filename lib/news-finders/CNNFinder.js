var request = require("request"),
    cheerio = require("cheerio"),
    parser = require("xml2js"),
    NewsFinder = require("./NewsFinder"),
    News = require("../models/news");

// the object that deals with finding the news
var CNNFinder = new NewsFinder("CNN")

// url for the different (selected) CNN news section
CNNFinder.latestUrl = "http://rss.cnn.com/rss/cnn_latest.rss";
// how many news a single findSection function can add (to avoid useless looping through news already in database)
CNNFinder.maxNewsPerSection = 20;

// find news in all the (selected) section of CNN
CNNFinder.find = async function(newNews){
    newNews = await this.findSection(newNews, this.latestUrl);
    return newNews;
}

// find news in a specific section url 
CNNFinder.findSection = function(newNews, url, topic){
    // use a promise for a synchronous structure in find()
    return new Promise(resolve => {
        // request for the rss
        request(url, function(err, resp, body){
            if(!err && body && resp.statusCode == 200){
                // parse the xml
                parser.parseString(body, async function(err, body){
                    if(!err){
                        
                        // loop through every news
                        for(var i = 0; i < body.rss.channel[0].item.length && i < CNNFinder.maxNewsPerSection; i++){
                            item = body.rss.channel[0].item[i];
                            var $;

                            // create a news object with all the properties
                            var news = {};
                            news.newspaper = CNNFinder.name ? CNNFinder.name : null;
                            news.title = item.title ? item.title[0]: null; 
                            news.link = item.link ? item.link[0]: null;
                            // use cheerio to get only text from description (sometimes there is unparsed unwanted xml)
                            $ = item.description ? cheerio.load("<html>" + item.description[0] + "</html>") : null;
                            news.body = $ ? $("html").text().trim() : null;
                            // get image
                            news.image = item["media:group"] 
                                ? (item["media:group"][0]["media:content"] ? item["media:group"][0]["media:content"][0].$.url : null)
                                : null;
                            news.date = item.pubDate ? new Date(item.pubDate[0]) : null;
                            news.topics = [topic];

                            // try to find the current news in the database
                            var foundNews = await News.findOne({title: news.title, newspaper: news.newspaper})

                            // add the topics
                            if(news.topics){
                                // if the news already exists in database, add the new topic and update it
                                if(foundNews && !foundNews.topics.includes(news.topics[0])){
                                    foundNews.topics.push(news.topics[0]);
                                    await News.updateOne({title: news.title, newspaper: news.newspaper}, foundNews);
                                }

                                // if the news already exists in newNews, add the topic to that news in the array
                                var newsIndex = newNews ? newNews.findIndex(CNNFinder.compareNews(news)) : null;
                                if(newsIndex !== -1){
                                    newNews[newsIndex].topics.push(news.topics[0]);
                                }
                            }

                            // if the news isn't already in the database or in newNews, add it to newNews array
                            if(!foundNews && !newNews.find(CNNFinder.compareNews(news))) newNews.push(news);
                        }
                        //return the newNews array
                        resolve(newNews);
                    }
                })
            }
        })
    })
}

module.exports = CNNFinder;