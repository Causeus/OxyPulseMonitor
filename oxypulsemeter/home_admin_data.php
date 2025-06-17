<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

try {
    $queryDoctors = "SELECT COUNT(*) as totalDoctors FROM dokter";
    $resultDoctors = mysqli_query($conn, $queryDoctors);
    $totalDoctors = mysqli_fetch_assoc($resultDoctors)['totalDoctors'];

    $queryPatients = "SELECT COUNT(*) as totalPatients FROM pasien";
    $resultPatients = mysqli_query($conn, $queryPatients);
    $totalPatients = mysqli_fetch_assoc($resultPatients)['totalPatients'];

    echo json_encode([
        'status' => 'success',
        'totalDoctors' => (int)$totalDoctors,
        'totalPatients' => (int)$totalPatients
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error fetching dashboard data: ' . $e->getMessage()
    ]);
}

mysqli_close($conn);
?>