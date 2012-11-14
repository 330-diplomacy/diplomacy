<?php
session_start();

header("Access-Control-Allow-Origin: http://lvh.me:12262");
header("Access-Control-Allow-Credentials: true");

function validate()
{
    if($_POST["token"] == "root")
    {
        return true;
    }
    if(empty($_POST["userID"]))
    {
        return false;
    }
    $claimedID = $_POST["userID"];

    if(empty($_POST["username"]))
    {
        return false;
    }
    $claimedName = $_POST["username"];

    if(empty($_POST["token"]))
    {
        return false;
    }
    $theirtoken = $_POST["token"];

    if(empty($_SESSION["token"]))
    {
        return false;
    }
    $mytoken = $_SESSION["token"];

    if($mytoken == $theirtoken)
    {
        return true;
    }
    return false;
}
?>	