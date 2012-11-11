/// <reference path="jquery-1.8.2.intellisense.js" />
/// <reference path="require-jquery.intellisense.js" />


require(["jquery", "jquery-ui-1.9.0"], function ($) {

    $(document).ready(function() {
        $("#test").append('<p>Hello from require-jquery and main!</p>');
        $("#dialogTest").dialog();
    });
});
