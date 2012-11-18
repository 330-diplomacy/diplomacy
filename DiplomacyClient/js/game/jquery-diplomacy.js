/// <reference path="../jquery-1.8.2.intellisense.js" />
/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', '../jquery-ui-1.9.0', 'game/DiplomacyGame'], function ($, jqueryUI, DiplomacyGame) {

    function onDiplomacyGameLoad(diplomacyGame) {
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
            
            // First, create the province-label-abrv tag with the province name, and position them correctly.
            $.each(diplomacyGame.mapData.provinces, function (index, value) {
                console.log("province ", index, value);
                var provinceId = 'province-label-' + value.abrv;
                var provinceTitleHtmlString = '<p id="' + provinceId + '" class="province-label">' + value.name + '</p>';
                $("#map").append(provinceTitleHtmlString);
                $('#' + provinceId).css("top", value.yloc);
                $('#' + provinceId).css("left", value.xloc);
                $('#' + provinceId).css('color', value.color);
            });
        };

        $.fn.diplomacyOrders = function () {
            // "this" references the orders div.
            this.replaceWith(diplomacyGame.htmlTemplates.gameOrders);

            // Setup jquery on this div.
            for (var mUI = 0; mUI < diplomacyGame.myUnits.length; mUI++) {
                var mU = diplomacyGame.myUnits[mUI];
                var unitType = (mU.type === 1) ? "Fleet" : "Army";
                var unitHtmlString = '<option id="order-unit-' + mU.location + '" class="order-unit value="' + mU.location + '" data-unitType="' + mU.type + '" data-location="' + mU.location + '">' + unitType + ' in ' + mU.location + '</option>';
                $("#issueOrderUnit").append(unitHtmlString);
                
            }

            $.each(diplomacyGame.mapData.provinces, function (index, value) {
                var destHtmlString = '<option id="order-dest-prov-' + value.abrv + '" class="order-dest-prov" value="' + value.abrv + '">' + value.name + '</option>';
                $("#issueOrderDest").append(destHtmlString);
                if (value.type === 0) {
                    $('#order-dest-prov-' + value.abrv).addClass("order-dest-prov-land");
                }
                else if (value.type === 1) {
                    $('#order-dest-prov-' + value.abrv).addClass("order-dest-prov-coastal");
                }
                else if (value.type === 2) {
                    $('#order-dest-prov-' + value.abrv).addClass("order-dest-prov-water");
                }
                else if (value.type === 3) {
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

            $("#issueOrderUnit").change(function () {
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