// JScript File
define(function() {
    return function(cookieString) {
        var listOfCookies = cookieString.split("; ");
        var cookieMap = {};
        for (var i = 0; i < listOfCookies.length; i++) {
            var sCookie = listOfCookies[i].split('=');
            cookieMap[sCookie[0]] = sCookie[1];
        }
        return cookieMap;
    };
});

