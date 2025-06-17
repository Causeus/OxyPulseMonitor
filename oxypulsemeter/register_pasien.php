<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['password']) || 
    !isset($data['phone']) || !isset($data['dateofbirth']) || !isset($data['device_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

$name = $conn->real_escape_string($data['name']);
$email = $conn->real_escape_string($data['email']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$phone = $conn->real_escape_string($data['phone']);
$dateofbirth = $conn->real_escape_string($data['dateofbirth']);
$device_id = $conn->real_escape_string($data['device_id']);

$check_device = "SELECT used FROM device WHERE device_id = '$device_id'";
$device_result = $conn->query($check_device);

if ($device_result->num_rows === 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Device ID tidak ditemukan'
    ]);
    exit;
}

$device_data = $device_result->fetch_assoc();
if ($device_data['used'] == 1) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Device ID sudah terpakai'
    ]);
    exit;
}

$check_pasien = "SELECT email FROM pasien WHERE email = '$email'";
$pasien_result = $conn->query($check_pasien);
if ($pasien_result->num_rows > 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Email sudah terdaftar sebagai pasien'
    ]);
    exit;
}

$check_dokter = "SELECT email FROM dokter WHERE email = '$email'";
$dokter_result = $conn->query($check_dokter);
if ($dokter_result->num_rows > 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Email sudah terdaftar sebagai dokter'
    ]);
    exit;
}

$sql = "INSERT INTO pasien (nama, email, passwords, notelepon, dateofbirth, deviceid) 
        VALUES ('$name', '$email', '$password', '$phone', '$dateofbirth', '$device_id')";

if ($conn->query($sql) === TRUE) {
    $update_device = "UPDATE device SET used = 1 WHERE device_id = '$device_id'";
    $conn->query($update_device);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Patient registered successfully'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $conn->error
    ]);
}

$conn->close();
?>