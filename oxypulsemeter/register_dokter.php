<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['password']) || 
    !isset($data['phone']) || !isset($data['admin_id'])) {
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
$admin_id = (int)$data['admin_id'];

$check_dokter = "SELECT email FROM dokter WHERE email = '$email'";
$dokter_result = $conn->query($check_dokter);
if ($dokter_result->num_rows > 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Email sudah terdaftar sebagai dokter'
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

$sql = "INSERT INTO dokter (nama, email, passwords, notelepon, adminid) 
        VALUES ('$name', '$email', '$password', '$phone', $admin_id)";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Doctor registered successfully'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $conn->error
    ]);
}

$conn->close();
?>