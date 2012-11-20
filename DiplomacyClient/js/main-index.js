/// <reference path="jquery-1.8.2.intellisense.js" />
/// <reference path="require-jquery.intellisense.js" />


require(["jquery", 'index/fetchGames', "jquery-ui-1.9.0", 'index/jquery-login', 'index/jquery-register'], function ($, fetchGames) {
    $(document).ready(function () {
        $("#login-div").diplomacyLogin();
        $("#register-div").diplomacyRegister();

        var loginData = {};
        
        $(document).on("diplomacy-userLoggedIn", function (event) {
            console.log("Got a login!!!!!!111!!!1");
            $("#user").hide();
            $("#matches").show();
            document.cookie = "userID=" + event.message.userID;
            loginData.userID = event.message.userID;
            document.cookie = "username=" + event.message.username;
            loginData.username = event.message.username;
            //document.cookie = "token=" + event.message.token;
            fetchGames({
                userID: event.message.userID,
                username: event.message.username,
                token: 'root'
            });
        });
        
        $(document).on("diplomacy-gameListLoaded", function (event) {
            console.log('game list loaded!');
            $('#createNewGameDiv').dialog({
                modal: true,
                autoOpen: false,
                show: "blind",
                hide: "explode"
            });
            $('#newGameSubmit').click(function() {
                $('#createNewGameDiv').dialog("close");
                var gamePostData = {
                    userID: loginData.userID,
                    username: loginData.username,
                    token: 'root',
                    name: $('#newGameName').val(),
                    variant: $('#newGameVariant').val()
                };
                $.ajax({
                    url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/game/create.php',
                    type: 'POST',
                    dataType: 'json',
                    data: gamePostData
                }).done(function(data) {
                    console.log('CREATED GAME:', data);
                }).fail(function(data) {
                    console.log('FAILED TO CREATE GAME:', data);
                });
            });
            $('#createNewGame').click(function() {
                $('#createNewGameDiv').dialog("open");
            });
            $.each(event.message, function(index, value) {
                var liHtmlString = '<li class="available-game" id="available-game-' + index + '" data-gameID="' + value.id + '">' + value.name + ' [' + value.pcount + '/' + value.max + ']</li>';
                $('#available-match-list').append(liHtmlString);
            });
        });


        $(document).on('diplomacy-myGameListLoaded', function(event) {
            $.each(event.message, function (index, value) {
                var liHtmlString = '<li class="my-game" id="my-game-' + index + '" data-gameID="' + value.id + '">' + value.name + ' [' + value.pcount + '/' + value.max + ']</li>';
                $('#my-match-list').append(liHtmlString);
            });
        });
    });
});
