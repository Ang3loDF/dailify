var request = require("request"),
    parser = require("xml2js"),
    NewsFinder = require("./NewsFinder"),
    News = require("../models/news");

// the object that deals with finding the news
var CNBCFinder = new NewsFinder("CNBC");

// url for the different (selected) CNBC news section
CNBCFinder.topNewsUrl = "https://www.cnbc.com/id/100003114/device/rss/rss.html";
CNBCFinder.worldUrl = "https://www.cnbc.com/id/100727362/device/rss/rss.html";
CNBCFinder.businessUrl = "https://www.cnbc.com/id/10001147/device/rss/rss.html";
CNBCFinder.economyUrl = "https://www.cnbc.com/id/20910258/device/rss/rss.html";
CNBCFinder.financeUrl = "https://www.cnbc.com/id/10000664/device/rss/rss.html";
CNBCFinder.techUrl = "https://www.cnbc.com/id/19854910/device/rss/rss.html";
CNBCFinder.politicsUrl = "https://www.cnbc.com/id/10000113/device/rss/rss.html";
CNBCFinder.healthUrl = "https://www.cnbc.com/id/10000108/device/rss/rss.html";
// how many news a single findSection function can add (to avoid useless looping through news already in database)
CNBCFinder.maxNewsPerSection = 10;

// find news in all the (selected) section of CNBC
CNBCFinder.find = async function(newNews){
    newNews = await this.findSection(newNews, this.healthUrl);
    newNews = await this.findSection(newNews, this.politicsUrl, "politics");
    newNews = await this.findSection(newNews, this.techUrl, "tech");
    newNews = await this.findSection(newNews, this.financeUrl, "economy");
    newNews = await this.findSection(newNews, this.economyUrl, "economy");
    newNews = await this.findSection(newNews, this.businessUrl, "business");
    newNews = await this.findSection(newNews, this.worldUrl, "world");
    newNews = await this.findSection(newNews, this.topNewsUrl);
    return newNews;
}

// find news in a specific section url 
CNBCFinder.findSection = function(newNews, url, topic){
    // use a promise for a synchronous structure in find()
    return new Promise(resolve => {
        // request for the rss
        request(url, function(err, resp, body){
            if(!err && body && resp.statusCode == 200){
                // parse the xml
                parser.parseString(body, async function(err, body){
                    if(!err){
                        
                        // loop through every news
                        for(var i = 0; i < body.rss.channel[0].item.length && i < CNBCFinder.maxNewsPerSection; i++){
                            item = body.rss.channel[0].item[i];
                            
                            // create a news object with all the properties
                            var news = {};
                            news.newspaper = CNBCFinder.name ? CNBCFinder.name : null;
                            news.title = item.title ? item.title[0]: null; 
                            news.body = item.description ? item.description[0]: null;
                            news.link = item.link ? item.link[0]: null;
                            news.image = null;
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
                                var newsIndex = newNews ? newNews.findIndex(CNBCFinder.compareNews(news)) : null;
                                if(newsIndex !== -1){
                                    newNews[newsIndex].topics.push(news.topics[0]);
                                }
                            }

                            // if the news isn't already in the database or in newNews, add it to newNews array
                            if(!foundNews && !newNews.find(CNBCFinder.compareNews(news))) newNews.push(news);
                        }
                        //return the newNews array
                        resolve(newNews);
                    }
                })
            }
        })
    })
}

module.exports = CNBCFinder;