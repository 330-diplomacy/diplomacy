/// <reference path="../jquery-1.8.2.intellisense.js" />
/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', '../jquery-ui-1.9.0', 'game/DiplomacyGame', 'game/renderChat'], function($, jqueryUI, DiplomacyGame, renderChat) {

    function onDiplomacyGameLoad(diplomacyGame) {
        // Each of these functions should probably do a this.each() - but we're not going to.
        $.fn.diplomacyTopBar = function() {
            // "this" references the navbar div.
            this.replaceWith(diplomacyGame.htmlTemplates.topBar);

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

        $.fn.diplomacyChat = function () {
            console.log('diplomacyChat called', diplomacyGame.htmlTemplates.chat);
            // "this" references the chat div.
            this.replaceWith(diplomacyGame.htmlTemplates.chat);

            // Setup jquery on this div.
            $('#chatMsgSend').button();
            $('#chatMsgSend').click(function () {
                var messageData = {
                    userID: diplomacyGame.gameState.data.userID,
                    username: diplomacyGame.gameState.data.username,
                    token: diplomacyGame.gameState.data.token,
                    msg: $("#chatMsgText").val()
                };
                $.ajax({
                    url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/chat/send.php',
                    type: 'POST',
                    dataType: 'json',
                    data: messageData
                }).done(function(data) {
                    $("#chatMsgText").val('');
                });
            });
            renderChat();
        };

        $.fn.diplomacyMap = function() {
            // "this" references the map div.
            this.replaceWith(diplomacyGame.htmlTemplates.gameMap);

            // Setup jquery on this div.

            // First, create the province-label-abrv tag with the province name, and position them correctly.
            $.each(diplomacyGame.mapData.provinces, function(index, value) {
                var provinceId = 'province-label-' + value.abrv;
                var provinceDivId = 'province-label-div-' + value.abrv;
                console.log(value.name, value.owner);
                var provinceTitleHtmlString = '<div id="' + provinceDivId + '" class="province-label-div"><span id="' + provinceId + '" class="province-label">' + value.abrv + '</span></div>';
                $("#map").append(provinceTitleHtmlString);
                $('#' + provinceDivId).css("top", value.yloc);
                $('#' + provinceDivId).css("left", value.xloc);
                if (value.owner === null) {
                    $('#' + provinceDivId).css('background-color', 'white');
                    $('#' + provinceId).css('color', 'black');
                } else {
                    $('#' + provinceDivId).css('background-color', 'darkgrey');
                    $('#' + provinceId).css('color', diplomacyGame.colorMap['P' + value.owner]);
                }
                if (value.width !== undefined || value.width !== null) {
                    $('#' + provinceDivId).width(value.width);
                }
            });

            // Then, iterate through each unit, and show it on the province it lives in.
            for (var mUI = 0; mUI < diplomacyGame.myUnits.length; mUI++) {
                var mU = diplomacyGame.myUnits[mUI];
                var unitType = (mU.type === 1) ? "F" : "A";
                var unitHtmlString = '<span id="province-label-unit-%ABRV%" class="province-label-unit">%TYPE%</span>';
                $('#province-label-div-' + mU.abrv).append(unitHtmlString.replace('%ABRV%', mU.abrv).replace('%TYPE%', unitType));
                $("#province-label-unit-" + mU.abrv).css('color', diplomacyGame.colorMap['P' + mU.ownernum]);
            }
        };

        $.fn.diplomacyOrders = function() {
            // "this" references the orders div.
            this.replaceWith(diplomacyGame.htmlTemplates.gameOrders);

            // Setup jquery on this div.
            for (var mUI = 0; mUI < diplomacyGame.myUnits.length; mUI++) {
                var mU = diplomacyGame.myUnits[mUI];
                var unitType = (mU.type === 1) ? "Fleet" : "Army";
                var unitHtmlString = '<option id="order-unit-' + mU.location + '" class="order-unit value="' + mU.location + '" data-unitType="' + mU.type + '" data-location="' + mU.location + '">' + unitType + ' in ' + mU.location + '</option>';
                $("#issueOrderUnit").append(unitHtmlString);

            }

            $.each(diplomacyGame.mapData.provinces, function(index, value) {
                var destHtmlString = '<option id="order-dest-prov-' + value.abrv + '" class="order-dest-prov" value="' + value.abrv + '">' + value.name + '</option>';
                $("#issueOrderDest").append(destHtmlString);
                if (value.type === 0) {
                    $('#order-dest-prov-' + value.abrv).addClass("order-dest-prov-land");
                } else if (value.type === 1) {
                    $('#order-dest-prov-' + value.abrv).addClass("order-dest-prov-coastal");
                } else if (value.type === 2) {
                    $('#order-dest-prov-' + value.abrv).addClass("order-dest-prov-water");
                } else if (value.type === 3) {
                    $('#order-dest-prov-' + value.abrv).addClass("order-dest-prov-two-coast");
                }
            });

            var firstUnit = $('#issueOrderUnit > option').first();

            if (firstUnit.attr("data-unitType") == "1")      // Fleet
            {
                $(".order-dest-prov-water").removeAttr("disabled");
                $(".order-dest-prov-land").attr("disabled", "disabled");
                $("#order-cmd-convoy").removeAttr("disabled");
            } else {
                $(".order-dest-prov-water").attr("disabled", "disabled");
                $(".order-dest-prov-land").removeAttr("disabled");
                $("#order-cmd-convoy").attr("disabled", "disabled");
            }

            $("#issueOrderUnit").change(function() {
                console.log("CHANGED UNIT");
                console.log($("#issueOrderUnit:selected"));
                if ($("#issueOrderUnit > option:selected").attr('data-unitType') == "1") {
                    $(".order-dest-prov-water").removeAttr("disabled");
                    $(".order-dest-prov-land").attr("disabled", "disabled");
                    $("#order-cmd-convoy").removeAttr("disabled");
                } else {
                    $(".order-dest-prov-water").attr("disabled", "disabled");
                    $(".order-dest-prov-land").removeAttr("disabled");
                    $("#order-cmd-convoy").attr("disabled", "disabled");
                }
            });

        };
        console.log("Jquery Diplomacy Functions ready!");
    }

    return new DiplomacyGame(onDiplomacyGameLoad);
});