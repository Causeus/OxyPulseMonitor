<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['requestId']) || !isset($data['action'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Request ID and action are required'
    ]);
    exit;
}

$request_id = $conn->real_escape_string($data['requestId']);
$action = $conn->real_escape_string($data['action']);

if ($action == 'accept') {
    $updatePendingSql = "UPDATE izin_pasien SET status = 0 WHERE izin_pasien_id != '$request_id' AND status = 2";
    $stmt = $conn->query($updatePendingSql);

    if ($stmt === false) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to reject other pending requests: ' . $conn->error
        ]);
        exit;
    }

    $updateAcceptedSql = "UPDATE izin_pasien SET status = 1 WHERE izin_pasien_id = '$request_id'";
    $stmt = $conn->query($updateAcceptedSql);

    if ($stmt === false) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to accept request: ' . $conn->error
        ]);
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Request accepted and other pending requests rejected'
    ]);
} elseif ($action == 'reject') {
    $updateRejectedSql = "UPDATE izin_pasien SET status = 0 WHERE izin_pasien_id = '$request_id'";
    $stmt = $conn->query($updateRejectedSql);

    if ($stmt === false) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to reject request: ' . $conn->error
        ]);
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Request rejected'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid action'
    ]);
}

$conn->close();
?>
