-- MySQL dump 10.13  Distrib 9.2.0, for macos14.7 (arm64)
--
-- Host: localhost    Database: friends
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(40) DEFAULT NULL,
  `content` text,
  `created_at` varchar(100) DEFAULT NULL,
  `share` tinyint DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,'Caring for a Loved One with Alzheimer\'s','<p>The journey of caring for a family member with Alzheimer\'s is emotionally taxing, but also filled with moments of grace and growth.</p>','2025-03-30',NULL,1),(2,'The Struggle of Watching Someone Forget','<p>Witnessing a loved one forget their memories and lose themselves is a heart-wrenching experience that often feels like an ongoing grief.</p>','2025-03-30',NULL,1),(3,'The Emotional Toll of Dementia Care','<p>Being a caregiver for a dementia patient is physically and emotionally exhausting, and sometimes it feels like there\'s no escape from the sadness.</p>','2025-02-25',NULL,1),(4,'The Heartbreak of Seeing Change','<p>Every day with a family member who has dementia brings new challenges, and it\'s difficult to accept how much they&rsquo;ve changed over time.</p>','2025-03-30',NULL,1),(5,'Finding Strength Amidst Dementia','<p>Though caring for a loved one with dementia is a constant emotional struggle, family members find inner strength they never knew they had.</p>','2025-02-26',NULL,2),(6,'Hello','<p>Hello mates!&nbsp; Can I ask some questions here?</p>','2025-03-31',NULL,4),(7,'Coping with a Loved One\'s Memory Loss','It’s heartbreaking to see a loved one forget the things they once knew, but it reminds me to cherish every moment.','2025-03-31 11:59:21',0,1),(8,'A Day at a Time','Every day is different, but I try to stay hopeful, focusing on the small victories with my loved one.','2025-03-31 11:59:21',0,2),(9,'The Struggle of Letting Go','Watching them lose their sense of independence is difficult, but I remind myself they need me now more than ever.','2025-03-31 11:59:21',0,3),(10,'Finding Strength in Small Moments','Even in the face of dementia, there are moments of clarity that bring us closer, and I hold onto those.','2025-03-31 11:59:21',0,4),(11,'Understanding Their Pain','Sometimes, I feel helpless. But understanding their frustration helps me provide the support they need.','2025-03-31 11:59:21',0,1),(12,'Adjusting to the New Reality','Dementia changes everything. I’ve learned to adapt and focus on creating a safe and loving environment.','2025-03-31 11:59:21',0,2),(13,'The Emotional Toll of Caregiving','It’s exhausting, emotionally and physically, but I can’t imagine not being there for them.','2025-03-31 11:59:21',0,3),(14,'The Rollercoaster of Emotions','One moment they’re themselves, and the next, they’re not. It’s a daily emotional rollercoaster that never stops.','2025-03-31 11:59:21',0,4),(15,'Grief and Acceptance','It’s not easy to accept that they’re slowly slipping away, but I am learning to grieve while they’re still here.','2025-03-31 11:59:21',0,1),(16,'Finding Peace Through Patience','Patience is key. As hard as it is, I try to find peace through my patience, knowing that my love is enough.','2025-03-31 11:59:21',0,2);
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emojis`
--

DROP TABLE IF EXISTS `emojis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emojis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emojis`
--

LOCK TABLES `emojis` WRITE;
/*!40000 ALTER TABLE `emojis` DISABLE KEYS */;
/*!40000 ALTER TABLE `emojis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sender_id` int DEFAULT NULL,
  `room_name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'hello','2025-03-31 00:18:34',1,'12'),(2,'hi how are you!','2025-03-31 03:09:16',1,'12'),(3,'hey!','2025-03-31 03:14:11',2,'12'),(4,'Cool!','2025-03-31 03:43:01',1,'12'),(5,'hi how are you','2025-03-31 04:37:48',1,'13');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_name` varchar(200) DEFAULT NULL,
  `last_message` text,
  `updated_at` timestamp NULL DEFAULT NULL,
  `attendants` varchar(200) DEFAULT NULL,
  `sender_id` int DEFAULT NULL,
  `xs_id_unread` int DEFAULT NULL,
  `lg_id_unread` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES ('12','Cool!',NULL,'1,2',1,0,1),('13','hi how are you',NULL,'1,3',1,NULL,1);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'don\'t eat'),(2,'don\'t talk'),(3,'can\'t walk'),(4,'forgetable'),(5,'Memory loss '),(6,'Confusion');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_article_emoji`
--

