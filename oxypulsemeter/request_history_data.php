<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

try {
    $searchQuery = isset($_GET['search']) ? $_GET['search'] : '';
    
    $query = "SELECT ip.izin_pasien_id, ip.status, p.nama
              FROM izin_pasien ip
              JOIN pasien p ON ip.pasienid = p.pasien_id
              WHERE ip.status IN (0, 2)";
    
    if (!empty($searchQuery)) {
        $searchQuery = mysqli_real_escape_string($conn, $searchQuery);
        $query .= " AND p.nama LIKE '%$searchQuery%'";
    }
    
    $query .= " ORDER BY ip.izin_pasien_id DESC";
    
    $result = mysqli_query($conn, $query);
    
    $requests = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $requests[] = array(
            'id' => $row['izin_pasien_id'],
            'status' => $row['status'],
            'nama_pasien' => $row['nama']
        );
    }
    
    echo json_encode(array(
        'status' => 'success',
        'data' => $requests
    ));
} catch (Exception $e) {
    echo json_encode(array(
        'status' => 'error',
        'message' => $e->getMessage()
    ));
}

mysqli_close($conn);
?>