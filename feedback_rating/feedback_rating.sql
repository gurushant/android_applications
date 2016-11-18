-- MySQL dump 10.13  Distrib 5.7.16, for Linux (x86_64)
--
-- Host: localhost    Database: feedback_rating
-- ------------------------------------------------------
-- Server version	5.7.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `email_notification`
--

DROP TABLE IF EXISTS `email_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_notification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(15) DEFAULT NULL,
  `is_email_sent` tinyint(1) DEFAULT NULL,
  `feedback_received_time` datetime DEFAULT NULL,
  `email_body` json DEFAULT NULL,
  `email_sent_time` datetime DEFAULT NULL,
  `is_feedback_rating_received` tinyint(1) DEFAULT NULL,
  `restaruent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_notification`
--

LOCK TABLES `email_notification` WRITE;
/*!40000 ALTER TABLE `email_notification` DISABLE KEYS */;
INSERT INTO `email_notification` VALUES (1,'2000',1,'2016-11-18 15:06:40',NULL,'2016-11-16 01:49:52',1,1),(2,'2001',1,NULL,NULL,'2016-11-18 02:04:36',0,1),(3,'2002',1,NULL,NULL,'2016-11-18 02:04:50',0,2),(4,'2003',1,NULL,NULL,'2016-11-18 02:05:11',0,3),(5,'2004',1,NULL,NULL,'2016-11-18 02:06:08',0,1),(6,'2005',1,NULL,NULL,'2016-11-18 02:06:19',0,2),(7,'2006',1,NULL,NULL,'2016-11-18 02:06:30',0,2),(8,'2007',1,NULL,NULL,'2016-11-18 02:06:47',0,1),(9,'2008',1,NULL,NULL,'2016-11-18 02:07:06',0,8),(10,'2009',1,NULL,NULL,'2016-11-18 02:07:20',0,1);
/*!40000 ALTER TABLE `email_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `restaruent_id` mediumint(9) DEFAULT NULL,
  `served_date_time` datetime DEFAULT NULL,
  `order_amount` int(11) DEFAULT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `customer_mobile` varchar(18) DEFAULT NULL,
  `recipes_in_orders` json DEFAULT NULL,
  `rating_feedback_data` json DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `overall_recipe_rating` float DEFAULT NULL,
  `overall_order_rating` float DEFAULT NULL,
  `feedback` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2010 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2000,1,'2016-11-14 11:24:27',2000,'gurushant033@gmail.com','9767976808','[\"veg birayani\", \"veg pulav\", \"paratha\", \"chicken masala\"]','{\"qos\": 3, \"economy\": 2, \"ambience\": 2.5, \"feedback\": \"test feedback\", \"order_id\": \"2000\", \"recipe_rating\": [{\"veg birayani\": 2.5}, {\"chicken masala\": 3.5}], \"restaruent_id\": \"1\", \"overall_order_rating\": 2.5, \"overall_recipe_rating\": 3}','2016-11-14 11:24:27',3,2.5,'test feedback'),(2001,1,'2016-11-14 11:48:08',2250,'mahesh@gmail.com','9637121842','[\"veg dirayani\", \"dal tadka\", \"paratha\", \"chicken soup\"]',NULL,'2016-11-14 11:48:08',NULL,NULL,NULL),(2002,2,'2016-11-14 11:49:13',1250,'pratibha@gmail.com','9837121842','[\"paneer tikka masala\", \"dal tadka\", \"jira rice\"]',NULL,'2016-11-14 11:49:13',NULL,NULL,NULL),(2003,3,'2016-11-14 11:50:38',980,'pratibha@gmail.com','9837121842','[\"paneer tikka masala\", \"dal tadka\", \"jira rice\"]',NULL,'2016-11-14 11:50:38',NULL,NULL,NULL),(2004,1,'2016-11-14 11:51:32',380,'raman@gmail.com','9937121842','[\"veg handi\", \"butter roti\", \"jira rice\"]',NULL,'2016-11-14 11:51:32',NULL,NULL,NULL),(2005,2,'2016-11-14 11:52:18',380,'raman@gmail.com','9937121842','[\"veg handi\", \"butter roti\", \"jira rice\"]',NULL,'2016-11-14 11:52:18',NULL,NULL,NULL),(2006,2,'2016-11-14 11:53:20',590,'dev@gmail.com','9927121842','[\"chicken handi\", \"butter roti\"]',NULL,'2016-11-14 11:53:20',NULL,NULL,NULL),(2007,1,'2016-11-14 11:53:38',690,'dev@gmail.com','9927121842','[\"chicken handi\", \"butter roti\"]',NULL,'2016-11-14 11:53:38',NULL,NULL,NULL),(2008,2,'2016-11-14 11:55:44',690,'aditya@gmail.com','9127121842','[\"chicken handi\", \"butter naan\", \"sweet lime soda\"]',NULL,'2016-11-14 11:55:44',NULL,NULL,NULL),(2009,1,'2016-11-14 11:56:18',690,'jeevan@gmail.com','9527121842','[\"chicken handi\", \"butter naan\", \"milk shake\"]',NULL,'2016-11-14 11:56:18',NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-18 15:09:18
