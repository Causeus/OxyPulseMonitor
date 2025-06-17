<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

try {
    $query = "SELECT pasien_id as id, nama as name, dateofbirth as dob, email, notelepon as phone 
              FROM pasien 
              ORDER BY nama ASC";
    
    $result = mysqli_query($conn, $query);
    
    if (!$result) {
        throw new Exception(mysqli_error($conn));
    }

    $patients = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $patients[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'dob' => $row['dob'],
            'email' => $row['email'],
            'phone' => $row['phone']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'patients' => $patients
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error fetching patients: ' . $e->getMessage()
    ]);
}

mysqli_close($conn);
?>