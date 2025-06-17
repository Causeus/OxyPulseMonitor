<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';
try {
    $countQuery = "SELECT COUNT(*) as total FROM pasien";
    $countResult = mysqli_query($conn, $countQuery);
    $totalPatients = mysqli_fetch_assoc($countResult)['total'];

    $query = "SELECT p.pasien_id, p.nama, 
              CASE 
                WHEN latest_status.status = 1 THEN 'Assigned'
                WHEN latest_status.status = 2 OR latest_status.status = 3 THEN 'Pending'
                ELSE 'Available'
              END as status
              FROM pasien p
              LEFT JOIN (
                SELECT pasienid, status
                FROM izin_pasien ip1
                WHERE izin_pasien_id = (
                    SELECT izin_pasien_id
                    FROM izin_pasien ip2
                    WHERE ip2.pasienid = ip1.pasienid
                    ORDER BY izin_pasien_id DESC
                    LIMIT 1
                )
              ) latest_status ON p.pasien_id = latest_status.pasienid
              ORDER BY p.nama ASC";
    $result = mysqli_query($conn, $query);
    
    $patients = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $patients[] = array(
            'id' => $row['pasien_id'],
            'nama_pasien' => $row['nama'],
            'status' => $row['status']
        );
    }
    
    echo json_encode(array(
        'status' => 'success',
        'totalPatients' => $totalPatients,
        'patients' => $patients
    ));
} catch (Exception $e) {
    echo json_encode(array(
        'status' => 'error',
        'message' => $e->getMessage()
    ));
}

mysqli_close($conn);
?>