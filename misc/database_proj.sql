-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2021 at 04:14 AM
-- Server version: 8.0.23
-- PHP Version: 7.3.24-(to be removed in future macOS)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `database_proj`
--

-- --------------------------------------------------------

--
-- Table structure for table `adonis_schema`
--

CREATE TABLE `adonis_schema` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `batch` int NOT NULL,
  `migration_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `adonis_schema`
--

INSERT INTO `adonis_schema` (`id`, `name`, `batch`) VALUES
(1, 'database/migrations/1619749855797_create_users_tables', 1),
(2, 'database/migrations/1619750376610_create_customers_tables', 1),
(3, 'database/migrations/1619750604630_create_staff_tables', 1),
(4, 'database/migrations/1619750776239_create_booking_agent_tables', 1),
(5, 'database/migrations/1619750926921_create_phone_number_tables', 1),
(6, 'database/migrations/1619751108155_create_ticket_tables', 1),
(7, 'database/migrations/1619751821600_create_airline_tables', 1),
(8, 'database/migrations/1619751902664_create_airplane_tables', 1),
(9, 'database/migrations/1619752060242_create_airport_tables', 1),
(10, 'database/migrations/1619752060245_create_flight_tables', 1),
(11, 'database/migrations/1619752060246_create_purchase_tables', 1),
(12, 'database/migrations/1619753410290_create_uses_tables', 1),
(13, 'database/migrations/1619754269283_create_works_for_tables', 1),
(14, 'database/migrations/1619754628367_create_has_tables', 1),
(15, 'database/migrations/1619754746528_create_flight_rating_tables', 1),
(16, 'database/migrations/1619837742911_agent_purchases', 1),
(17, 'database/migrations/1619837749797_product_purchases', 1),
(18, 'database/migrations/1619837765651_purchase_sources', 1),
(19, 'database/migrations/1792489784670_api_tokens', 1);

-- --------------------------------------------------------

--
-- Table structure for table `AgentPurchases`
--

CREATE TABLE `AgentPurchases` (
  `id` int UNSIGNED NOT NULL,
  `commission` int DEFAULT NULL,
  `purchase_id` int UNSIGNED NOT NULL,
  `ba_agent_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `AgentPurchases`
--

