/// <reference path="jquery-1.8.2.intellisense.js" />
/// <reference path="require-jquery.intellisense.js" />


require(["jquery", "jquery-ui-1.9.0", 'game/jquery-diplomacy'], function ($, jqueryUI, jqueryDiplomacy) {

    $(document).ready(function () {
        $(document).on("diplomacy-gameLoaded", function(event) {
            console.log("Spinning up the death machine - " + event.message);
            $("#topbar").diplomacyTopBar();
            $("#orders").diplomacyOrders();
        });
    });
});
