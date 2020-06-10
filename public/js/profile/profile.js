showCorrectUserInterests();
getLikedNews();

// get the user interest from the hidden list and check the respective topics checkboxes
function showCorrectUserInterests () {
    $("#hidden-topics-list").find("p").each(function () {
        $("#profile-user-interests").find("[value=" + $(this).text() + "").removeClass("d-none")
    });
}

function getLikedNews () {
    // define the url
    const url = "/news/find?search=liked";

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