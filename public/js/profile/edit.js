checkCheckboxOfUserInterests();

// get the user interest from the hidden list and check the respective topics checkboxes
function checkCheckboxOfUserInterests() {
    $("#hidden-topics-list").find("p").each(function () {
        $("#topics-checkbox-container").find("[value=" + $(this).text() + "]").prop("checked", true);
    });
}