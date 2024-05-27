<?php

$id = $_REQUEST['fName'].".".$_REQUEST['lName'].".".$_REQUEST.time();
setcookie("id", $id, time() + 86400, "/");
echo $id;

/*
$mysqli = mysqli_connect("ep-sweet-sound-a40jvt3t.us-east-1.pg.koyeb.app","koyeb-adm","R24IfvslAyqU","koyebdb");

if (mysqli_connect_errno()) {
  exit();
} else {
  $sql = "Select First FROM users";
  $res = mysqli_query($mysqli, $sql);
  if ($res === TRUE) {
    $Pin = $newArray['Pin'];
    $firstName = $newArray['First'];
    $lastName = $newArray['Last'];
    echo "<script>alert('Hello' + $firstName ' ' + $lastName + ', your pin is: ' + $Pin);</script>";
  }
  mysqli_close($mysqli);
}
*/

?>
