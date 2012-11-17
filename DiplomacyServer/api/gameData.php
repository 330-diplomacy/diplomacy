<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once("$root/diplomacy/DiplomacyServer/resource/database.php");
require_once("$root/diplomacy/DiplomacyServer/api/users/validate.php");
require_once("$root/diplomacy/DiplomacyServer/api/users/login.php");

header("Access-Control-Allow-Origin: http://lvh.me:12262");
header("Access-Control-Allow-Credentials: true");

class stateInfo
{
    public $gameName;
    public $phase;
    public $url;
    public $width;
    public $height;
    public $data;
    
    public function __construct($name, $phase, $url, $x, $y, $data)
    {
        $this->gameName = $name;
        $this->phase = $phase;
        $this->url = $url;
        $this->width = $x;
        $this->height = $y;
        $this->data = $data;
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
    public $owner;
    
    public function __construct($name, $ab, $type, $owner)
    {
        $this->name=$name;
        $this->abrv=$ab;
        $this->type=$type;
        $this->owner=$owner;
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

function getBoard($gameID)
{
    global $mysqli;
    
    $provlist = $mysqli->prepare("SELECT name, abrv, type, ownerid FROM provinces WHERE gameid=?");
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
    
    $provlist->bind_result($name, $abrv, $type, $owner);
    
    $provinces;
    
    while($provlist->fetch())
    {
        $temp = new provInfo($name, $abrv, $type, $owner);
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
    $unitlist->execute();
    
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
    
    return new playerList($players);        
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
    $info->fetch();
    
    $info->close();
    
    $variantData = $mysqli->prepare("SELECT path, x_dimension, y_dimension FROM variants WHERE name=?");
    if(!$variantData)
    {
        $err = "Query Prep Failed: ";
        $err .= $mysqli->error;
        
        echo($err);
        header("HTTP/1.0 500 Internal Server Error gameData 4");
        exit;
    }
    
    $variantData->bind_param("s", $variant);
    $variantData->execute();
    
    $variantData->bind_result($path, $xdim, $ydim);
    $variantData->fetch();
    
    $_SESSION["token"] = rand();
    $_SESSION["userID"] = $_POST["userID"];
    $_SESSION["username"] = $_POST["username"];
    
    $data = new loginInfo($_POST["userID"], $_POST["username"], $_SESSION["token"]);
    
    return new stateInfo($name, $phase, $path, $xdim, $ydim, $data);
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
}

if(validate())
{
    if(isset($_POST["gameID"]))
    {
        $gameInfo = new gameInfo($_POST["gameID"]);
        
        echo json_encode($gameInfo);
    }
    else
    {
        header("HTTP/1.0 400 Bad request");
    }
}
else
{
    header("HTTP/1.0 403 Forbidden Bad Login");
}

?>