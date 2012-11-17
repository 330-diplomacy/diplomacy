<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once("$root/diplomacy/DiplomacyServer/resource/playerclass.php");
require_once("$root/diplomacy/DiplomacyServer/resource/provinceclass.php");
require_once("$root/diplomacy/DiplomacyServer/resource/unitclass.php");

// takes in an array. Index 0 is the number of powers, then 1 - n are the countries in the
// form name number color. Returns an array of Player objects with null names and playerIDs
function registerPowers($powers)
{
    $count = $powers[0];
    $countries = array();
    
    for($i = 1; $i <= $count; $i++)
    {
        $pieces = explode(" ", $powers[$i]);
        $temp = new player($pieces[0], $pieces[1], $pieces[2]);
        $countries[$i] = $temp;
    }
    
    return $countries;
}

// takes in an array. Index 0 is the number of provinces, then 1-n are the provinces. Each one
// first lists its name, then short code, then it's province type, an isDepot Boolean, and neighbors
// returns an array of provinces
function registerProvinces($provArray)
{
    
    $count = $provArray[0];
    $provinces = array();
    
    for($i = 1; $i <= $count; $i++)
    {
        $pieces = explode(", ", $provArray[$i]);
        $name = $pieces[0];
        $abrv = $pieces[1];
        $type = $pieces[2];
        $isDepot = $pieces[3];
        $homedepot = $pieces[4];
        
        //Adto state controller. Uses an int to change state for the switch below
        //0 - add to land
        //1 - add to water 1
        //2 - add to water 2
        //3 - inititial option, add to water1 and land
        $adto = 3;
        
        $j = 5;
        
        $land = array();
        $water1 = array();
        $water2 = array(); 
        
        while(array_key_exists($j, $pieces))
        {
            $temp = $pieces[$j];
            $ctrl = FALSE;
            switch($temp)
            {
                case "L":
                    $adto = 0;
                    $ctrl = TRUE;
                    break;
                case "W1":
                    $adto = 1;
                    $ctrl = TRUE;
                    break;
                case "W2":
                    $adto = 2;
                    $ctrl = TRUE;
                    break;
            }
            
            if(!$ctrl)
            {
                switch($adto)
                {
                    case 3:
                        $land[] = $temp;
                        $water1[] = $temp;
                        break;
                    case 0:
                        $land[] = $temp;
                        break;
                    case 1:
                        $water1 = $temp;
                        break;
                    case 2:
                        $water2 = $temp;
                        break;                    
                }
            }
        }
        $prov = new province($name, $abrv, $type, $isDepot, $homedepot, $land, $water1, $water2);
        $provinces[$name] = $prov;
    }
    
    return $provinces;
}

function startingPos($starting, $provinces)
{
    $count = $starting[0];
    $units = array();
    for($i=1; $i <= $count; $i++)
    {
        $pieces = explode(" ", $starting[$i]);
        
        $type = $pieces[0];
        $owner = $pieces[1];
        $location = $pieces[2];
        
        if($type == "F")
        {
            $type == 1;
        }
        else
        {
            $type == 0;
        }
        

        $temp = new unit($type, $owner, $location);
        $provinces[$location]->unit=$temp;
        $units[] = $temp;  
    }
    
    return $units;
}

function mapprocess($name)
{
    global $root;
    $filename = "$root/diplomacy/DiplomacyServer/resource/Maps/$name/$name.txt";
    
    if(file_exists($filename))
    {
        $ans = array();
        $plarray = array();
        $file = fopen($filename, "r");
        $plcount = fgets($file);

        $plarray[0] = $plcount;
        for($i = 1; $i <= $plcount; $i++)
        {
            $temp = fgets($file);
            $plarray[$i] = $temp;            
        }
        
        $countries = registerPowers($plarray);
        $ans[] = $countries;
        
        $prcount = fgets($file);
        $prarray = array();
        $prarray[0] = $prcount;
        for($i = 1; $i <= $prcount; $i++)
        {
            $temp = fgets($file);
            $prarray[$i] = $temp;
        }
        
        $provinces = registerProvinces($prarray);
        $ans[] = $provinces;
        
        $scount = fgets($file);
        $sarray = array();
        $sarray[0] = $scount;
        for($i = 1; $i <= $scount; $i++)
        {
            $temp = fgets($file);
            $sarray[$i] = $temp;
        }
        
        $starting = startingPos($sarray, $provinces);
        
        $ans[] = $starting;
        echo("ans: ");
        echo($ans);
       
        return $ans;
        
    }
    else
    {
        header("HTTP/1.0 400 Bad Request no such config file");
    }
}

?>