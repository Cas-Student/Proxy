<?php
    $host = 'ep-sweet-sound-a40jvt3t.us-east-1.pg.koyeb.app';
    $user='koyeb-adm';
    $password='R24IfvslAyqU';
    $database='users';
    $connect = mysqli_connect($host);
    //Checks to see if the connection was made
    if (!$connect) {
        echo "Could not connect to network";
        exit(0);
    }
    //SQL code
    $sql = 'SELECT * FROM *;';
    //Queries SQL
    $result = mysqli_query($connect,$sql);
    //Checks to see if the query was sucessful
    if (!$result) {
        echo "Could not get information";
        exit(0);
    }
    //Formats data
    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
    //Displays data
    foreach ($rows as $row) {
        echo $row['']":|<br>";
    }
    //PHP
    $fName = $_REQUEST['fName'];
    $lName = $_REQUEST['lName'];
    $pin = $_REQUEST['pin'];
    echo "Helo World";
    echo "input was fName=".fName."&lName=".lName."&pin=".pin;
?>