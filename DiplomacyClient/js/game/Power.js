define('Power', function () {
    // Start with the constructor
    function Power(playerName, nationName, id, color) {
        this.playerName = playerName;
        this.nationName = nationName;
        this.id = id;
        this.color = color;
    }

    Power.loadPowers = function (powerList) {
        var ret = [];
        for (var i = 0; i < powerList.length; i++) {
            ret.push(new Power(powerList[i]))
        }
    };

    // And now return the constructor function
    return Power;
});