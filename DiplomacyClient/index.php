<?php session_start() ?>
<!DOCTYPE html>
<html>
    <head>
        <title>Diplomacy - Stab your friends in the back!</title>
        <script data-main="js/main-index" src="js/require-jquery.js"> </script>
        <link href="Content/themes/base/jquery.ui.all.css" rel="stylesheet" />
        <link href="css/index.css" rel="stylesheet" />
    </head>
    <body>
        <div id="user">
            <div id="register-div"></div>
            <div id="login-div"></div>
        </div>
        <div id="matches">
            <a href="game.php?gameID=7357">YOU JUST LOST THE GAME</a>
            <ul id="match-list"></ul>
        </div>
    </body>
</html>