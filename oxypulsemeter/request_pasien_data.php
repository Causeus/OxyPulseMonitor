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

error_log("Fetching request data for patient_id: " . $patient_id);

$query = "SELECT izin_pasien.izin_pasien_id, izin_pasien.status, dokter.nama 
          FROM izin_pasien 
          JOIN dokter ON izin_pasien.dokterid = dokter.dokter_id
          WHERE izin_pasien.pasienid = '$patient_id' 
          AND izin_pasien.status != 0";  

$result = $conn->query($query);

if ($result === false) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database query failed: ' . $conn->error
    ]);
    exit;
}

$requests_data = [];

while ($row = $result->fetch_assoc()) {
    $requests_data[] = [
        'izin_pasien_id' => $row['izin_pasien_id'],
        'status' => $row['status'],
        'dokter_nama' => $row['nama']
    ];
}


echo json_encode([
    'status' => 'success',
    'requests' => $requests_data
]);

$conn->close();
?>
