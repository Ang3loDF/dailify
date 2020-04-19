// news finders class
class NewsFinder{
    constructor(name){
        
        // name of the newspaper
        this.name = name;

        // callback of the array.find method to see if the news (newsToFind) already exists in the array
        this.compareNews = function(newsToFind){
            return function(element){
                if(newsToFind && element)
                    return newsToFind.newspaper === element.newspaper && newsToFind.title === element.title;
                else return false;
            }
        }

    }
}

module.exports = NewsFinder;