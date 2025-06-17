<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Email and password are required.'
    ]);
    exit;
}

$email = $conn->real_escape_string($data['email']);
$password = $data['password'];

$check_pasien = "SELECT * FROM pasien WHERE email = '$email'";
$pasien_result = $conn->query($check_pasien);


$check_dokter = "SELECT * FROM dokter WHERE email = '$email'";
$dokter_result = $conn->query($check_dokter);

if ($pasien_result->num_rows > 0) {
    $user = $pasien_result->fetch_assoc();
    if (password_verify($password, $user['passwords'])) {
        echo json_encode([
            'status' => 'success',
            'userType' => 'pasien',
            'userId' => $user['pasien_id'],
            'userName' => $user['nama'],
            'redirectUrl' => 'homePasien'
        ]);
        exit;
    }
}

if ($dokter_result->num_rows > 0) {
    $user = $dokter_result->fetch_assoc();
    if (password_verify($password, $user['passwords'])) {
        echo json_encode([
            'status' => 'success',
            'userType' => 'dokter',
            'userId' => $user['dokter_id'],
            'userName' => $user['nama'],
            'redirectUrl' => 'homeDokter'
        ]);
        exit;
    }
}

echo json_encode([
    'status' => 'error',
    'message' => 'Invalid email or password.'
]);

$conn->close();
?>