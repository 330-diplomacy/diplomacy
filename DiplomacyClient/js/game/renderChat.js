define(['jquery'], function ($) {
    return function() {
        $(document).on("diplomacy-messageRecieved", function(event) {
            $('#gameChat').empty();
            $.each(event.messages, function (index, value) {
                var msgHtmlString = '<p id="chatMessage-' + index + '" class="chatMessage"><span class="chatMessageAuthor">' + value.author + '</span>' + value.msg + '</p>';
                $('#gameChat').append(msgHtmlString);
            });
        });
    };
});