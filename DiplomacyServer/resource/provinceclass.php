<?php

class province{
    
    public $name;
    public $abrv;
    public $type;
    public $isDepot;
    public $homeDepot;
    public $landMoves;
    public $watermoves1;
    public $watermoves2;
    public $unit;
    
    function __construct($name, $abrv, $type, $isDepot, $homedepot, $land, $water1, $water2)
    {
        $this->name = $name;
        $this->abrv = $abrv;
        $this->type = $type;
        $this->isDepot = $isDepot;
        $this->homeDepot = $homedepot;
        $this->landMoves = $land;
        $this->watermoves1 = $water1;
        $this->watermoves2 = $water2;
    }
}

?>