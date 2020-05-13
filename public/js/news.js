const maxWaitingTimeNewsRequest = 10000;

findDefoultNews();

// find new news on click
$("topics-selector-submit").click = function(){
    findPersonalizedNews();
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
            id = $(this).find("id").text();


        // create a new div for the news
        var container = $("<div>", {})
        
        // build the news
        container.append( $("<a>", {href: link}).append( $("<h2>", {}).append(title) ) );
        container.append( $("<p>", {}).append(body) );
        container.append( $("<p>", {}).append(newspaper) );
        container.append( $("<p>", {}).append(topics) );
        container.append( $("<p>", {}).append(date) );
        container.append( $("<p>", {}).append("likes: " + likes) );
        container.append( $("<button>", {class: "like-button", "data-newsId": id}).append("Like") );

        // append the container to the news section
        $("#news-section").append(container);

    })

    // add to all the like button the event listener
    $(".like-button").click(function () {
        console.log("clicked like")
        sendNewsLike($(this).attr("data-newsId"))
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



// send the request to like the news
function sendNewsLike(newsId){

    // define the url
    const url = "/news/" + newsId + "/like?_method=PUT";

    // send the request
    $.ajax(url, {
        method: "POST",
        success: function(data){
            console.log(data == 1 ? "liked" : "disliked");
        },
        error: function(jqXHR, textStatus, errorThrown ){
            console.log("news not liked")
        }
    })
}