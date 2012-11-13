/// <reference path="../jquery-1.8.2.intellisense.js" />
/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', '../jquery-ui-1.9.0', 'text!game/templates/topBar.html', 'text!game/templates/map.html'], function ($, jqueryUI, topBarTemplate, gameMapTemplate) {

    var DiplomacyGame = {};

    DiplomacyGame.ready = false;
    
    
    
    // Each of these functions should probably do a this.each() - but we're not going to.
    
    $.fn.diplomacyTopBar = function() {
        // "this" references the navbar div.
        this.replaceWith(DiplomacyGame.htmlTemplates.topBar);
        
        // Setup jquery on this div.
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

    $.fn.diplomacyGameChat = function() {
        // "this" references the chat div.
        this.replaceWith(DiplomacyGame.htmlTemplates.gameChat);
        
        // Setup jquery on this div.
    };
    
    $.fn.diplomacyMap = function () {
        // "this" references the map div.
        this.replaceWith(DiplomacyGame.htmlTemplates.gameMap);

        // Setup jquery on this div.
    };
    
    $.fn.diplomacyOrders = function () {
        // "this" references the orders div.
        this.replaceWith(DiplomacyGame.htmlTemplates.gameOrders);

        // Setup jquery on this div.
    };

    DiplomacyGame.urlParams = {};
    // Copied from: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
    (function () {
        var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query = window.location.search.substring(1);

        while (match = search.exec(query))
            DiplomacyGame.urlParams[decode(match[1])] = decode(match[2]);
    })();
    
    //console.log("gameID: " + DiplomacyGame.urlParams['gameID']);
    

    $.ajax({
        url: "/api/gameData.php",
        data: {
            gameID: DiplomacyGame.urlParams['gameID']
        }
    }).done(function(gameData) {
        DiplomacyGame.mapData = gameData.map;
        DiplomacyGame.playerData = gameData.playerList;
        DiplomacyGame.gameState = gameData.state;
        
        DiplomacyGame.htmlTemplates = {};
        DiplomacyGame.htmlTemplates.topBar = topBarTemplate.replace('%GAMENAME%', DiplomacyGame.gameState.gameName).replace('%GAMEPHASE%', DiplomacyGame.gameState.phase);
        DiplomacyGame.htmlTemplates.gameMap = gameMapTemplate.replace('%MAPURL%', DiplomacyGame.mapData.url).replace('%MAPWIDTH%', DiplomacyGame.mapData.width).replace('%MAPHEIGHT%', DiplomacyGame.mapData.height);

    }).fail(function(errorData) {
        
    });

    return DiplomacyGame;
});