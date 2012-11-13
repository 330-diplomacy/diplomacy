/// <reference path="../jquery-1.8.2.intellisense.js" />
/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', '../jquery-ui-1.9.0', 'text!game/templates/topBar.html'], function ($, jqueryUI, topBarTemplate) {
    var topBarHtml = topBarTemplate.replace('%GAMENAME%', "|GET GAME NAME FROM MASON|");
    $.fn.diplomacyTopBar = function() {
        // "this" references the navbar div.
        $(this).replaceWith(topBarHtml);
        $("#topbarLoginDiv").dialog({
            modal: true,
            autoOpen: false,
            show: "blind",
            hide: "explode"
        });
        $("#topbarLoginLink").click(function() {
            $("#topbarLoginDiv").dialog("open");
        });
    };
});