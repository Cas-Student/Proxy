<?php

$id = $_REQUEST['fName'].".".$_REQUEST['lName'].".".$_REQUEST.time();
setcookie("id", $id, time() + 86400, "/");
echo $id;

?>
