<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Username and password are required.'
    ]);
    exit;
}

$username = $conn->real_escape_string($data['username']);
$password = $data['password'];

$check_admin = "SELECT * FROM admin WHERE username = '$username'";
$admin_result = $conn->query($check_admin);

if ($admin_result->num_rows > 0) {
    $admin = $admin_result->fetch_assoc();
    if (password_verify($password, $admin['passwords'])) {
        echo json_encode([
            'status' => 'success',
            'userType' => 'admin',
            'userId' => $admin['admin_id'],
            'userName' => $admin['username'],
            'redirectUrl' => 'homeAdmin'
        ]);
        exit;
    }
}

echo json_encode([
    'status' => 'error',
    'message' => 'Invalid username or password.'
]);

$conn->close();
?>