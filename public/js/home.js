// on page load find the defoult news
findDefoultNews();


// show topics dropdown
showTopicsDropdown();

// avoid to close the dropdown menu when clicking on it
$(".dropdown-menu").click(function(e){
    e.stopPropagation();
})

// add click listener to the personalized topics selector button
$("#topics-selector-submit").click(function(){
    findPersonalizedNews();
})



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



// find with id and show topics dropdown
function showTopicsDropdown() {
    $("#topics-dropdown").css("display", "block");
}