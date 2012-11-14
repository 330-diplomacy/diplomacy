<?php

class player
{
    public $name;
    public $id;
    public $power;
    public $pnum;
    public $pcolor;
    
    function __construct($power, $pnum, $pcolor)
    {
        $this->name = "Open";
        $this->id = 0;
        $this->power = $power;
        $this->pnum = $pnum;
        $this->pcolor = $pcolor;        
    }
    
    function addplayer($name, $id)
    {
        $this->name = $name;
        $this->id = $id;
    }
    
    function quit()
    {
        $this->name = "Quitter";
        $this->id = 1;
    }    
}

class playerslist{
    
    //todo?
}

?>