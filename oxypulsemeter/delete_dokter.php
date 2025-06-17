<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'db.php';

if (!isset($_POST['dokter_id'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Dokter ID is required'
    ]);
    exit;
}

$dokter_id = $conn->real_escape_string($_POST['dokter_id']);

error_log("Attempting to delete doctor with ID: " . $dokter_id);

try {
    $conn->begin_transaction();

    $delete_izin = "DELETE FROM izin_pasien WHERE dokterid = '$dokter_id'";
    if (!$conn->query($delete_izin)) {
        throw new Exception("Error deleting doctor permissions: " . $conn->error);
    }

    $delete_dokter = "DELETE FROM dokter WHERE dokter_id = '$dokter_id'";
    if (!$conn->query($delete_dokter)) {
        throw new Exception("Error deleting doctor: " . $conn->error);
    }

    $conn->commit();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Doctor deleted successfully'
    ]);

} catch (Exception $e) {
    $conn->rollback();
    
    error_log("Error in delete_dokter.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error deleting doctor: ' . $e->getMessage()
    ]);
}

$conn->close();
?>