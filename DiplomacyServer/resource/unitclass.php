<?php

class unit{
    public $type;
    public $ownerint;
    public $location;
    
    function __construct($type, $ownerint, $location)
    {
        $this->type = $type;
        $this->ownerint = $ownerint;
        $this->location = $location;
    }
}

?>