CREATE DATABASE  IF NOT EXISTS "ShareMyFood" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ShareMyFood`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mysql-7ca514c-eluxeer-7baa.c.aivencloud.com    Database: ShareMyFood
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '367dee7d-e9b1-11ef-8866-caa5ac3a569d:1-48,
8d3fbfa3-e24c-11ef-b5a7-e25a1bf2b7b8:1-33';

--
-- Table structure for table `ngo`
--

DROP TABLE IF EXISTS `ngo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ngo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(30) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `address` varchar(75) DEFAULT '123 XYZ Street, ABC City, XYZ Country, 12345',
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT 'https://res.cloudinary.com/dsljhnanm/image/upload/v1739416010/sheremyfoodprofile/eindvzgzwmu3ytvcmhxp.jpg',
  `usertype` varchar(45) NOT NULL DEFAULT 'ngo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ngo`
--

LOCK TABLES `ngo` WRITE;
/*!40000 ALTER TABLE `ngo` DISABLE KEYS */;
/*!40000 ALTER TABLE `ngo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verification`
--

DROP TABLE IF EXISTS `otp_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(30) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verification`
--

LOCK TABLES `otp_verification` WRITE;
/*!40000 ALTER TABLE `otp_verification` DISABLE KEYS */;
INSERT INTO `otp_verification` VALUES (1,'tusharsaini.in@gmail.com','958156','2025-02-14 13:03:32'),(2,'tusharsaini.in@gmail.com','125472','2025-02-14 13:12:03'),(3,'tusharsaini.in@gmail.com','681682','2025-02-14 13:12:34'),(4,'tusharsaini.in@gmail.com','987043','2025-02-14 13:13:09'),(5,'tusharsaini.in@gmail.com','722896','2025-02-14 13:37:47'),(6,'tusharsaini.in@gmail.com','515029','2025-02-14 13:45:21'),(7,'tusharsaini.in@gmail.com','993812','2025-02-14 13:46:53'),(8,'tusharsaini.in@gmail.com','240768','2025-02-14 13:55:50');
/*!40000 ALTER TABLE `otp_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(30) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `address` varchar(75) DEFAULT '123 XYZ Street, ABC City, XYZ Country, 12345',
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT 'https://res.cloudinary.com/dsljhnanm/image/upload/v1739416010/sheremyfoodprofile/eindvzgzwmu3ytvcmhxp.jpg',
  `usertype` varchar(45) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (7,'John Doe','tushar.com','1234567890','123 Main St, City, Country','$2b$10$rJIoJi8ZaW2nTxkR8AIrs.QyikoIdtUNY2//NM3aSzD1/rP36wMxu','https://res.cloudinary.com/dsljhnanm/image/upload/v1739470523/sheremyfoodprofile/gohehfkubob4tc2ow00z.png','user'),(8,'Tushar Saini','tusharsaini.in@gmail.com','1234567890','123 XYZ Street, ABC City, XYZ Country, 12345','$2b$10$m7EswP9RXksWJp8pTrKuYO29uSliYwBbJ/QgxqpgCZ5vHAdV46X/2','https://res.cloudinary.com/dsljhnanm/image/upload/v1739416010/sheremyfoodprofile/eindvzgzwmu3ytvcmhxp.jpg','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-15 20:03:14
