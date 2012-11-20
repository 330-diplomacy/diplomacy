<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once("$root/diplomacy/DiplomacyServer/resource/database.php");
require_once("$root/diplomacy/DiplomacyServer/api/users/validate.php");

class gameListData
{
    public $id;
    public $name;
    public $owner;
    public $pcount;
    public $max;
    
    public function __construct($id, $name, $owner, $pcount, $max)
    {
        $this->id = $id;
        $this->name = $name;
        $this->owner = $owner;
        $this->pcount = $pcount;
        $this->max = $max;
    }
}

if(validate())
{
    $stmt = $mysqli->prepare("SELECT id, name, owner, player2, player3, player4, player5, player6, player7, variant, maxplayers FROM games WHERE owner = ? OR player1 = ? or player2 = ? or player3 = ? or player4 = ? or player5 = ? or player6 = ?");
    if(!$stmt)
    {
		$err = "Query Prep Failed: ";
		$err .= $mysqli->error;

		echo($err);
		header("HTTP/1.0 500 Internal Server Error List 1");
		exit;
	}
    
    $id = $_POST["userID"];
    
    $stmt->bind_params("iiiiiii", $id, $id, $id, $id, $id, $id, $id);
    $stmt->execute();
    
    $stmt->bind_result($id, $name, $owner, $player2, $player3, $player4, $player5, $player6, $player7, $variant, $max);
    
    $ans = array();
    
    while($stmt->fetch())
    {
        $pcount = '1'; 
        
        if(!is_null($player2))
        {
            $pcout++;
        }
        if(!is_null($player3))
        {
            $pcount++;
        }
        if(!is_null($player4))
        {
            $pcount++;
        }
        if(!is_null($player5))
        {
            $pcount++;
        }
        if(!is_null($player6))
        {
            $pcount++;
        }
        if(!is_null($player7))
        {
            $pcount++;
        }
        
        $info = new gameListData($id, $name, $owner, $pcount, $max);
        
        $ans[] = $info;
    }
    
    echo json_encode($ans);    
}
else
{
    
}


?>