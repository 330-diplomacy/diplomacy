<?php

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once("$root/diplomacy/DiplomacyServer/resource/database.php");
require_once("$root/diplomacy/DiplomacyServer/api/game/mapparse.php");
require_once("$root/diplomacy/DiplomacyServer/resource/playerclass.php");
require_once("$root/diplomacy/DiplomacyServer/resource/provinceclass.php");
require_once("$root/diplomacy/DiplomacyServer/resource/unitclass.php");
require_once("$root/diplomacy/DiplomacyServer/api/users/validate.php");

function newGame($name, $variant)
{
    global $mysqli;
    
    $info = mapprocess($variant);
    
    $owner = $_POST["userID"];
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
    
    if($mysqli->affected_rows == 0)
    {
        header("HTTP/1.0 409 Conflict Create Game 1");
        return false;
    }

    $players = $info[0];
    $provinces = $info[1];
    $units = $info[2];    
    
    foreach($players as $current)
    {
        $addPower = $mysqli->prepare("INSERT INTO powers (powername, powernum, powercolor, gameID) VALUES (?, ?, ?, ?)");
        if(!$addPower)
        {
            $err = "Query Prep Failed: ";
            $err .= $mysqli->error;
            
            echo($err);
            header("HTTP/1.0 500 Internal Server Error Create Game 4");
            return false;
        }
        
        $addPower->bind_param("sisi", $current->power, $current->pnum, $current->pcolor, $gameID);
        $addPower->execute();
        
        echo($mysqli->error);
        echo(" ");
        
        if($mysqli->affected_rows == 0)
        {
            header("HTTP/1.0 409 Conflict Create Game 4");
            return false;
        }
        $addPower->close();
    }
            
    
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
        
        $addProvince->bind_param("issiii", $gameID, $current->name, $current->abrv, $current->type, $current->isDepot, $current->homeDepot);
        $addProvince->execute();
        
        echo($mysqli->error);
        echo(" ");
        
        if($mysqli->affected_rows == 0)
        {
            header("HTTP/1.0 409 Conflict Create Game 2");
            return false;
        }
        $addProvince->close();
    }
    
    foreach($units as $current)
    {
        $addUnit = $mysqli->prepare("INSERT INTO units (type, powerid, locationid, gameid) VALUES (?, ?, ?, ?)");
        if(!$addUnit)
        {
            $err = "Query Prep Failed: ";
            $err .= $mysqli->error;
            
            echo($err);
            header("HTTP/1.0 500 Internal Server Error Create Game 3");
            return false;
        }
        
        $addUnit->bind_param("iisi", $current->type, $current->ownerint, $current->location, $gameID);
        $addUnit->execute();
        
        echo($mysqli->error);
        echo(" ");
        
        if($mysqli->affected_rows == 0)
        {
            header("HTTP/1.0 409 Conflict Create Game 3");
            return false;
        }
        $addUnit->close();
    }
    
}

if(validate())
{

    $name = $_POST["name"];
    $var = $_POST["variant"];

    newGame($name, $var);
}
else
{
    header("HTTP/1.0 403 Forbidden Bad Validate create game");
}

?>