<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once("$root/diplomacy/DiplomacyServer/resource/database.php");
require_once("$root/diplomacy/DiplomacyServer/api/users/loginInfo.php");

header("Access-Control-Allow-Origin: http://lvh.me:12262");
header("Access-Control-Allow-Credentials: true");
        
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