INSERT INTO `AgentPurchases` (`id`, `commission`, `purchase_id`, `ba_agent_id`) VALUES
(1, 20, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Airlines`
--

CREATE TABLE `Airlines` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Airlines`
--

INSERT INTO `Airlines` (`name`) VALUES
('China%20Eastern'),
('Delta'),
('United%20Airlines');

-- --------------------------------------------------------

--
-- Table structure for table `Airplanes`
--

CREATE TABLE `Airplanes` (
  `id` int UNSIGNED NOT NULL,
  `owned_by` varchar(255) DEFAULT NULL,
  `seats` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Airplanes`
--

INSERT INTO `Airplanes` (`id`, `owned_by`, `seats`) VALUES
(1, 'United%20Airlines', 70),
(2, 'United%20Airlines', 3),
(3, 'United%20Airlines', 3),
(4, 'United%20Airlines', 50),
(5, 'United%20Airlines', 75);

-- --------------------------------------------------------

--
-- Table structure for table `Airports`
--

CREATE TABLE `Airports` (
  `name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Airports`
--

INSERT INTO `Airports` (`name`, `city`) VALUES
('JFK', 'NYC'),
('PVG', 'Shanghai');

-- --------------------------------------------------------

--
-- Table structure for table `api_tokens`
--

CREATE TABLE `api_tokens` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `api_tokens`
--

INSERT INTO `api_tokens` (`id`, `user_id`, `name`, `type`, `token`, `expires_at`, `created_at`) VALUES
(1, 1, 'Opaque Access Token', 'opaque_token', '52ad310925e642b746552edf134c8f0818014fc7c760e46be52be0d5e27119a8', NULL, '2021-05-06 12:58:42'),
(2, 1, 'Opaque Access Token', 'opaque_token', '14d8cd05379152bc034c4afd5f7d6f7dc529f1036ce1414ee0bdd2b4b27918f8', NULL, '2021-05-06 12:58:42'),
(4, 2, 'Opaque Access Token', 'opaque_token', '6f059043e3f07814ea90bedb399336286c0662211d5efbc83c9ff3cbca473bc2', NULL, '2021-05-06 13:05:57'),
(5, 2, 'Opaque Access Token', 'opaque_token', '97ce4225c39cd1e62b6691a21be2b10790f22b2d33bd35d15a8700f85bb35b66', NULL, '2021-05-06 13:05:57'),
(6, 3, 'Opaque Access Token', 'opaque_token', '0deef28cd5dd69b0345de0fe597a7b3c4cf6838bf5c3442929ec5ac7f41b4c4a', NULL, '2021-05-06 13:06:08'),
(7, 3, 'Opaque Access Token', 'opaque_token', '75f0aaca451538c74add327f9dbdf8e2178dd36d2233d2122fd50aa0bd450cc9', NULL, '2021-05-06 13:06:08'),
(8, 3, 'Opaque Access Token', 'opaque_token', '6ca9aa71ec81e621de4c6d87e8ec22cecace8d7145e76e1009572b47c84c5a0d', NULL, '2021-05-06 13:06:17'),
(14, 4, 'Opaque Access Token', 'opaque_token', 'cdaa447835a97a0eb6b7cdfcbdf8499024c7e8a192ddf3d504bd3d25974c13ac', NULL, '2021-05-06 15:08:10'),
(15, 4, 'Opaque Access Token', 'opaque_token', '032d5cc60548b03edf129f5e8ed7c64bca553340ef779807b73ba335b300efe9', NULL, '2021-05-06 15:08:10'),
(18, 5, 'Opaque Access Token', 'opaque_token', '32d43f3585f4be31087c26e641b103f9e2e58e035461695c5c7d3202ca4b9a95', NULL, '2021-05-06 15:09:45'),
(19, 5, 'Opaque Access Token', 'opaque_token', '8ffcbffa7b870521c9987cd93546afe17523fb766a522c917d57e82dd041bb18', NULL, '2021-05-06 15:09:45'),
(20, 6, 'Opaque Access Token', 'opaque_token', '0b9c83dc5f169c7d609bc88b9fda8bfa282c22add5e1bce14ca4c37c5932b8c6', NULL, '2021-05-06 15:09:54'),
(21, 6, 'Opaque Access Token', 'opaque_token', 'd87a0b526a0e9b16292a5293c9ed862ccc1bcca44d9236bc7355f7bb7a95cff3', NULL, '2021-05-06 15:09:54'),
(22, 7, 'Opaque Access Token', 'opaque_token', '750b2d18de27940631b7d099ea4cc868966d8db0db6b8846bb63d43e7673260e', NULL, '2021-05-06 15:10:05'),
(23, 7, 'Opaque Access Token', 'opaque_token', '1716eefc9003d60abd0c262c19c04c5ee681dbdc1c3d07c62e930e4188c507a3', NULL, '2021-05-06 15:10:05'),
(24, 8, 'Opaque Access Token', 'opaque_token', '7e19591b2c0ad1c6b60c85a18345ccc6517211fa1388c4410bb4f05000a38f2b', NULL, '2021-05-06 15:10:15'),
(25, 8, 'Opaque Access Token', 'opaque_token', '6c38508bcf9fe7185e3ff6fe1b97f5c225e1bc4ac265a33a3348a374fd51764c', NULL, '2021-05-06 15:10:15'),
(30, 1, 'Opaque Access Token', 'opaque_token', '5c57b42e5170122429c0ec7ea68c5b5e1fa882060166222be3e2fec9ea033a5c', NULL, '2021-05-06 15:14:30'),
(31, 1, 'Opaque Access Token', 'opaque_token', '508fb62e7f4ba5f82457f484138eaf6e5472eb872436806d889074096e13060b', NULL, '2021-05-06 19:52:12'),
(32, 1, 'Opaque Access Token', 'opaque_token', 'f1eeddde0efb9c4673db70f4d828ded644b81f5619f65c53d4afea6a70a1ae4d', NULL, '2021-05-06 20:23:37'),
(33, 1, 'Opaque Access Token', 'opaque_token', 'b02d8ec414a9e8a264249bd073df0ca2099d9f35685267a29c4477c2c28c53b8', NULL, '2021-05-06 20:24:33'),
(34, 1, 'Opaque Access Token', 'opaque_token', '561e95afcfc6ee5bc2c7446044d391c34d0c006ff3ec9f049efba8af15439410', NULL, '2021-05-06 20:27:48'),
(35, 1, 'Opaque Access Token', 'opaque_token', 'e48f30b1934ed52d938d10a0b67de990b111de94affaf08953caa986f7546464', NULL, '2021-05-06 21:56:13'),
(36, 1, 'Opaque Access Token', 'opaque_token', '27a9e54a2fc58fee5e380f9bc3773462a96fd3cbbdb4ad712bbdad1f6922b4a2', NULL, '2021-05-07 04:40:06'),
(37, 1, 'Opaque Access Token', 'opaque_token', 'b138115c4adc374325b4d75aed724b51a98d7e55a1a14771355de6f6812cf619', NULL, '2021-05-07 06:18:11'),
(38, 1, 'Opaque Access Token', 'opaque_token', '6a902195e8aafacf48eb2d701ae15b6bba69ca559a013b2b3abb61601b2e5c86', NULL, '2021-05-07 10:01:09'),
(39, 1, 'Opaque Access Token', 'opaque_token', 'e029934d133d496e333cc4235a3753164670840228e5db78fcffed13088b988c', NULL, '2021-05-07 10:11:56'),
(40, 1, 'Opaque Access Token', 'opaque_token', '85ec042c02c2264f8103cb526ab7d42b35eb7666e08992ddc815ac4381d5e9e5', NULL, '2021-05-07 10:18:43'),
(41, 1, 'Opaque Access Token', 'opaque_token', '4e0a42cdac61ec4caeb8450a75af0d70ff7bea3b136dc9864c343f1a8d90a3ea', NULL, '2021-05-07 10:53:27'),
(42, 1, 'Opaque Access Token', 'opaque_token', '64e5f1bb06216917b02663da3791aa426a01832f8f3cc3c89b0317243f6dd36d', NULL, '2021-05-07 11:06:08'),
(44, 2, 'Opaque Access Token', 'opaque_token', 'bf801e4a41b53a15b2a0a663b74b745220155073a349a2c8613958ff11c2ee98', NULL, '2021-05-08 00:39:01'),
(45, 2, 'Opaque Access Token', 'opaque_token', 'f33f813a5b753edfea562b4843f636bc536054f34dffbdb91907c474af888e67', NULL, '2021-05-08 00:42:30'),
(47, 3, 'Opaque Access Token', 'opaque_token', '720f170ba7489bad84befd69e270fa83cf65152fd9c447a24e407936b2682ed1', NULL, '2021-05-08 03:26:23'),
(48, 3, 'Opaque Access Token', 'opaque_token', '72503c498929f7530842102829cab2fa74d6bdd4028d914363a25235aa235bc0', NULL, '2021-05-08 04:02:43');

-- --------------------------------------------------------

--
-- Table structure for table `BookingAgents`
--

CREATE TABLE `BookingAgents` (
  `user_email` varchar(255) NOT NULL,
  `agent_id` int DEFAULT NULL,
  `commission` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `BookingAgents`
--

INSERT INTO `BookingAgents` (`user_email`, `agent_id`, `commission`) VALUES
('riceagent1@gmail.com', 1, 20);

-- --------------------------------------------------------

--
-- Table structure for table `Customers`
--

CREATE TABLE `Customers` (
  `user_email` varchar(255) NOT NULL,
  `building_num` int DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `passport_exp_date` date DEFAULT NULL,
  `passport_num` int DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Customers`
--

INSERT INTO `Customers` (`user_email`, `building_num`, `street`, `city`, `passport_exp_date`, `passport_num`, `dob`) VALUES
('ricecustomer1@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL),
('ricecustomer2@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL),
('ricecustomer3@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL),
('ricecustomer4@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL),
('ricecustomer5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL),
('ricecustomer6@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `FlightRatings`
--

CREATE TABLE `FlightRatings` (
  `id` int UNSIGNED NOT NULL,
  `flight_id` int UNSIGNED NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `FlightRatings`
--

INSERT INTO `FlightRatings` (`id`, `flight_id`, `customer_email`, `rating`, `comment`) VALUES
(1, 1, 'ricecustomer1@gmail.com', 5, 'It was alright. Flying spirits is always risky');

-- --------------------------------------------------------

--
-- Table structure for table `Flights`
--

CREATE TABLE `Flights` (
  `id` int UNSIGNED NOT NULL,
  `flight_num` int NOT NULL,
  `depart_date_time` datetime NOT NULL,
  `arrival_date_time` datetime DEFAULT NULL,
  `base_price` int UNSIGNED DEFAULT NULL,
  `arrival_airport` varchar(255) DEFAULT NULL,
  `departure_airport` varchar(255) NOT NULL,
  `owned_by` varchar(255) NOT NULL,
  `status` int UNSIGNED NOT NULL DEFAULT '1',
  `type` int UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Flights`
--

INSERT INTO `Flights` (`id`, `flight_num`, `depart_date_time`, `arrival_date_time`, `base_price`, `arrival_airport`, `departure_airport`, `owned_by`, `status`, `type`) VALUES
(1, 1, '2021-06-04 08:59:00', NULL, 200, NULL, 'JFK', 'United%20Airlines', 1, 1),
(2, 2, '2021-05-06 10:01:00', '2021-06-05 09:06:00', 300, 'JFK', 'PVG', 'United%20Airlines', 1, 1),
(3, 2, '2021-05-07 09:02:00', '2021-06-05 02:03:00', 300, 'PVG', 'JFK', 'United%20Airlines', 1, 1),
(4, 2, '2021-05-29 09:04:00', NULL, 3000, 'PVG', 'JFK', 'United%20Airlines', 1, 1),
(8, 3, '2021-05-29 09:04:00', NULL, 3500, 'PVG', 'JFK', 'United%20Airlines', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Has`
--

CREATE TABLE `Has` (
  `id` int UNSIGNED NOT NULL,
  `flight_id` int UNSIGNED NOT NULL,
  `ticket_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Has`
--

INSERT INTO `Has` (`id`, `flight_id`, `ticket_id`) VALUES
(1, 1, 1),
(2, 8, 2),
(3, 8, 3),
(4, 8, 4),
(5, 8, 5),
(6, 1, 6),
(7, 1, 7),
(8, 1, 8),
(9, 1, 9),
(10, 1, 10),
(11, 1, 11),
(12, 1, 12),
(13, 1, 13),
(14, 1, 14),
(15, 1, 15),
(16, 1, 16),
(17, 8, 17),
(18, 8, 18),
(19, 8, 19),
(20, 8, 20),
(21, 8, 21),
(22, 8, 22),
(23, 8, 23),
(24, 8, 24),
(25, 8, 25),
(26, 1, 26),
(27, 1, 27);

-- --------------------------------------------------------

--
-- Table structure for table `PhoneNumbers`
--

CREATE TABLE `PhoneNumbers` (
  `user_email` varchar(255) NOT NULL,
  `phone_number` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ProductPurchases`
--

CREATE TABLE `ProductPurchases` (
  `id` int UNSIGNED NOT NULL,
  `purchase_id` int UNSIGNED NOT NULL,
  `ticket_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ProductPurchases`
--

INSERT INTO `ProductPurchases` (`id`, `purchase_id`, `ticket_id`) VALUES
(1, 2, 1),
(2, 3, 2),
(3, 4, 3),
(4, 5, 4),
(5, 6, 5),
(6, 7, 6),
(7, 8, 7),
(8, 9, 8),
(9, 10, 9),
(10, 11, 10),
(11, 12, 11),
(12, 13, 12),
(13, 14, 13),
(14, 15, 14),
(15, 16, 15),
(16, 17, 16),
(17, 18, 17),
(18, 19, 18),
(19, 20, 19),
(20, 21, 20),
(21, 22, 21),
(22, 23, 22),
(23, 24, 23),
(24, 25, 24),
(25, 26, 25),
(26, 27, 26),
(27, 28, 27);

-- --------------------------------------------------------

--
-- Table structure for table `Purchases`
--

CREATE TABLE `Purchases` (
  `id` int UNSIGNED NOT NULL,
  `price` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `flight_num` int UNSIGNED NOT NULL,
  `credit_card_num` varchar(16) NOT NULL,
  `credit_card_exp_date` date NOT NULL,
  `status` int UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Purchases`
--

INSERT INTO `Purchases` (`id`, `price`, `created_at`, `updated_at`, `flight_num`, `credit_card_num`, `credit_card_exp_date`, `status`) VALUES
(1, 200, '2021-05-06 13:19:33', NULL, 1, '1234533333', '2021-05-19', 2),
(2, 200, '2021-05-06 13:22:13', NULL, 1, '1234533333', '2021-05-19', 1),
(3, 3500, '2021-05-06 15:08:48', NULL, 8, '1234533333', '2021-05-27', 1),
(4, 3500, '2021-05-06 15:08:49', NULL, 8, '1234533333', '2021-05-27', 1),
(5, 3500, '2021-05-06 15:08:50', NULL, 8, '1234533333', '2021-05-27', 1),
(6, 3500, '2021-05-06 15:08:52', NULL, 8, '1234533333', '2021-05-27', 1),
(7, 200, '2021-05-06 15:10:37', NULL, 1, '1234533333', '2021-05-19', 1),
(8, 200, '2021-05-06 15:10:39', NULL, 1, '1234533333', '2021-05-19', 1),
(9, 200, '2021-05-06 15:10:40', NULL, 1, '1234533333', '2021-05-19', 1),
(10, 200, '2021-05-06 15:10:41', NULL, 1, '1234533333', '2021-05-19', 1),
(11, 200, '2021-05-06 15:10:43', NULL, 1, '1234533333', '2021-05-19', 1),
(12, 200, '2021-05-06 15:11:04', NULL, 1, '2333456323', '2021-06-01', 1),
(13, 200, '2021-05-06 15:11:05', NULL, 1, '2333456323', '2021-06-01', 1),
(14, 200, '2021-05-06 15:11:06', NULL, 1, '2333456323', '2021-06-01', 1),
(15, 200, '2021-05-06 15:11:08', NULL, 1, '2333456323', '2021-06-01', 1),
(16, 200, '2021-05-06 15:11:09', NULL, 1, '2333456323', '2021-06-01', 1),
(17, 200, '2021-05-06 15:11:11', NULL, 1, '2333456323', '2021-06-01', 1),
(18, 3500, '2021-05-06 15:12:08', NULL, 8, '1123334543', '2021-06-02', 1),
(19, 3500, '2021-05-06 15:12:10', NULL, 8, '1123334543', '2021-06-02', 1),
(20, 3500, '2021-05-06 15:12:11', NULL, 8, '1123334543', '2021-06-02', 1),
(21, 3500, '2021-05-06 15:13:49', NULL, 8, '1123334543', '2021-05-26', 1),
(22, 3500, '2021-05-06 15:13:50', NULL, 8, '1123334543', '2021-05-26', 1),
(23, 3500, '2021-05-06 15:13:51', NULL, 8, '1123334543', '2021-05-26', 1),
(24, 3500, '2021-05-06 15:13:53', NULL, 8, '1123334543', '2021-05-26', 1),
(25, 3500, '2021-05-06 15:13:54', NULL, 8, '1123334543', '2021-05-26', 1),
(26, 3500, '2021-05-06 15:13:55', NULL, 8, '1123334543', '2021-05-26', 1),
(27, 200, '2021-05-06 15:14:22', NULL, 1, '2343343565', '2021-05-26', 1),
(28, 200, '2019-05-06 15:14:24', NULL, 1, '2343343565', '2021-05-26', 1);

-- --------------------------------------------------------

--
-- Table structure for table `PurchaseSources`
--

CREATE TABLE `PurchaseSources` (
  `id` int UNSIGNED NOT NULL,
  `purchaser_email` varchar(255) DEFAULT NULL,
  `type` int UNSIGNED NOT NULL DEFAULT '1',
  `flight_id` int UNSIGNED NOT NULL,
  `purchase_id` int UNSIGNED NOT NULL,
  `purchased_for` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `PurchaseSources`
--

INSERT INTO `PurchaseSources` (`id`, `purchaser_email`, `type`, `flight_id`, `purchase_id`, `purchased_for`) VALUES
(1, 'ricecustomer1@gmail.com', 2, 1, 1, 1),
(2, 'riceagent1@gmail.com', 1, 1, 2, 1),
(3, 'ricecustomer2@gmail.com', 1, 8, 3, 3),
(4, 'ricecustomer2@gmail.com', 1, 8, 4, 4),
(5, 'ricecustomer2@gmail.com', 1, 8, 5, 5),
(6, 'ricecustomer2@gmail.com', 1, 8, 6, 6),
(7, 'ricecustomer3@gmail.com', 1, 1, 7, 7),
(8, 'ricecustomer3@gmail.com', 1, 1, 8, 8),
(9, 'ricecustomer3@gmail.com', 1, 1, 9, 9),
(10, 'ricecustomer3@gmail.com', 1, 1, 10, 10),
(11, 'ricecustomer3@gmail.com', 1, 1, 11, 11),
(12, 'ricecustomer4@gmail.com', 1, 1, 12, 12),
(13, 'ricecustomer4@gmail.com', 1, 1, 13, 13),
(14, 'ricecustomer4@gmail.com', 1, 1, 14, 14),
(15, 'ricecustomer4@gmail.com', 1, 1, 15, 15),
(16, 'ricecustomer4@gmail.com', 1, 1, 16, 16),
(17, 'ricecustomer4@gmail.com', 1, 1, 17, 17),
(18, 'ricecustomer5@gmail.com', 1, 8, 18, 18),
(19, 'ricecustomer5@gmail.com', 1, 8, 19, 19),
(20, 'ricecustomer5@gmail.com', 1, 8, 20, 20),
(21, 'ricecustomer5@gmail.com', 1, 8, 21, 21),
(22, 'ricecustomer5@gmail.com', 1, 8, 22, 22),
(23, 'ricecustomer5@gmail.com', 1, 8, 23, 23),
(24, 'ricecustomer5@gmail.com', 1, 8, 24, 24),
(25, 'ricecustomer5@gmail.com', 1, 8, 25, 25),
(26, 'ricecustomer5@gmail.com', 1, 8, 26, 26),
(27, 'ricecustomer6@gmail.com', 1, 1, 27, 27),
(28, 'ricecustomer6@gmail.com', 1, 1, 28, 28);

-- --------------------------------------------------------

--
-- Table structure for table `Staff`
--

CREATE TABLE `Staff` (
  `user_email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Staff`
--

INSERT INTO `Staff` (`user_email`, `username`) VALUES
('riceboy3@gmail.com', 'RiceGod1');

-- --------------------------------------------------------

--
-- Table structure for table `Tickets`
--

CREATE TABLE `Tickets` (
  `id` int UNSIGNED NOT NULL,
  `base_price` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Tickets`
--

INSERT INTO `Tickets` (`id`, `base_price`) VALUES
(1, 200),
(2, 3500),
(3, 3500),
(4, 3500),
(5, 3500),
(6, 200),
(7, 200),
(8, 200),
(9, 200),
(10, 200),
(11, 200),
(12, 200),
(13, 200),
(14, 200),
(15, 200),
(16, 200),
(17, 3500),
(18, 3500),
(19, 3500),
(20, 3500),
(21, 3500),
(22, 3500),
(23, 3500),
(24, 3500),
(25, 3500),
(26, 200),
(27, 200);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` int UNSIGNED NOT NULL DEFAULT '1',
  `remember_me_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `email`, `password`, `type`, `remember_me_token`, `created_at`, `updated_at`) VALUES
(1, 'riceboy3@gmail.com', '$argon2id$v=19$t=3,m=4096,p=1$ooFznwn7uvpU23DyNb+Dtw$EqJfB7vOGqDdh2s+7NLqzZtwcgJU0MVX1AsGl/frv1A', 3, NULL, '2021-05-06 12:58:42', '2021-05-06 12:58:42'),
(2, 'riceagent1@gmail.com', '$argon2id$v=19$t=3,m=4096,p=1$v9o+jBoADl3sxLIjo55lDw$+G4p/vrXKoQcfRCZM1K89eZAxHwALT81j4kr40qbtZg', 2, NULL, '2021-05-06 13:05:57', '2021-05-06 13:05:57'),
(3, 'ricecustomer1@gmail.com', '$argon2id$v=19$t=3,m=4096,p=1$xthgM7H2NenhuGKn3RFEJw$IqAtFbGjOpd0D/O81JcMZp0xE98rWVcNFB2voz34+2o', 1, NULL, '2021-05-06 13:06:08', '2021-05-06 13:06:08'),
(4, 'ricecustomer2@gmail.com', '$argon2id$v=19$t=3,m=4096,p=1$GrsNKts6pgoGhA5L/zx2Cw$coSnN7Ze4VXS+ScuNGMiGU9jUJKxL5d8KRzpFYQXXGI', 1, NULL, '2021-05-06 15:08:10', '2021-05-06 15:08:10'),
(5, 'ricecustomer3@gmail.com', '$argon2id$v=19$t=3,m=4096,p=1$enr39qfOoghkztG02nQM0g$ODe90v6gd/tI09x13odxGhecoiASugJ1ejh3m6tB/Rk', 1, NULL, '2021-05-06 15:09:45', '2021-05-06 15:09:45'),
(6, 'ricecustomer4@gmail.com', '$argon2id$v=19$t=3,m=4096,p=1$JpJBUteGplWRUhUFZ4V8RQ$qmpZc7uM86rLXmGrD9FzPImwa1TJwET9idH2+WaDf1w', 1, NULL, '2021-05-06 15:09:54', '2021-05-06 15:09:54'),
(7, 'ricecustomer5@gmail.com', '$argon2id$v=19$t=3,m=4096,p=1$rsId1LcLw25JBh73qOYivA$5j2hyV6QjTdPnU8SBgNSDyyWBG8zAcX1DqG299y04j4', 1, NULL, '2021-05-06 15:10:05', '2021-05-06 15:10:05'),
(8, 'ricecustomer6@gmail.com', '$argon2id$v=19$t=3,m=4096,p=1$ZALQzJK+caGcI20CQTziew$+L+SIJOkuEb5TfzwsRKkKe+iBhk1L6fnj45+Ufgt4Ho', 1, NULL, '2021-05-06 15:10:15', '2021-05-06 15:10:15');

-- --------------------------------------------------------

--
-- Table structure for table `Uses`
--

CREATE TABLE `Uses` (
  `id` int UNSIGNED NOT NULL,
  `airplane_id` int UNSIGNED NOT NULL,
  `airline_name` varchar(255) NOT NULL,
  `flight_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Uses`
--

INSERT INTO `Uses` (`id`, `airplane_id`, `airline_name`, `flight_id`) VALUES
(1, 1, 'United%20Airlines', 1),
(2, 2, 'United%20Airlines', 2),
(3, 3, 'United%20Airlines', 3),
(4, 4, 'United%20Airlines', 4),
(5, 4, 'United%20Airlines', 8);

-- --------------------------------------------------------

--
-- Table structure for table `WorksFor`
--

CREATE TABLE `WorksFor` (
  `id` int UNSIGNED NOT NULL,
  `airline_name` varchar(255) NOT NULL,
  `staff_email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `WorksFor`
--

INSERT INTO `WorksFor` (`id`, `airline_name`, `staff_email`) VALUES
(1, 'United%20Airlines', 'riceboy3@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `AgentPurchases`
--
ALTER TABLE `AgentPurchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agentpurchases_purchase_id_foreign` (`purchase_id`),
  ADD KEY `agentpurchases_ba_agent_id_foreign` (`ba_agent_id`);

--
-- Indexes for table `Airlines`
--
ALTER TABLE `Airlines`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `Airplanes`
--
ALTER TABLE `Airplanes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `airplanes_owned_by_foreign` (`owned_by`);

--
-- Indexes for table `Airports`
--
ALTER TABLE `Airports`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_tokens_user_id_foreign` (`user_id`);

--
-- Indexes for table `BookingAgents`
--
ALTER TABLE `BookingAgents`
  ADD PRIMARY KEY (`user_email`),
  ADD UNIQUE KEY `bookingagents_agent_id_unique` (`agent_id`);

--
-- Indexes for table `Customers`
--
ALTER TABLE `Customers`
  ADD PRIMARY KEY (`user_email`);

--
-- Indexes for table `FlightRatings`
--
ALTER TABLE `FlightRatings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `flightratings_flight_id_foreign` (`flight_id`),
  ADD KEY `flightratings_customer_email_foreign` (`customer_email`);

--
-- Indexes for table `Flights`
--
ALTER TABLE `Flights`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `flights_flight_num_depart_date_time_unique` (`flight_num`,`depart_date_time`),
  ADD KEY `flights_arrival_airport_foreign` (`arrival_airport`),
  ADD KEY `flights_departure_airport_foreign` (`departure_airport`),
  ADD KEY `flights_owned_by_foreign` (`owned_by`);

--
-- Indexes for table `Has`
--
ALTER TABLE `Has`
  ADD PRIMARY KEY (`id`),
  ADD KEY `has_flight_id_foreign` (`flight_id`),
  ADD KEY `has_ticket_id_foreign` (`ticket_id`);

--
-- Indexes for table `PhoneNumbers`
--
ALTER TABLE `PhoneNumbers`
  ADD PRIMARY KEY (`user_email`);

--
-- Indexes for table `ProductPurchases`
--
ALTER TABLE `ProductPurchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productpurchases_purchase_id_foreign` (`purchase_id`),
  ADD KEY `productpurchases_ticket_id_foreign` (`ticket_id`);

--
-- Indexes for table `Purchases`
--
ALTER TABLE `Purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchases_flight_num_foreign` (`flight_num`);

--
-- Indexes for table `PurchaseSources`
--
ALTER TABLE `PurchaseSources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchasesources_purchaser_email_foreign` (`purchaser_email`),
  ADD KEY `purchasesources_flight_id_foreign` (`flight_id`),
  ADD KEY `purchasesources_purchase_id_foreign` (`purchase_id`),
  ADD KEY `purchasesources_purchased_for_foreign` (`purchased_for`);

--
-- Indexes for table `Staff`
--
ALTER TABLE `Staff`
  ADD PRIMARY KEY (`user_email`),
  ADD UNIQUE KEY `staff_username_unique` (`username`);

--
-- Indexes for table `Tickets`
--
ALTER TABLE `Tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `Uses`
--
ALTER TABLE `Uses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uses_airplane_id_foreign` (`airplane_id`),
  ADD KEY `uses_airline_name_foreign` (`airline_name`),
  ADD KEY `uses_flight_id_foreign` (`flight_id`);

--
-- Indexes for table `WorksFor`
--
ALTER TABLE `WorksFor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `worksfor_airline_name_foreign` (`airline_name`),
  ADD KEY `worksfor_staff_email_foreign` (`staff_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `AgentPurchases`
--
ALTER TABLE `AgentPurchases`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Airplanes`
--
ALTER TABLE `Airplanes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `api_tokens`
--
ALTER TABLE `api_tokens`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `FlightRatings`
--
ALTER TABLE `FlightRatings`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Flights`
--
ALTER TABLE `Flights`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Has`
--
ALTER TABLE `Has`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `ProductPurchases`
--
ALTER TABLE `ProductPurchases`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `Purchases`
--
ALTER TABLE `Purchases`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `PurchaseSources`
--
ALTER TABLE `PurchaseSources`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `Tickets`
--
ALTER TABLE `Tickets`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Uses`
--
ALTER TABLE `Uses`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `WorksFor`
--
ALTER TABLE `WorksFor`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `AgentPurchases`
--
ALTER TABLE `AgentPurchases`
  ADD CONSTRAINT `agentpurchases_ba_agent_id_foreign` FOREIGN KEY (`ba_agent_id`) REFERENCES `BookingAgents` (`agent_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `agentpurchases_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `Purchases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Airplanes`
--
ALTER TABLE `Airplanes`
  ADD CONSTRAINT `airplanes_owned_by_foreign` FOREIGN KEY (`owned_by`) REFERENCES `Airlines` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD CONSTRAINT `api_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `BookingAgents`
--
ALTER TABLE `BookingAgents`
  ADD CONSTRAINT `bookingagents_user_email_foreign` FOREIGN KEY (`user_email`) REFERENCES `Users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Customers`
--
ALTER TABLE `Customers`
  ADD CONSTRAINT `customers_user_email_foreign` FOREIGN KEY (`user_email`) REFERENCES `Users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `FlightRatings`
--
ALTER TABLE `FlightRatings`
  ADD CONSTRAINT `flightratings_customer_email_foreign` FOREIGN KEY (`customer_email`) REFERENCES `Customers` (`user_email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightratings_flight_id_foreign` FOREIGN KEY (`flight_id`) REFERENCES `Flights` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Flights`
--
ALTER TABLE `Flights`
  ADD CONSTRAINT `flights_arrival_airport_foreign` FOREIGN KEY (`arrival_airport`) REFERENCES `Airports` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flights_departure_airport_foreign` FOREIGN KEY (`departure_airport`) REFERENCES `Airports` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flights_owned_by_foreign` FOREIGN KEY (`owned_by`) REFERENCES `Airlines` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Has`
--
ALTER TABLE `Has`
  ADD CONSTRAINT `has_flight_id_foreign` FOREIGN KEY (`flight_id`) REFERENCES `Flights` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `has_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `Tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PhoneNumbers`
--
ALTER TABLE `PhoneNumbers`
  ADD CONSTRAINT `phonenumbers_user_email_foreign` FOREIGN KEY (`user_email`) REFERENCES `Users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ProductPurchases`
--
ALTER TABLE `ProductPurchases`
  ADD CONSTRAINT `productpurchases_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `Purchases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productpurchases_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `Tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Purchases`
--
ALTER TABLE `Purchases`
  ADD CONSTRAINT `purchases_flight_num_foreign` FOREIGN KEY (`flight_num`) REFERENCES `Flights` (`id`);

--
-- Constraints for table `PurchaseSources`
--
ALTER TABLE `PurchaseSources`
  ADD CONSTRAINT `purchasesources_flight_id_foreign` FOREIGN KEY (`flight_id`) REFERENCES `Flights` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchasesources_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `Purchases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchasesources_purchased_for_foreign` FOREIGN KEY (`purchased_for`) REFERENCES `Purchases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchasesources_purchaser_email_foreign` FOREIGN KEY (`purchaser_email`) REFERENCES `Users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Staff`
--
ALTER TABLE `Staff`
  ADD CONSTRAINT `staff_user_email_foreign` FOREIGN KEY (`user_email`) REFERENCES `Users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Uses`
--
ALTER TABLE `Uses`
  ADD CONSTRAINT `uses_airline_name_foreign` FOREIGN KEY (`airline_name`) REFERENCES `Airplanes` (`owned_by`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `uses_airplane_id_foreign` FOREIGN KEY (`airplane_id`) REFERENCES `Airplanes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `uses_flight_id_foreign` FOREIGN KEY (`flight_id`) REFERENCES `Flights` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `WorksFor`
--
ALTER TABLE `WorksFor`
  ADD CONSTRAINT `worksfor_airline_name_foreign` FOREIGN KEY (`airline_name`) REFERENCES `Airlines` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `worksfor_staff_email_foreign` FOREIGN KEY (`staff_email`) REFERENCES `Staff` (`user_email`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
