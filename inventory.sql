-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2015 at 03:11 PM
-- Server version: 5.5.27
-- PHP Version: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `originalPrice` double DEFAULT NULL,
  `sellingPrice` double DEFAULT NULL,
  `number_of_stocks` double DEFAULT NULL,
  `stock_unit` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `description`, `originalPrice`, `sellingPrice`, `number_of_stocks`, `stock_unit`) VALUES
(37, 'Hammer', 'medium', 30, 50, 19, 'piece'),
(38, 'Nails', '2 x 3', 20, 30, 1, 'packs');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE IF NOT EXISTS `sales` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `transaction_date` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`transaction_id`, `product_id`, `transaction_date`) VALUES
(7, 37, '2015-07-10'),
(8, 38, '2015-07-10'),
(9, 38, '2015-07-11'),
(10, 37, '2015-07-12');

-- --------------------------------------------------------

--
-- Table structure for table `transactions_info`
--

CREATE TABLE IF NOT EXISTS `transactions_info` (
  `transaction_id` int(11) DEFAULT NULL,
  `number_of_items` int(11) DEFAULT NULL,
  KEY `transaction_id_transactions_info_to_transactions` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transactions_info`
--

INSERT INTO `transactions_info` (`transaction_id`, `number_of_items`) VALUES
(3, 2),
(4, 110),
(5, 90),
(6, 2147483647),
(7, 30),
(8, 9),
(9, 2),
(10, 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
