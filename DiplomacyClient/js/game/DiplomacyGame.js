/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', 'CookieMap', 'text!game/templates/topBar.html', 'text!game/templates/map.html', 'text!game/templates/orders.html'], function($, cookieMap, topBarTemplate, gameMapTemplate, ordersTemplate) {

    function mapGameData(dg) {
        return function(gameData) {
            dg.mapData = gameData.boardInfo;
            dg.playerData = gameData.playerList;
            dg.gameState = gameData.state;
            dg.colorMap = {};
            for (var iP = 0; iP < dg.playerData.players.length; iP++) {
                var p = dg.playerData.players[iP];
                dg.colorMap['P' + p.powernum] = p.color;
                if (p.username == dg.gameState.data.username) {
                    dg.myId = p.powernum;
                }
            }

            dg.myUnits = [];
            for (var iU = 0; iU < dg.mapData.units.length; iU++) {
                var u = dg.mapData.units[iU];
                if (u.ownernum == dg.myId) {
                    dg.myUnits.push(u);
                }
            }

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
        (function(dg) {
            var match,
                pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function(s) { return decodeURIComponent(s.replace(pl, " ")); },
                query = window.location.search.substring(1);

            while (match = search.exec(query))
                dg.urlParams[decode(match[1])] = decode(match[2]);
        })(this);

        var cookies = cookieMap(document.cookie);

        console.log(Object.keys(cookies));

        var postData = {};
        postData.userID = cookies.userID;
        postData.username = cookies.username;
        postData.token = "root"; // !
        postData.gameID = this.urlParams['gameID'];
        
        $.ajax({
            url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/gameData.php',
            type: 'POST',
            dataType: 'json',
            data: postData
        }).done(mapGameData(this)).fail(function(errorData) {

        });
    }

    return DiplomacyGame;

});