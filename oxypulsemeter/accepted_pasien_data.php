<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include 'db.php';


try {
    $searchQuery = isset($_GET['search']) ? $_GET['search'] : '';
    $dokterId = isset($_GET['dokterId']) ? $_GET['dokterId'] : '';
    
    if (empty($dokterId)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Doctor ID is required'
        ]);
        exit;
    }
    
    $query = "SELECT p.pasien_id, p.nama, p.dateofbirth, p.notelepon
              FROM izin_pasien ip
              JOIN pasien p ON ip.pasienid = p.pasien_id
              WHERE ip.status = 1 AND ip.dokterid = '$dokterId'";
    
    if (!empty($searchQuery)) {
        $searchQuery = mysqli_real_escape_string($conn, $searchQuery);
        $query .= " AND p.nama LIKE '%$searchQuery%'";
    }
    
    $query .= " ORDER BY p.nama ASC";
    
    $result = mysqli_query($conn, $query);
    
    $patients = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $patients[] = array(
            'id' => $row['pasien_id'],
            'nama' => $row['nama'],
            'tanggal_lahir' => $row['dateofbirth'],
            'no_telp' => $row['notelepon']
        );
    }
    
    echo json_encode(array(
        'status' => 'success',
        'data' => $patients
    ));
} catch (Exception $e) {
    echo json_encode(array(
        'status' => 'error',
        'message' => $e->getMessage()
    ));
}

mysqli_close($conn);
?>