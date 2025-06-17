<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$patientId = isset($_GET['patientId']) ? $_GET['patientId'] : null;
$search = isset($_GET['search']) ? $_GET['search'] : '';

if (!$patientId) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Patient ID is required'
    ]);
    exit;
}

include 'db.php';
$query = "SELECT kesehatan_id, spo2, bpm, diagnosa, timestamp, catatan_dokter 
          FROM data_kesehatan 
          WHERE pasienid = '$patientId'";

if ($search) {
    $query .= " AND (DATE_FORMAT(timestamp, '%Y-%m-%d') LIKE '%$search%' OR DATE_FORMAT(timestamp, '%H:%i:%s') LIKE '%$search%')";
}

$query .= " ORDER BY timestamp DESC";

$result = mysqli_query($conn, $query);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = [
            'id' => $row['kesehatan_id'],
            'timestamp' => $row['timestamp'],
            'spo2' => $row['spo2'],
            'bpm' => $row['bpm'],
            'diagnosa' => $row['diagnosa'],
            'catatan_dokter' => $row['catatan_dokter']
        ];
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $data
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch health data'
    ]);
}

mysqli_close($conn);
?>