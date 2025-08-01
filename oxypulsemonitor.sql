-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Aug 01, 2025 at 08:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oxypulsemonitor`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `passwords` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `passwords`) VALUES
(1, 'admin', '$2a$12$DYzEqir7.PluGLuhx2ckkuWNg3bLUZHWvJTlNtYvRb3K9Zdin/iLS'),
(2, 'admin2', '$2a$12$Dum5UPP2svttWt1S0WGBXer.yECWwUIfaVAC/jhE//8bj08NHNYvC');

-- --------------------------------------------------------

--
-- Table structure for table `data_kesehatan`
--

CREATE TABLE `data_kesehatan` (
  `kesehatan_id` int(11) NOT NULL,
  `spo2` int(11) NOT NULL,
  `bpm` int(11) NOT NULL,
  `diagnosa` varchar(100) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `pasienid` int(11) NOT NULL,
  `catatan_dokter` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_kesehatan`
--

INSERT INTO `data_kesehatan` (`kesehatan_id`, `spo2`, `bpm`, `diagnosa`, `timestamp`, `pasienid`, `catatan_dokter`) VALUES
(1, 91, 97, 'Mild hypoxemia (low oxygen level)\r\nNormal heart rate', '2025-06-14 12:50:38', 1, 'kamu kurang sehat'),
(2, 98, 96, 'Normal oxygen level\r\nNormal heart rate', '2025-06-12 08:44:44', 1, ''),
(3, 98, 89, 'Normal oxygen level\r\nNormal heart rate', '2025-06-12 08:44:50', 1, ''),
(4, 100, 83, 'Normal oxygen level\r\nNormal heart rate', '2025-06-12 08:44:56', 1, ''),
(5, 99, 84, 'Normal oxygen level\r\nNormal heart rate', '2025-06-12 08:45:06', 1, ''),
(6, 97, 117, 'Normal oxygen level\r\nTachycardia (heart rate too fast)', '2025-06-12 08:46:07', 1, 'kamu butuh lebih banyak istirahat '),
(8, 95, 108, 'Normal oxygen level\r\nTachycardia (heart rate too fast)', '2025-06-12 08:46:12', 1, NULL),
(38, 96, 95, 'Normal oxygen level\nNormal heart rate', '2025-06-12 09:45:00', 15, NULL),
(39, 95, 98, 'Normal oxygen level\nNormal heart rate', '2025-06-12 09:45:46', 15, NULL),
(40, 96, 94, 'Normal oxygen level\nNormal heart rate', '2025-06-14 13:14:40', 1, NULL),
(41, 97, 93, 'Normal oxygen level\nNormal heart rate', '2025-06-14 13:15:28', 1, 'kamu sudah sehat'),
(42, 97, 95, 'Normal oxygen level\nNormal heart rate', '2025-06-15 11:25:50', 1, NULL),
(43, 98, 92, 'Normal oxygen level\nNormal heart rate', '2025-06-15 11:33:37', 1, NULL),
(44, 97, 98, 'Normal oxygen level\nNormal heart rate', '2025-06-15 11:34:47', 1, NULL),
(45, 97, 94, 'Normal oxygen level\nNormal heart rate', '2025-06-15 13:57:13', 1, NULL),
(46, 93, 101, 'Mild hypoxemia (low oxygen level)\nTachycardia (heart rate too fast)', '2025-07-30 06:31:27', 1, NULL),
(47, 96, 91, 'Normal oxygen level\nNormal heart rate', '2025-07-30 06:33:21', 1, NULL),
(48, 96, 96, 'Normal oxygen level\nNormal heart rate', '2025-07-30 07:27:58', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `device`
--

CREATE TABLE `device` (
  `device_id` int(11) NOT NULL,
  `used` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `device`
--

INSERT INTO `device` (`device_id`, `used`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 0),
(5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `dokter`
--

CREATE TABLE `dokter` (
  `dokter_id` int(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `passwords` varchar(255) NOT NULL,
  `notelepon` varchar(15) NOT NULL,
  `adminid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dokter`
--

INSERT INTO `dokter` (`dokter_id`, `nama`, `email`, `passwords`, `notelepon`, `adminid`) VALUES
(1, 'Adi Mulyadi', 'adimulyadi@gmail.com', '$2a$12$coZGtoaTol677jysv.vDweLhxY96b.DkTFHEAvl4z7FAD4VPsUs.W', '081591925017', 1),
(3, 'Tirta Mulya', 'tirtamulya@gmail.com', '$2y$10$jj3Dz8Ccryu4XX8xDTklTOCqXUiOzqFfnboCH8r.e.NqJh9XKPRhK', '088919291467', 1);

-- --------------------------------------------------------

--
-- Table structure for table `izin_pasien`
--

CREATE TABLE `izin_pasien` (
  `izin_pasien_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `dokterid` int(11) NOT NULL,
  `pasienid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `izin_pasien`
--

INSERT INTO `izin_pasien` (`izin_pasien_id`, `status`, `dokterid`, `pasienid`) VALUES
(1, 1, 1, 1),
(4, 2, 3, 5),
(5, 2, 1, 15);

-- --------------------------------------------------------

--
-- Table structure for table `pasien`
--

CREATE TABLE `pasien` (
  `pasien_id` int(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `passwords` varchar(255) NOT NULL,
  `notelepon` varchar(15) NOT NULL,
  `dateofbirth` date NOT NULL,
  `deviceid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pasien`
--

INSERT INTO `pasien` (`pasien_id`, `nama`, `email`, `passwords`, `notelepon`, `dateofbirth`, `deviceid`) VALUES
(1, 'Eko Purnomo', 'ekopurnomo@gmail.com', '$2a$12$RzWil.s8WojfEqITm9qqtOGfP3it2scaQCzzpAsesdMdjkfZwH9i.', '081991293129', '1999-05-12', 1),
(5, 'Udin', 'udinsaludin@gmail.com', '$2y$10$ICQjiXmAxFGWFOLPDHJIl.UeaybD1OZFwKMfJrvzPuBQ5TK3GUJ7.', '0811212197878', '2014-03-11', 3),
(15, 'pan', 'fanfadh.works@gmail.com', '$2y$10$nm7T4s7de7RN1pfpcYqztubYSmMNwUKH59hTZtqnQPYNZhHXzjZY6', '085374111543', '2004-06-02', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `data_kesehatan`
--
ALTER TABLE `data_kesehatan`
  ADD PRIMARY KEY (`kesehatan_id`),
  ADD KEY `foreignpasien` (`pasienid`);

--
-- Indexes for table `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`device_id`);

--
-- Indexes for table `dokter`
--
ALTER TABLE `dokter`
  ADD PRIMARY KEY (`dokter_id`),
  ADD KEY `foreignadmin` (`adminid`);

--
-- Indexes for table `izin_pasien`
--
ALTER TABLE `izin_pasien`
  ADD PRIMARY KEY (`izin_pasien_id`),
  ADD KEY `foreigndokters` (`dokterid`),
  ADD KEY `foreignpasiens` (`pasienid`);

--
-- Indexes for table `pasien`
--
ALTER TABLE `pasien`
  ADD PRIMARY KEY (`pasien_id`),
  ADD KEY `foreigndevice` (`deviceid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `data_kesehatan`
--
ALTER TABLE `data_kesehatan`
  MODIFY `kesehatan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `device`
--
ALTER TABLE `device`
  MODIFY `device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `dokter`
--
ALTER TABLE `dokter`
  MODIFY `dokter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `izin_pasien`
--
ALTER TABLE `izin_pasien`
  MODIFY `izin_pasien_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pasien`
--
ALTER TABLE `pasien`
  MODIFY `pasien_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `data_kesehatan`
--
ALTER TABLE `data_kesehatan`
  ADD CONSTRAINT `foreignpasien` FOREIGN KEY (`pasienid`) REFERENCES `pasien` (`pasien_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `dokter`
--
ALTER TABLE `dokter`
  ADD CONSTRAINT `foreignadmin` FOREIGN KEY (`adminid`) REFERENCES `admin` (`admin_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `izin_pasien`
--
ALTER TABLE `izin_pasien`
  ADD CONSTRAINT `foreigndokters` FOREIGN KEY (`dokterid`) REFERENCES `dokter` (`dokter_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `foreignpasiens` FOREIGN KEY (`pasienid`) REFERENCES `pasien` (`pasien_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `pasien`
--
ALTER TABLE `pasien`
  ADD CONSTRAINT `foreigndevice` FOREIGN KEY (`deviceid`) REFERENCES `device` (`device_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
