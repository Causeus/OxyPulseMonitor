<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include 'db.php';



if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'This endpoint only accepts POST requests'
    ]);
    exit;
}

try {
    if (!isset($_POST['pasienId']) || !isset($_POST['dokterId'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields: pasienId and dokterId'
        ]);
        exit;
    }

    $pasienId = $_POST['pasienId'];
    $dokterId = $_POST['dokterId'];

    $checkAcceptedQuery = "SELECT izin_pasien_id FROM izin_pasien WHERE pasienid = '$pasienId' AND status = 1";
    $acceptedResult = mysqli_query($conn, $checkAcceptedQuery);
    
    if (mysqli_num_rows($acceptedResult) > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Patient already has an accepted doctor'
        ]);
        exit;
    }

    $checkQuery = "SELECT izin_pasien_id FROM izin_pasien WHERE pasienid = '$pasienId' AND dokterid = '$dokterId'";
    $result = mysqli_query($conn, $checkQuery);
    
    if (mysqli_num_rows($result) > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Request already exists for this patient'
        ]);
        exit;
    }
    
    $query = "INSERT INTO izin_pasien (status, pasienid, dokterid) VALUES (2, '$pasienId', '$dokterId')";
    $result = mysqli_query($conn, $query);
    
    if ($result) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Request created successfully'
        ]);
    } else {
        throw new Exception("Failed to create request");
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

mysqli_close($conn);
?>