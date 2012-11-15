/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', 'text!game/templates/topBar.html', 'text!game/templates/map.html', 'text!game/templates/orders.html'], function ($, topBarTemplate, gameMapTemplate, ordersTemplate) {

    var DiplomacyGame = {};

    DiplomacyGame.ready = false;
    
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
        url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/gameData.php',
        type: 'POST',
        data: {
            gameID: DiplomacyGame.urlParams['gameID']
        }
    }).done(function (gameData) {
        DiplomacyGame.mapData = gameData.map;
        DiplomacyGame.playerData = gameData.playerList;
        DiplomacyGame.gameState = gameData.state;

        DiplomacyGame.htmlTemplates = {};
        DiplomacyGame.htmlTemplates.topBar = topBarTemplate.replace('%GAMENAME%', DiplomacyGame.gameState.gameName).replace('%GAMEPHASE%', DiplomacyGame.gameState.phase);
        DiplomacyGame.htmlTemplates.gameMap = gameMapTemplate.replace('%MAPURL%', DiplomacyGame.mapData.url).replace('%MAPWIDTH%', DiplomacyGame.mapData.width).replace('%MAPHEIGHT%', DiplomacyGame.mapData.height);
        DiplomacyGame.htmlTemplates.gameOrders = ordersTemplate;


    }).fail(function (errorData) {

    });

    return DiplomacyGame;
    
});
