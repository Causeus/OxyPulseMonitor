<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


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

$query = "SELECT spo2, bpm, diagnosa FROM data_kesehatan WHERE pasienid = '$patient_id' ORDER BY timestamp DESC LIMIT 1";
$result = $conn->query($query);

if ($result === false) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database query failed: ' . $conn->error
    ]);
    exit;
}

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    echo json_encode([
        'status' => 'success',
        'spo2' => $data['spo2'] ?? null,
        'bpm' => $data['bpm'] ?? null,
        'diagnosa' => $data['diagnosa'] ?? 'No diagnosis available'
    ]);
} else {
    echo json_encode([
        'status' => 'success',
        'spo2' => null,
        'bpm' => null,
        'diagnosa' => 'No data available'
    ]);
}

$conn->close();
?>