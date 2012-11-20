define(['jquery'], function ($) {
    return function (loginDetails) {
        $.ajax({
            url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/game/list.php',
            type: 'POST',
            dataType: 'json',
            data: loginDetails
        }).done(function(data) {
            $.event.trigger({
                type: "diplomacy-gameListLoaded",
                message: data,
                time: new Date()
            });
        }).fail(function(errorData) {
            console.log("GAME LIST FAIL:", errorData);
        });
        
        $.ajax({
            url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/game/nyGames.php',
            type: 'POST',
            dataType: 'json',
            data: loginDetails
        }).done(function (data) {
            $.event.trigger({
                type: "diplomacy-myGameListLoaded",
                message: data,
                time: new Date()
            });
        }).fail(function (errorData) {
            console.log("GAME LIST FAIL:", errorData);
        });
    };
});