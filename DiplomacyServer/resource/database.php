<?php

$mysqli = new mysqli('localhost', 'diplomacy', 'sqlpoo', 'diplomacy');

if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>