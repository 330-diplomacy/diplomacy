/// <reference path="../jquery-1.8.2.intellisense.js" />
/// <reference path="../require-jquery.intellisense.js" />

define(['jquery', '../jquery-ui-1.9.0', 'text!index/templates/register.html'], function ($, jqueryUI, registerTemplate) {
    $.fn.diplomacyRegister = function () {
        this.replaceWith(registerTemplate);
        $("#register-submit").click(function() {
            $.ajax({
                url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/users/register.php',
                type: 'POST',
                dataType: 'json',
                beforeSend: function (jqxHR, settings) {
                    $("#register-dialog").dialog("close");
                },
                data: {
                    username: $("#register-username").val(),
                    password: $("#register-password").val()
                }
            }).done(function (loginData) {
                $("#register-dialog").dialog("close");
                $.event.trigger({
                    type: "diplomacy-userLoggedIn",
                    message: loginData,
                    time: new Date()
                });
            }).fail(function(errorData) {

            });
        });
        $("#register-dialog").dialog({
            modal: true,
            autoOpen: false,
            show: "blind",
            hide: "explode"
        });
        $("#register-link").click(function() {
            $("#register-dialog").dialog("open");
        });
    };
});