DROP TABLE IF EXISTS `user_article_emoji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_article_emoji` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `article_id` int DEFAULT NULL,
  `emoji_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `article_id` (`article_id`),
  KEY `emoji_id` (`emoji_id`),
  CONSTRAINT `user_article_emoji_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_article_emoji_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`),
  CONSTRAINT `user_article_emoji_ibfk_3` FOREIGN KEY (`emoji_id`) REFERENCES `emojis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_article_emoji`
--

LOCK TABLES `user_article_emoji` WRITE;
/*!40000 ALTER TABLE `user_article_emoji` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_article_emoji` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_friends`
--

DROP TABLE IF EXISTS `user_friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_friends` (
  `user_id` int DEFAULT NULL,
  `friend_id` int DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `friend_id` (`friend_id`),
  CONSTRAINT `user_friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_friends`
--

LOCK TABLES `user_friends` WRITE;
/*!40000 ALTER TABLE `user_friends` DISABLE KEYS */;
INSERT INTO `user_friends` VALUES (1,2),(2,1),(4,2),(1,3);
/*!40000 ALTER TABLE `user_friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_login`
--

DROP TABLE IF EXISTS `user_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `token` varchar(200) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_login_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_login`
--

LOCK TABLES `user_login` WRITE;
/*!40000 ALTER TABLE `user_login` DISABLE KEYS */;
INSERT INTO `user_login` VALUES (1,'native','$argon2i$v=19$m=4096,t=3,p=1$l7DGAuf7dxneiw167CdTfg$f8lZde3WSiQzlrJv3pbyQdA0a/PXWkbL1a/HpXcDdsk',1),(2,'native','$argon2i$v=19$m=4096,t=3,p=1$QjtOIYH3196fxETUfRCHjw$6zLFhWd24NyqSfRTtVIXvGC9YNAFJZTmZ+lKM3Awe5o',2),(3,'native','$argon2i$v=19$m=4096,t=3,p=1$ujGmZx9eSwFugCnNpaW+NQ$e++G88Po2dyU3T1b/9owulQqwX7zz+aJd0TCiiNI74M',3),(4,'native','$argon2i$v=19$m=4096,t=3,p=1$Y++9WVsQHxrV0rrtF7VTWg$Jkm2qYBetTGDYlUJNZPDOJiK8roxH51TRxYH8kJz54c',4),(5,'native','$argon2i$v=19$m=4096,t=3,p=1$b7H66K5iCQj9lh7V43OV+A$2mgGKtGNtnewGUFibneb66sMKn6DaodvveIQcEIPors',5);
/*!40000 ALTER TABLE `user_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_unfriends`
--

DROP TABLE IF EXISTS `user_unfriends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_unfriends` (
  `user_id` int DEFAULT NULL,
  `unfriend_id` int DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `user_unfriends_ibfk_2` (`unfriend_id`),
  CONSTRAINT `user_unfriends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_unfriends_ibfk_2` FOREIGN KEY (`unfriend_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_unfriends`
--

LOCK TABLES `user_unfriends` WRITE;
/*!40000 ALTER TABLE `user_unfriends` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_unfriends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `picture` varchar(200) DEFAULT NULL,
  `birth` varchar(45) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `sick_year` int DEFAULT NULL,
  `hospital` varchar(200) DEFAULT NULL,
  `level` varchar(45) DEFAULT NULL,
  `carer` varchar(45) DEFAULT NULL,
  `current_problem` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_article_emoji_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Kelly Guo','admin@gmail.com','https://s3.ap-southeast-1.amazonaws.com/test.chichi-lab.com/1.png','2025-03-31','Georgia',2000,'tpe','Severe','Myself','I can\'t find proper doctor','2025-03-30 23:30:13',NULL),(2,'Bob','1@gmail.com','https://s3.ap-southeast-1.amazonaws.com/test.chichi-lab.com/4.png','2025-03-31','宜蘭縣',1999,NULL,'Moderate','Family','Just want to make friends','2025-03-31 00:10:14',NULL),(3,'John','a@gmail.com','https://s3.ap-southeast-1.amazonaws.com/test.chichi-lab.com/3.png','2025-03-31','基隆市',1922,NULL,'重度','看護','sharing my moods','2025-03-31 00:40:12',NULL),(4,'Ellen','ellen@gmail.com','https://s3.ap-southeast-1.amazonaws.com/test.chichi-lab.com/2.png','2025-03-31','Connecticut',2018,NULL,'Moderate','Family','Looking for helper ','2025-03-31 03:38:57',NULL),(5,'Jack Lee','abc@gmail.com','https://s3.ap-southeast-1.amazonaws.com/test.chichi-lab.com/4.png','2025-03-31','California',2021,NULL,'Moderate','Family','Lonliness','2025-03-31 04:20:51',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_rooms`
--

DROP TABLE IF EXISTS `users_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_rooms` (
  `user_id` int DEFAULT NULL,
  `room_name` varchar(200) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `users_rooms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_rooms`
--

LOCK TABLES `users_rooms` WRITE;
/*!40000 ALTER TABLE `users_rooms` DISABLE KEYS */;
INSERT INTO `users_rooms` VALUES (1,'12',1),(2,'12',2),(1,'13',3),(3,'13',4);
/*!40000 ALTER TABLE `users_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_tags`
--

DROP TABLE IF EXISTS `users_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_tags` (
  `user_id` int DEFAULT NULL,
  `tag_id` int DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `users_tags_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `users_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_tags`
--

LOCK TABLES `users_tags` WRITE;
/*!40000 ALTER TABLE `users_tags` DISABLE KEYS */;
INSERT INTO `users_tags` VALUES (3,2),(3,5),(2,1),(2,2),(2,5),(2,6),(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(5,1),(5,5),(5,6);
/*!40000 ALTER TABLE `users_tags` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-31 12:54:19
