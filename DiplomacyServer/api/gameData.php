<?php

class stateInfo
{
    public $gameName;
    public $phase;
    public $url;
    public $width;
    public $height;
    
    public function __construct($name, $phase, $url, $x, $y)
    {
        $this->gameName = $name;
        $this->phase = $phase;
        $this->url = $url;
        $this->width = $x;
        $this->height = $y;
    }
}

class playerList
{
    public $players;
    
    public function __construct($pl)
    {
        $this->players=$pl;
    }
}

class player
{
    public $username;
    public $powername;
    public $powernum;
    public $color;
    
    public function __construct($name, $pname, $pnum, $c)
    {
        $this->username=$name;
        $this->powername=$pname;
        $this->powernum=$pnum;
        $this->color=$c;
    }
    
    public function openPower($pname, $pnum, $c)
    {
        $id = "0";
        return new player($id, $pname, $pnum, $c);
    }
}

class board
{
    public $provinces;
    public $units;
    
    public function __construct($prov, $unit)
    {
        $this->provinces=$prov;
        $this->units=$unit;
    }
}

class provInfo
{
    public $name;
    public $abrv;
    public $type;
    
    public function __construct($name, $ab, $type)
    {
        $this->name=$name;
        $this->abrv=$ab;
        $this->type=$type;
    }
}

class unitInfo
{
    public $type;
    public $ownernum;
    public $location;
    
    public function __construct($type, $owner, $loc)
    {
        $this->type = $type;
        $this->ownernum = $owner;
        $this->location = $loc;
    }
}

class gameInfo
{
    public $boardInfo;
    public $playerList;
    public $state;
    
    public function __construct($GID)
    {
        $this->boardInfo = getBoard($GID);
        $this->playerList = getPlayers($GID);
        $this->state = getState($GID);
    }
    
    function getBoard($gameID)
    {
        global $mysqli;
        
        $provlist = $mysqli->preapre("SELECT name, abrv, type FROM provinces WHERE gameid=?");
        if(!$provlist)
        {
            $err = "Query Prep Failed: ";
            $err .= $mysqli->error;
            
            echo($err);
            header("HTTP/1.0 500 Internal Server Error gameData 1");
            exit;
        }
        
        $provlist->bind_param("i", $gameID);
        $provlist->execute();
        
        $provlist->bind_result($name, $abrv, $type);
        
        $provinces;
        
        while($provlist->fetch())
        {
            $temp = new provInfo($name, $abrv, $type);
            $provinces[] = $temp;
        }
        
        $provlist->close();
        
        $unitlist = $mysqli->prepare("SELECT type, powerid, locationid FROM units WHERE gameid=?");
        if(!$unitlist)
        {
            $err = "Query Prep Failed: ";
            $err .= $mysqli->error;
            
            echo($err);
            header("HTTP/1.0 500 Internal Server Error gameData 2");
            exit;
        }    
        
        $unitlist->bind_param("i", $gameID);
        $unitlist->execute;
        
        $unitlist->bind_result($type, $power, $loc);
        $units;
        
        while($unitlist->fetch())
        {
            $temp = new unitInfo($type, $power, $loc);
            $units[] = $temp;
        }
        
        return new board($provinces, $units);       
    }
    
    function getPlayers($gameID)
    {
        global $mysqli;
        
        $playerInfo = $mysqli->prepare("SELECT user, powername, powernum, powercolor FROM powers WHERE gameid=?");
        if(!$playerInfo)
        {
            $err = "Query Prep Failed: ";
            $err .= $mysqli->error;
            
            echo($err);
            header("HTTP/1.0 500 Internal Server Error gameData 5");
            exit;
        }   
        $playerInfo->bind_param("i", $gameID);
        $playerInfo->execute();
        
        $playerInfo->bind_result($user, $powername, $powernum, $color);
        
        $players;
        
        while($playerInfo->fetch())
        {
            $temp = new player($user, $powername, $powernum, $color);
            $players[] = $temp;
        }
        
        return new playerslist($players);        
    }
    
    function getState($gameID)
    {
        global $mysqli;
        
        $info = $mysqli->prepare("SELECT name, phase, variant FROM games WHERE id=?");
        if(!$info)
        {
            $err = "Query Prep Failed: ";
            $err .= $mysqli->error;
            
            echo($err);
            header("HTTP/1.0 500 Internal Server Error gameData 3");
            exit;
        }
        
        $info->bind_param("i", $gameID);
        $info->execute();
        
        $info->bind_result($name, $phase, $variant);
        $fetch();
        
        $variantData = $mysqli->prepare("SELECT path, x_dimension, y_dimension FROM variants WHERE name=?");
        if(!$info)
        {
            $err = "Query Prep Failed: ";
            $err .= $mysqli->error;
            
            echo($err);
            header("HTTP/1.0 500 Internal Server Error gameData 4");
            exit;
        }
        
        $variantData->bind_param("s", $variant);
        $variantData->execute();
        
        $variantData->bind_results($path, $xdim, $ydim);
        $fetch();
        
        return new stateInfo($name, $phase, $path, $xdim, $ydim);
    }
}

if(isset($_POST["gameID"]))
{
    $gameInfoTest = new gameInfo($_POST["gameID"]);
    
    echo json_encode($gameInfoTest);
}
else
{
    
}

?>