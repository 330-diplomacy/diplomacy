define('Province', function() {
    // Start with the constructor
    function Province(name, neighbors, type, isDepot, homeDepot, unit, coasts, locations) {
        this.name = name;
        this.neighbors = neighbors;
        this.type = type;
        this.isDepot = isDepot;
        this.homeDepot = homeDepot;
        this.unit = unit;
        this.coasts = coasts;
        this.locations = locations;
    }

    // Now add methods
    Province.prototype.moveHere = function(newUnit) {
        if(unit) {
            return false;
        }
        // Turns out I want to write unit first, this is just a demo for you
        this.unit = newUnit;
        return true;
    };

    Province.loadFromJSON = function() {
        // another demo for you, but we can do static functions like this.
    };

    // And now return the constructor function
    return Province;
});