define(['jquery'], function ($) {
    return function(loginDetails) {
        $.ajax({
            url: 'http://ec2-23-20-199-252.compute-1.amazonaws.com/diplomacy/DiplomacyServer/api/chat/messages.php',
            type: 'POST',
            dataType: 'json',
            data: loginDetails
        }).done(function(data) {
            $.event.trigger({
                type: "diplomacy-messageRecieved",
                message: data,
                time: new Date()
            });
        }).fail(function(data) {
            console.log('FAILURE FETCHING MESSAGES!', data);
        });
    };
});