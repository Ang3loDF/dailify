var NYTFinder = require("./NYTFinder"),
    CNNFinder = require("./CNNFinder"),
    CNBCFinder = require("./CNBCFinder"),
    WSJFinder = require("./WSJFinder"),
    News = require("../models/news");

// the object that deals with executing the asyncronous process of findig the news
var findProcess = {};

// if there is a current running instance
findProcess.isRunning = false;

// how much time passes between one news search and another
findProcess.interval = 60000;
// minimum time interval between two searches
findProcess.minInterval = 60000;

// launch the finding process
findProcess.start = function(interval, callback){
    
    // if the interval is passed
    if(interval && typeof interval === "number"){
        
        // if the passed interval is lower then the minimum required interval
        if(interval < this.minInterval){
            // set the minimum intervall as the intervall
            interval = this.minInterval;
            console.log("News finder passed intervall too low. Process running with interval " + this.interval);
        }

    } else {
        // in no intervall is passed set the minimum interval as interval
        interval = this.minInterval;
        console.log("News finder interval not passed. Process running with defoult interval");
    }

    // set the object interval
    this.interval = interval
    //set the object running state
    this.isRunning = true;

    console.log("News finder process started on date " + Date(Date.now()).toString() + ". Running with interval " + this.interval);
    // launch the finding loop (if interval hasn't been passed, variable intervall will be callback)
    this.loop(this, callback);
}

// stop the finding process
findProcess.stop = function(){
    this.isRunning = false;
}

// the finding loop, look for new news at specific time intervals
findProcess.loop = async function(process, callback){
    if(!process){
        console.log("News find process error");
        return false;
    }

    // array containing all the new news
    var newNews = [];

    // find all the new news from all the newspapers
    newNews = await NYTFinder.find(newNews);
    newNews = await CNNFinder.find(newNews);
    newNews = await CNBCFinder.find(newNews);
    newNews = await WSJFinder.find(newNews);

    // sort newNews bay date
    newNews.sort(function(a, b){
        if(!a.date || !b.date) return 0;

        if(a.date > b.date) return 1;
        else if(a.date < b.date) return -1;
        return 0;
    })

    // save date in a (approximately) sorted way
    for(var i = newNews.length - 1; i >= 0; i--){
        News.create(newNews[i], function(err, news){
        })
    }
    
    console.log(newNews.length.toString() + " news found on date " + Date(Date.now()).toString());

    // if isRunning is still set to true run the loop again (but wait interval time)
    if(process.isRunning){
        setTimeout(function(){
            process.loop(process, callback);
        }, process.interval);
    } 
    
    // if isRunning is false call the callback and stop the process
    else typeof callback === "function" ? callback() : 0;
}

module.exports = findProcess;