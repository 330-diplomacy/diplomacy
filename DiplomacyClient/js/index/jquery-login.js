/// <reference path="../jquery-1.8.2.intellisense.js" />
/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', '../jquery-ui-1.9.0', 'text!index/templates/login.html'], function ($, jqueryUI, loginTemplate) {
    $.fn.diplomacyLogin = function () {
        this.replaceWith(loginTemplate);
        $("#login-submit").click(function () {
            $.ajax({
                url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/users/login.php',
                type: 'POST',
                dataType: 'json',
                beforeSend: function (jqxHR, settings) {
                    $("#login-dialog").dialog("close");
                },
                data: {
                    username: $("#login-username").val(),
                    password: $("#login-password").val()
                }
            }).done(function (loginData) {
                $.event.trigger({
                    type: "diplomacy-userLoggedIn",
                    message: loginData,
                    time: new Date()
                });
            }).fail(function (errorData) {

            });
        });
        $("#login-dialog").dialog({
            modal: true,
            autoOpen: false,
            show: "blind",
            hide: "explode"
        });
        $("#login-link").click(function () {
            $("#login-dialog").dialog("open");
        });
    };
});