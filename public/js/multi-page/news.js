/* 
    contains values and methods helpful for get and show news
*/

const maxWaitingTimeNewsRequest = 10000;
const htmlNewsStructure = "<div class='container-fluid px-md-5 my-5'> <div class='px-0'> <div class='card theme-dark news-card'> <div class='card-horizontal news-card-horizontal'> <div class='row'> <div class='col-12 col-md-3 align-self-center text-center'> <div class='img-square-wrapper'> <img class='img-fluid rounded news-image' src='' alt='Card image cap'> </div> </div> <div class='col-12 col-md-9'> <div class='card-body p-3 p-md-0 pt-md-3'> <small class='text-muted float-md-right ml-md-3 news-newspaper'></small> <a href='#' class='link news-link'><h3 class='card-title news-title'></h3></a> <p class='card-text news-body mt-4'></p> </div> </div> </div> </div> <div class='card-footer'> <span class='like-button unactive'> <svg class='bi bi-heart news-heart-empity' width='1.5em' height='1.5em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> <path fill-rule='evenodd' d='M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z'/> </svg> <svg class='bi bi-heart-fill news-heart-fill' width='1.5em' height='1.5em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> <path fill-rule='evenodd' d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'/> </svg> </span> <small class='text-muted news-like-count ml-2'></small> <small class='text-muted float-right news-date'></small> </div> </div> </div> </div> ";



// send a requst to check if the user is authenticated. Callbacks:
// - successCallback - params: auth = true if the user is authenticated, else false - called on request success
// - errCallback - called on request error
function isUserAuthenticated(successCallback, errCallback) {
    
    // define the url
    const url = "/users/is-authenticated";

    // send the request
    $.ajax(url, {
        method: "GET",
        success: function(resp){
            if (resp === "true") {
                successCallback(true);
            } else if (resp === "false") {
                successCallback(false);
            } else {
                errCallback()
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            errCallback();
        }
    })
}



// read the news from a xml and add them to the document
function showNews(xml) {
    
    // transform the xml document in a jquery object
    news = $(xml);

    // if no news are passed return
    if (!xml || news.find("news").length === 0) {
        return showNoFoundNews();
    }

    // empty the news section to fill it later
    $("#news-section").empty();

    // for each found news
    news.find("news").each(function () {
        
        // get the properties
        const link = $(this).find("link").text(),
            title = $(this).find("title").text(),
            body = $(this).find("body").text(),
            newspaper = $(this).find("newspaper").text(),
            topics = $(this).find("topics").text(),
            date = $(this).find("date").text(),
            likes = $(this).find("likes").text(),
            id = $(this).find("id").text(),
            liked = $(this).find("liked").text(),
            image = $(this).find("image").text();
        
        // define a new jquery object from the html news structure
        var newNews = $(htmlNewsStructure);

        // add the news properties to the structure
        newNews.find(".news-card").attr("data-newsId", id)
        newNews.find(".news-title").text(title);
        newNews.find(".news-body").text(body);
        newNews.find(".news-image").attr("src", image ? image : "/images/news.jpg");
        newNews.find(".news-newspaper").text(newspaper);
        
        if (liked == "true"){
            newNews.find(".like-button").addClass("active");
        } else {
            newNews.find(".like-button").addClass("unactive");
        }

        newNews.find(".news-like-count").text(likes);
        newNews.find(".news-date").text( timeSince(new Date(date)) + " ago" );  
        newNews.find(".news-link").attr("href", link);      

        // add the news to the news section
        $("#news-section").append(newNews);

    })

    // add the event listener to all the like buttons
    $(".like-button").click(function () {
        if ($(this).hasClass("unclickable")) {
            return false;
        }
        sendNewsLike($(this).closest(".news-card").attr("data-newsId"))
    })

    // if the user isn't authenticated, set the like button to unclickable
    isUserAuthenticated(function(auth){
        if (!auth) {
            $(".like-button").addClass("unclickable");
        } else {
            $(".like-button").removeClass("unclickable");
        }
    }, function(){
        $(".like-button").addClass("unclickable");
    })
}



// insert a message in the news section to warn that no news has been found
function showNoFoundNews(){
    // get the message model
    var noNewsPanel = $("#no-news-found-panel");
    
    // insert the message in the news section
    $("#news-section").empty();
    $("#news-section").append(noNewsPanel);

    // show the message
    $("#news-section").find("#no-news-found-panel").removeClass("d-none");
}



// set the properties of the like button if it's liked 
function setLikeButtonColor(id, active) {
    
    // find the button of the news with the specified id
    const button = $(".news-card[data-newsId='" + id + "'] .like-button");

    // if active is true set the active class and remove unactive
    if (active === true) {
        button.removeClass("unactive")
        button.addClass("active")
    } 
    // if active is false remove the active class and set unactive
    else if (active === false) {
        button.removeClass("active")
        button.addClass("unactive")
    } 
    // if active is not specified, toggle the classes
    else {
        button.toggleClass("active")
        button.toggleClass("unactive")
    }
}



// change the displayed likes count of the specified news of the passed amount
function changeLikeCount(newsId, amount){
    
    // find the likes-count element
    var likesCountElement = $(".news-card[data-newsId=" + newsId + "]").find(".news-like-count");

    // change the value
    var likes = parseInt(likesCountElement.text(), 10);
    likes += amount;

    // apply the change to the element
    likesCountElement.text(likes.toString())
}



// send the request to like the news
function sendNewsLike(newsId){

    // change tha button like state while waiting the response
    setLikeButtonColor(newsId);

    // define the url
    const url = "/news/" + newsId + "/like?_method=PUT";

    // send the request
    $.ajax(url, {
        method: "POST",
        success: function(data){
            // set the button correct class (if everything fine)
            setLikeButtonColor(newsId, data == 1 ? true : false);
            // change the displayed likes count (increase/decrease based on the response)
            changeLikeCount(newsId, data == 1 ? 1 : -1)
        },
        error: function(jqXHR, textStatus, errorThrown ){
            // if an error accurred change again the button like state
            setLikeButtonColor(newsId);
        }
    })
}



// get how much time passed from a given date (in form of 2 minutes, 3 hours, 5 days ...)
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = Math.floor(seconds / 31536000);
  
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }