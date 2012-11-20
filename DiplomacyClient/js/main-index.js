/// <reference path="jquery-1.8.2.intellisense.js" />
/// <reference path="require-jquery.intellisense.js" />


require(["jquery", 'index/fetchGames', "jquery-ui-1.9.0", 'index/jquery-login', 'index/jquery-register'], function ($, fetchGames) {
    $(document).ready(function () {
        $("#login-div").diplomacyLogin();
        $("#register-div").diplomacyRegister();
        
        $(document).on("diplomacy-userLoggedIn", function (event) {
            console.log("Got a login!!!!!!111!!!1");
            $("#user").hide();
            $("#matches").show();
            document.cookie = "userID=" + event.message.userID;
            document.cookie = "username=" + event.message.username;
            //document.cookie = "token=" + event.message.token;
            fetchGames({
                userID: event.message.userID,
                username: event.message.username,
                token: 'root'
            });
        });
        
        $(document).on("diplomacy-gameListLoaded", function (event) {
            $.each(event.message, function(index, value) {
                var liHtmlString = '<li class="available-game" id="available-game-' + index + '" data-gameID="' + value.id + '">' + value.name + ' [' + value.pcount + '/' + value.max + ']</li>';
                $('#available-match-list').append(liHtmlString);
            });
        });
        
    });
});
