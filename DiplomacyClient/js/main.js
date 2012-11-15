/// <reference path="jquery-1.8.2.intellisense.js" />
/// <reference path="require-jquery.intellisense.js" />


require(["jquery", "jquery-ui-1.9.0", 'game/jquery-diplomacy'], function ($) {

    $(document).ready(function() {
        $("#topbar").diplomacyTopBar();
        $("#orders").diplomacyOrders();
    });
});
