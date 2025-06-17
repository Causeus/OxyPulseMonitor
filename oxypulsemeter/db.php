<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "oxypulsemonitor";
$port = 3308;

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Connection failed: ' . $conn->connect_error
    ]));
}
?>