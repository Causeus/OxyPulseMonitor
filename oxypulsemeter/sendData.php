<?php
include 'db.php';

if (isset($_POST['device_id']) && isset($_POST['spo2']) && isset($_POST['bpm']) && isset($_POST['diagnosa'])) {
    $device_id = $_POST['device_id'];
    $spo2 = $_POST['spo2'];
    $bpm = $_POST['bpm'];
    $diagnosa = $_POST['diagnosa'];


    $sql_check_device = "SELECT pasien_id FROM pasien WHERE deviceid = '$device_id'";
    $result = $conn->query($sql_check_device);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $pasienid = $row['pasien_id'];

        $sql = "INSERT INTO data_kesehatan (spo2, bpm, diagnosa, pasienid)
                VALUES ('$spo2', '$bpm', '$diagnosa', '$pasienid')";

        if ($conn->query($sql) === TRUE) {
            echo "Data berhasil dikirim!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Device ID tidak ditemukan dalam pasien.";
    }
} else {
    echo "Data tidak lengkap, pastikan spo2, bpm, dan diagnosa terkirim.";
}

$conn->close();
?>
