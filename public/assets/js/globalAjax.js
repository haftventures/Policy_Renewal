// GLOBAL AJAX HANDLERS
$(document).ajaxStart(function () {
    $("#cover").fadeIn(100);  // smooth
});

$(document).ajaxStop(function () {
    $("#cover").fadeOut(100);
});
