<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php';

if (!isset($_GET['patient_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Patient ID is required'
    ]);
    exit;
}

$patient_id = $conn->real_escape_string($_GET['patient_id']);

error_log("Fetching data for patient_id: " . $patient_id);

$query = "SELECT timestamp, spo2, bpm, diagnosa, catatan_dokter FROM data_kesehatan WHERE pasienid = '$patient_id' ORDER BY timestamp DESC";
$result = $conn->query($query);

if ($result === false) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database query failed: ' . $conn->error
    ]);
    exit;
}

$history_data = [];

while ($row = $result->fetch_assoc()) {
    $history_data[] = [
        'date' => $row['timestamp'],
        'spo2' => $row['spo2'],
        'bpm' => $row['bpm'],
        'diagnosa' => $row['diagnosa'],
        'catatan_dokter' => $row['catatan_dokter'] ? $row['catatan_dokter'] : null
    ];
}

echo json_encode([
    'status' => 'success',
    'history' => $history_data
]);

$conn->close();
?>