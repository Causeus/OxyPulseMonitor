<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['patientId']) || !isset($data['doctorNotes']) || !isset($data['dataId'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

$patientId = $data['patientId'];
$doctorNotes = $data['doctorNotes'];
$dataId = $data['dataId'];

include 'db.php';

$query = "UPDATE data_kesehatan SET catatan_dokter = '$doctorNotes' WHERE kesehatan_id = '$dataId' AND pasienid = '$patientId'";
$result = mysqli_query($conn, $query);

if ($result) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Doctor notes updated successfully'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to update doctor notes'
    ]);
}

mysqli_close($conn);
?>