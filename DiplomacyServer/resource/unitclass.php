<?php

class unit
{
    public $type;
    public $ownerint;
    public $location;
    public $abrv;
    
    function __construct($type, $ownerint, $location, $abrv)
    {
        $this->type = $type;
        $this->ownerint = $ownerint;
        $this->location = $location;
        $this->abrv = $abrv;
    }
}

?>