/// <reference path="lib/require-jquery.intellisense.js" />
/// <reference path="lib/jquery-1.8.2.intellisense.js" />

require(["jquery"], function ($) {

    $(document).ready(function() {
        $("#test").append('<p>Hello from require-jquery and main!</p>');
    });
});
