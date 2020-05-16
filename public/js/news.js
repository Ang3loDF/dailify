const maxWaitingTimeNewsRequest = 10000;

// on page load find the defoult news
findDefoultNews();



// add click listener to the personalized topics selector button
$("#topics-selector-submit").click(function(){
    findPersonalizedNews();
})



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



function showNews(xml){

    // transform the xml document in a jquery object
    news = $(xml);

    // if no news are passed return
    if (!xml && news.find("news").length === 0) {
        return showNoFoundNews();
    }

    // empty the news section to fill it later
    $("#news-section").empty();

    // for ech news
    news.find("news").each(function(){

        // get the properties
        const link = $(this).find("link").text(),
            title = $(this).find("title").text(),
            body = $(this).find("body").text(),
            newspaper = $(this).find("newspaper").text(),
            topics = $(this).find("topics").text(),
            date = $(this).find("date").text(),
            likes = $(this).find("likes").text(),
            id = $(this).find("id").text(),
            liked = $(this).find("liked").text();


        // create a new div for the news
        var container = $("<div>", {"data-newsId": id})
        
        // build the news
        container.append( $("<a>", {href: link}).append( $("<h2>", {}).append(title) ) );
        container.append( $("<p>", {}).append(body) );
        container.append( $("<p>", {}).append(newspaper) );
        container.append( $("<p>", {}).append(topics) );
        container.append( $("<p>", {}).append(date) );
        container.append( $("<p>", {class: "likes-count"}).append(likes) );
        container.append( $("<button>", {
            // set the class active if the user likes the news
            class: "like-button " + (liked === "true" ? "active" : ""), 
            "data-newsId": id
        }).append("Like") );

        // append the container to the news section
        $("#news-section").append(container);

    })

    // add the event listener to all the like buttons
    $(".like-button").click(function () {
        sendNewsLike($(this).attr("data-newsId"))
    })

    // if the user isn't authenticated, hide the like buttons
    isUserAuthenticated(function(auth){
        if (!auth) {
            $(".like-button").addClass("hidden");
        } else {
            $(".like-button").removeClass("hidden");
        }
    }, function(){
        $(".like-button").addClass("hidden");
    })

}



// insert a message in the news section to warn that no news has been found
function showNoFoundNews(){
    var message = $("<h3>", {style: "color: red"}).append("No news found");
    $("#news-section").empty();
    $("#news-section").append(message);
}



// send the request for defoult news
function findDefoultNews() {
    
    // define the url
    const url = "/news/find";

    // send the request
    $.ajax(url, {
        method: "POST",
        dataType : "xml",
        timeout: maxWaitingTimeNewsRequest,
        success: function(xml){
            showNews(xml);
        },
        error: function(jqXHR, textStatus, errorThrown){
            showNoFoundNews();
        }
    })
}



// send the request for personalized news with checked topics
function findPersonalizedNews(){    
    
    // get the wanted from the checkbox in the form of 'economy-tech-...'
    var topicsString = "";
    $(".topic-checkbox").each(function(i, el){
        if($(this).prop("checked")){
            topicsString += ($(this).prop("name") + "-");
        }
    })
    topicsString = topicsString.substring(0, topicsString.length - 1);

    // define the url
    const url = "/news/find?search=personalized&topics=" + topicsString;

    // send the request
    $.ajax(url, {
        method: "POST",
        dataType : "xml",
        timeout: maxWaitingTimeNewsRequest,
        success: function(xml){
            showNews(xml);
        },
        error: function(jqXHR, textStatus, errorThrown){
            showNoFoundNews();
        }
    })
}



// set the properties of the like button if it's liked 
function setLikeButtonColor(id, active) {
    
    // find the button with the attribute data-newsId
    const button = $(".like-button[data-newsId='" + id + "'");

    // if active is true set the active class
    if (active === true) {
        button.addClass("active")
    } 
    // if active is false remove the active class
    else if (active === false) {
        button.removeClass("active")
    } 
    // if active is not specified, toggle the class
    else {
        button.toggleClass("active")
    }
}



// change the displayed likes count of the specified news of the passed amount
function changeLikeCount(newsId, amount){
    
    // find the likes count element
    var likesCountElement = $("div[data-newsId=" + newsId + "]").find(".likes-count");

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