<?php

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once("$root/diplomacy/DiplomacyServer/api/game/mapparse.php");

function newGame($name, $variant)
{
    global $mysqli;
    
    $variant = "standard"; //for debugging
    
    $info = mapprocess($variant);
    
    $owner = $_SESSION["5000"];
    $phase = "WFPl";
    
    $addGame = $mysqli->prepare("INSERT INTO games (name, phase, owner, variant) VALUES (?, ?, ?, ?)");
    if(!$addGame)
    {
        $err = "Query Prep Failed: ";
        $err .= $mysqli->error;
        
        echo($err);
        header("HTTP/1.0 500 Internal Server Error Create Game 1");
        return false;
    }
    
    $addGame->bind_param("ssis", $name, $phase, $owner, $variant);
    $addGame->execute();
    
    $gameID = $mysqli->insert_id;   
    $addGame->close();
    
    if($mysqli->affected_rows = 0)
    {
        header("HTTP/1.0 409 Conflict Create Game 1");
        return false;
    }
    
    $players = $info[0];
    $provinces = $info[1];
    $units = $info[2];
    
    foreach($provinces as $current)
    {
        $addProvince = $mysqli->prepare("INSERT INTO provinces (gameid, name, abrv, type, isdepot, homedepot) VALUES (?, ?, ?, ?, ?, ?)");
        if(!$addProvince)
        {
            $err = "Query Prep Failed: ";
            $err .= $mysqli->error;
            
            echo($err);
            header("HTTP/1.0 500 Internal Server Error Create Game 2");
            return false;
        }
        
        $addProvince->bind_param("issiii", $gameID, $current->name, $curren->abrv, $current->type, $current->isdepot, $current->homedepot);
        $addProvince->execute();
        
        if($mysqli->affected_rows = 0)
        {
            header("HTTP/1.0 409 Conflict Create Game 2");
            return false;
        }
        $addProvince->close();
    }
    
    foreach($unit as $current)
    {
        $addUnit = $mysqli->prepare("INSERT INTO units (type, ownerint, locationid, gameid) VALUSE (?, ?, ?, ?)");
        if(!$addUnit)
        {
            $err = "Query Prep Failed: ";
            $err .= $mysqli->error;
            
            echo($err);
            header("HTTP/1.0 500 Internal Server Error Create Game 3");
            return false;
        }
        
        $addUnit->bind_param("iiii", $current->type, $current->ownerid, $current->locationid, $gameID);
        $addUnit->execute;
        
        if($mysqli->affected_rows = 0)
        {
            header("HTTP/1.0 409 Conflict Create Game 3");
            return false;
        }
        $addUnit->close();
    }
    
}

$name = $_POST["name"];
$var = $_POST["variant"];

newGame($name, $var);

?>