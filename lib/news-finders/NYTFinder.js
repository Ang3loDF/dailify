var request = require("request"),
    parser = require("xml2js"),
    NewsFinder = require("./NewsFinder"),
    News = require("../models/news");

// the object that deals with finding the news
var NYTFinder = new NewsFinder("New York Times");

// url for the different (selected) NYT news section
NYTFinder.worldUrl = "https://rss.nytimes.com/services/xml/rss/nyt/World.xml";
NYTFinder.businessUrl = "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml";
NYTFinder.techUrl = "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml";
NYTFinder.sportUrl = "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml";
NYTFinder.scienceUrl = "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml"
// how many news a single findSection function can add (to avoid useless looping through news already in database)
NYTFinder.maxNewsPerSection = 10;

// find news in all the (selected) section of NYT
NYTFinder.find = async function(newNews){
    newNews = await this.findSection(newNews, this.worldUrl, "world");
    newNews = await this.findSection(newNews, this.techUrl, "tech");
    newNews = await this.findSection(newNews, this.businessUrl, "business");
    newNews = await this.findSection(newNews, this.sportUrl);
    newNews = await this.findSection(newNews, this.scienceUrl);
    return newNews;
}

// find news in a specific section url 
NYTFinder.findSection = function(newNews, url, topic){
    // use a promise for a synchronous structure in find()
    return new Promise(resolve => {
        // request for the rss
        request(url, function(err, resp, body){
            if(!err && body && resp.statusCode == 200){
                // parse the xml
                parser.parseString(body, async function(err, body){
                    if(!err){
                        
                        // loop through every news
                        for(var i = 0; i < body.rss.channel[0].item.length && i < NYTFinder.maxNewsPerSection; i++){
                            item = body.rss.channel[0].item[i];
                            
                            // create a news object with all the properties
                            var news = {};
                            news.newspaper = NYTFinder.name ? NYTFinder.name : null;
                            news.title = item.title ? item.title[0]: null; 
                            news.body = item.description ? item.description[0]: null;
                            news.link = item.link ? item.link[0]: null;
                            news.image = item["media:content"] ? item["media:content"][0].$.url : null;
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
                                var newsIndex = newNews ? newNews.findIndex(NYTFinder.compareNews(news)) : null;
                                if(newsIndex !== -1){
                                    newNews[newsIndex].topics.push(news.topics[0]);
                                }
                            }

                            // if the news isn't already in the database or in newNews, add it to newNews array
                            if(!foundNews && !newNews.find(NYTFinder.compareNews(news))) newNews.push(news);
                        }
                        //return the newNews array
                        resolve(newNews);
                    }
                })
            }
        })
    })
}

module.exports = NYTFinder;