-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2024 at 07:36 AM
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
-- Database: `projteach`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `admin_username` varchar(60) NOT NULL,
  `admin_password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_username`, `admin_password`) VALUES
(14, 'admin', '$2b$12$XON4BFUAyY7No7ls92wrwuNH9QFIABMLYPi4nYCySuefqT.tqLzJy'),
(15, 'qwert', '$2b$12$7dsZH5Rn9wFyvzoYYeTBDeQllvA55qKFPFkcRJfvshhH8Qk5FBN0.'),
(16, 'joshua', '$2b$12$oruItU4IX7gM3ToTDE/y6eCLXzSorcv5qgdpTK5mzMEyNElEqfkQ6');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `a_id` int(11) NOT NULL,
  `a_student_id` int(11) NOT NULL,
  `a_status` varchar(60) NOT NULL,
  `a_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`a_id`, `a_student_id`, `a_status`, `a_date`) VALUES
(18, 15, 'Present', '2024-11-07'),
(19, 15, 'Present', '2024-11-07'),
(20, 13, 'Present', '2024-11-07'),
(21, 11, 'Present', '2024-11-07'),
(22, 14, 'Present', '2024-11-07'),
(24, 15, 'Absent', '2024-11-07'),
(25, 14, 'Present', '2024-11-09'),
(26, 11, 'Present', '2024-11-17'),
(27, 13, 'Absent', '2024-11-18'),
(29, 11, 'Absent', '2024-11-19'),
(30, 13, 'Absent', '2024-11-19'),
(31, 14, 'Absent', '2024-11-19'),
(32, 15, 'Absent', '2024-11-19'),
(34, 16, 'Present', '2024-11-19'),
(35, 11, 'Present', '2024-11-28'),
(36, 13, 'Absent', '2024-11-28'),
(37, 16, 'Present', '2024-11-28'),
(39, 18, 'Present', '2024-12-05');

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `game_id` int(11) NOT NULL,
  `game_name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`game_id`, `game_name`) VALUES
(1, 'Sensory Game'),
(2, 'Matching Game'),
(3, 'Sequence Puzzle Game'),
(4, 'Interactive Sorting Game');

-- --------------------------------------------------------

--
-- Table structure for table `game_record`
--

CREATE TABLE `game_record` (
  `gr_id` int(11) NOT NULL,
  `gr_game_id` int(11) NOT NULL,
  `gr_user_id` int(11) NOT NULL,
  `gr_current_level` varchar(60) DEFAULT NULL,
  `gr_lvl1` varchar(60) DEFAULT NULL,
  `gr_lvl2` varchar(60) DEFAULT NULL,
  `gr_lvl3` varchar(60) DEFAULT NULL,
  `gr_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_record`
--

INSERT INTO `game_record` (`gr_id`, `gr_game_id`, `gr_user_id`, `gr_current_level`, `gr_lvl1`, `gr_lvl2`, `gr_lvl3`, `gr_date`) VALUES
(77, 1, 13, 'gr_lvl2', 'Excellent', 'Good', 'Good', '2024-11-07'),
(78, 3, 13, 'gr_lvl2', 'Excellent!', 'Good', 'Good', '2024-11-08'),
(79, 2, 15, 'Completed', 'Excellent', 'Good', 'Excellent', '2024-11-08'),
(81, 2, 11, 'gr_lvl2', 'Excellent', 'Good', 'Very Good', '2024-11-11'),
(82, 4, 11, 'gr_lvl2', 'Excellent', 'Very Good', 'Very Good', '2024-11-11'),
(83, 2, 11, 'Completed', 'Excellent', 'Excellent', 'Excellent', '2024-11-18'),
(84, 4, 11, 'gr_lvl2', 'Excellent', 'Good', 'Very Good', '2024-11-18'),
(85, 2, 15, 'gr_lvl2', 'Excellent', 'Excellent', 'Good', '2024-11-19'),
(86, 1, 16, 'Completed', 'Excellent', 'Excellent', 'Excellent', '2024-11-19'),
(87, 2, 13, 'Completed', 'Excellent', 'Excellent', 'Excellent', '2024-11-19'),
(88, 3, 16, 'Completed', 'Excellent!', 'Good', 'Excellent!', '2024-11-19'),
(89, 2, 16, 'gr_lvl2', 'Excellent', 'Very Good', 'Very Good', '2024-11-19'),
(91, 4, 11, 'gr_lvl3', 'Excellent', 'Excellent', NULL, '2024-11-19'),
(92, 4, 11, 'gr_lvl2', 'Very Good', 'Very Good', NULL, '2024-11-27'),
(94, 1, 11, 'gr_lvl3', 'Excellent', 'Excellent', NULL, '2024-11-28'),
(99, 1, 14, 'Completed', 'Excellent', 'Excellent', 'Excellent', '2024-12-05'),
(104, 2, 14, 'Completed', 'Excellent', 'Excellent', 'Excellent', '2024-12-05'),
(105, 3, 14, 'Completed', 'Excellent!', 'Excellent!', 'Excellent!', '2024-12-05'),
(107, 4, 14, 'gr_lvl2', 'Excellent', NULL, NULL, '2024-12-05'),
(109, 1, 11, 'Completed', 'Excellent', 'Excellent', 'Excellent', '2024-12-04'),
(110, 1, 11, 'Completed', 'Excellent', 'Excellent', 'Excellent', '2024-12-05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `type` varchar(10) NOT NULL,
  `account_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `age`, `gender`, `type`, `account_created`) VALUES
(11, 'joshua', 12, 'male', 'student', '2024-11-27 15:02:34'),
(13, 'Jane', 14, 'male', 'student', '2024-11-27 15:02:34'),
(14, 'April', 5, 'female', 'student', '2024-11-27 15:02:34'),
(15, 'Mariel', 12, 'male', 'student', '2024-11-27 15:02:34'),
(16, 'Juan', 12, 'male', 'student', '2024-11-27 15:02:34'),
(17, 'joan', 25, 'male', 'student', '2024-11-30 14:44:08'),
(18, 'denise', 12, 'male', 'student', '2024-12-05 06:15:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`a_id`),
  ADD KEY `a_student_id` (`a_student_id`);

--
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`game_id`);

--
-- Indexes for table `game_record`
--
ALTER TABLE `game_record`
  ADD PRIMARY KEY (`gr_id`),
  ADD KEY `game_record_ibfk_1` (`gr_user_id`),
  ADD KEY `game_record_ibfk_2` (`gr_game_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `a_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `game_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `game_record`
--
ALTER TABLE `game_record`
  MODIFY `gr_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`a_student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `game_record`
--
ALTER TABLE `game_record`
  ADD CONSTRAINT `game_record_ibfk_1` FOREIGN KEY (`gr_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `game_record_ibfk_2` FOREIGN KEY (`gr_game_id`) REFERENCES `game` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
