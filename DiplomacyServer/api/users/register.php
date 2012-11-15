<?php

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once("$root/diplomacy/DiplomacyServer/resource/database.php");
require_once("$root/diplomacy/DiplomacyServer/api/users/login.php");
require_once("$root/diplomacy/DiplomacyServer/api/users/validate.php");

header("Access-Control-Allow-Origin: http://lvh.me:12262");
header("Access-Control-Allow-Credentials: true");

if(isset($_POST["username"]))
{
	if(isset($_POST["pw"]))
	{
		$user=htmlentities($_POST["username"]);
		$saltedpw=crypt($_POST["pw"]);

		$stmt = $mysqli->prepare("INSERT IGNORE INTO users (username, saltedPW) VALUES (?, ?)");
		if(!$stmt)
		{	
			$err = "Query Prep Failed: ";
			$err .= $mysqli->error;
			echo($err);
			header("HTTP/1.0 500 Internal Server Error Register 1");

			exit;
		}

		$stmt->bind_param("ss", $user, $saltedpw);
		$stmt->execute();

		if($mysqli->affected_rows > 0)
		{
			login($user, $_POST["pw"]);
		}
		else
		{
			header("HTTP/1.0 409 Conflict Register 1");
		}
	}
	else
	{
		header("HTTP/1.0 400 Bad Request Register 1");
	}
}
else
{	
	header("HTTP/1.0 400 Bad Request Register 2");
}

?>