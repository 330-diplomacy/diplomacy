<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once("$root/diplomacy/DiplomacyServer/resource/database.php");

header("Access-Control-Allow-Origin: http://lvh.me:12262");
header("Access-Control-Allow-Credentials: true");

class loginInfo
{
    public $userID;
    public $username;
    public $token;
    
    function __construct($id, $name, $token)
    {
		$this->userID = $id;
		$this->username = $name;
		$this->token = $token;
	}
}

function login($username, $pw)
{
	global $mysqli;
    
    $username = htmlentities($username);

	$stmt = $mysqli->prepare("SELECT COUNT(*), id, saltedpw, username FROM users WHERE username=?");
	if(!$stmt)
	{
		$err = "Query Prep Failed: ";
		$err .= $mysqli->error;

		echo($err);
		header("HTTP/1.0 500 Internal Server Error Login 1");
		exit;
	}
	$stmt->bind_param("s", $username);
	$stmt->execute();

	$stmt->bind_result($count, $id, $pwd_hash, $user);
	$stmt->fetch();

	if($count == 1 && crypt($pw, $pwd_hash)==$pwd_hash)
	{
		$_SESSION["username"] = $user;
		$_SESSION["userID"] = $id;
		$_SESSION["token"] = rand();

		$info = new loginInfo($id, $user, $_SESSION["token"]);
		

		header("HTTP/1.0 200 OK");
        echo json_encode($info);
	}
	else
	{	
		header("HTTP/1.0 403 Forbidden Login 1");
	}
}
        
if(isset($_POST["username"]) && isset($_POST["password"]))
{
	$user=htmlentities($_POST["username"]);
	$pw=$_POST["password"];

	login($user, $pw);
}
else
{
	header("HTTP/1.0 400 Bad Request");
}
?>