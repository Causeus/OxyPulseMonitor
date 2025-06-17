<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

if (!isset($_POST['pasien_id'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Pasien ID is required'
    ]);
    exit;
}

$pasien_id = $conn->real_escape_string($_POST['pasien_id']);

try {
    $conn->begin_transaction();

    $get_device = "SELECT deviceid FROM pasien WHERE pasien_id = '$pasien_id'";
    $result = $conn->query($get_device);
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $device_id = $row['deviceid'];
        
        if ($device_id) {
            $update_device = "UPDATE device SET used = 0 WHERE device_id = '$device_id'";
            if (!$conn->query($update_device)) {
                throw new Exception("Error updating device status: " . $conn->error);
            }
        }
    }

    $delete_izin = "DELETE FROM izin_pasien WHERE pasienid = '$pasien_id'";
    if (!$conn->query($delete_izin)) {
        throw new Exception("Error deleting patient permissions: " . $conn->error);
    }

    $delete_health = "DELETE FROM data_kesehatan WHERE pasienid = '$pasien_id'";
    if (!$conn->query($delete_health)) {
        throw new Exception("Error deleting health data: " . $conn->error);
    }

    $delete_pasien = "DELETE FROM pasien WHERE pasien_id = '$pasien_id'";
    if (!$conn->query($delete_pasien)) {
        throw new Exception("Error deleting patient: " . $conn->error);
    }

    $conn->commit();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Patient deleted successfully'
    ]);

} catch (Exception $e) {
    $conn->rollback();
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>