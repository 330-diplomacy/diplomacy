/// <reference path="../jquery-1.8.2.intellisense.js" />
/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', '../jquery-ui-1.9.0', 'game/DiplomacyGame'], function ($, jqueryUI, DiplomacyGame) {

    function onDiplomacyGameLoad() {
        // Each of these functions should probably do a this.each() - but we're not going to.
        $.fn.diplomacyTopBar = function () {
            // "this" references the navbar div.
            this.replaceWith(diplomacyGame.htmlTemplates.topBar);

            // Setup jquery on this div.
            $("#topbarLoginDiv").dialog({
                modal: true,
                autoOpen: false,
                show: "blind",
                hide: "explode"
            });
            $("#topbarLoginLink").click(function () {
                $("#topbarLoginDiv").dialog("open");
            });
        };

        $.fn.diplomacyGameChat = function () {
            // "this" references the chat div.
            this.replaceWith(diplomacyGame.htmlTemplates.gameChat);

            // Setup jquery on this div.
        };

        $.fn.diplomacyMap = function () {
            // "this" references the map div.
            this.replaceWith(diplomacyGame.htmlTemplates.gameMap);

            // Setup jquery on this div.
        };

        $.fn.diplomacyOrders = function () {
            // "this" references the orders div.
            this.replaceWith(diplomacyGame.htmlTemplates.gameOrders);

            // Setup jquery on this div.
        };
        console.log("Jquery Diplomacy Functions ready!");
    }

    var diplomacyGame = new DiplomacyGame(onDiplomacyGameLoad);
});