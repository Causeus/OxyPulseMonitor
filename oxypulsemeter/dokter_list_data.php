<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include 'db.php';

try {
    $query = "SELECT d.dokter_id as id, d.nama as name, d.email, d.notelepon as phone, a.username as admin_name 
              FROM dokter d 
              LEFT JOIN admin a ON d.adminid = a.admin_id 
              ORDER BY d.nama ASC";
    
    $result = mysqli_query($conn, $query);
    
    if (!$result) {
        throw new Exception(mysqli_error($conn));
    }

    $doctors = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $doctors[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'admin_name' => $row['admin_name']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'doctors' => $doctors
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error fetching doctors: ' . $e->getMessage()
    ]);
}

mysqli_close($conn);
?>