/// <reference path="jquery-1.8.2.intellisense.js" />
/// <reference path="require-jquery.intellisense.js" />


require(["jquery", "jquery-ui-1.9.0", 'index/jquery-login', 'index/jquery-register'], function ($) {

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
        });
    });
});
