/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', 'text!game/templates/topBar.html', 'text!game/templates/map.html', 'text!game/templates/orders.html'], function ($, topBarTemplate, gameMapTemplate, ordersTemplate) {

    function mapGameData(dg) {
        return function (gameData) {
            dg.mapData = gameData.boardInfo;
            dg.playerData = gameData.playerList;
            dg.gameState = gameData.state;

            dg.htmlTemplates = {};
            dg.htmlTemplates.topBar = topBarTemplate.replace('%GAMENAME%', dg.gameState.gameName).replace('%GAMEPHASE%', dg.gameState.phase);
            dg.htmlTemplates.gameMap = gameMapTemplate.replace('%MAPURL%', dg.gameState.url).replace('%MAPWIDTH%', dg.gameState.width).replace('%MAPHEIGHT%', dg.gameState.height);
            dg.htmlTemplates.gameOrders = ordersTemplate;
            dg.ready = true;
            console.log(dg);
            dg.readyCallback(dg);
            $.event.trigger({
                type: "diplomacy-gameLoaded",
                message: dg,
                time: new Date()
            });
        };
    }
    
    function DiplomacyGame(readyCallback) {
        this.ready = false;
        
        this.urlParams = {};
        this.readyCallback = readyCallback;
        
        // Copied from: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
        (function (dg) {
            var match,
                pl = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                query = window.location.search.substring(1);

            while (match = search.exec(query))
                dg.urlParams[decode(match[1])] = decode(match[2]);
        })(this);
        
        $.ajax({
        url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/gameData.php',
        type: 'POST',
        dataType: 'json',
        data: {
            gameID: this.urlParams['gameID']
        }
    }).done(mapGameData(this)).fail(function (errorData) {

    });
    }
    
    return DiplomacyGame;
    
});
