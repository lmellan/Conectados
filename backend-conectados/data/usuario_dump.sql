-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: conectados
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

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
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `categoria` varbinary(255) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `disponibilidad` varbinary(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `rol` enum('ADMIN','BUSCADOR','PRESTADOR') DEFAULT NULL,
  `zona_atencion` varchar(255) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `hora_fin` time(6) DEFAULT NULL,
  `hora_inicio` time(6) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `numero` varchar(255) DEFAULT NULL,
  `rol_activo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,NULL,'1234','maria.buscador@gmail.com',NULL,NULL,'Mar√≠a P√©rez','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(2,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0	Est√©ticax','1234','camila.prestador@gmail.com','Servicios de belleza a domicilio',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Martest\0Viernesx','Camila Soto','PRESTADOR','Valpara√≠so',NULL,NULL,NULL,NULL,'56986171519',NULL),(3,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Limpiezax','1234','lorna.mella@gmail.com','Servicios de limpieza a domicilio',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Martest\0Viernesx','Lorna Mella','PRESTADOR','Valpara√≠so',NULL,NULL,NULL,NULL,'56986171519',NULL),(4,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0	Peluquerot\0Limpiezax','1234','1@gmail.com','',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0\nMi√©rcolest\0Viernesx','Nicolas nu√±ez','PRESTADOR','Valpara√≠so',NULL,NULL,NULL,NULL,'56986171519',NULL),(5,NULL,'1234','dana@gmail.com',NULL,NULL,'dana verga','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(6,NULL,'1234','soynico@yahoo.cl',NULL,NULL,'Nicolas nu√±ez','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(8,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Limpiezax','1234','alexis7@laroja.com','',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0\nMi√©rcolest\0Lunesx','Alexis Sanchez','PRESTADOR','Tarapac√°',NULL,NULL,NULL,NULL,'56986171519',NULL),(10,NULL,'1234','1@gmail.com',NULL,NULL,'LornaMella','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(11,NULL,'1234','maria.buscador2@gmail.com',NULL,NULL,'Mar√≠a Mella','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(12,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0	Est√©ticax','1234','camila.prestador2@gmail.com','Servicios de belleza a domicilio',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Martest\0Viernesx','Camila Soto','PRESTADOR','Valpara√≠so',NULL,NULL,NULL,NULL,'56986171519',NULL),(13,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0	Peluquerot\0	Jardinerox','1234','23@gmail.com','Soy jardinero preofsional con 50 a√±os de trayectoria',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0Martest\0\nMi√©rcolest\0Juevest\0Viernesx','LornaMella','PRESTADOR','Los R√≠os',NULL,NULL,NULL,NULL,'56986171519',NULL),(14,NULL,'1234','buscador@gmail.com',NULL,NULL,'Lorna Mella','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(15,NULL,'1234','rosario@gmail.com',NULL,NULL,'Rosario mella','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(16,NULL,'1234','buscador3@gmail.com',NULL,NULL,'LornaMella','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(17,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Electricistax','1234','prestador@gmail.com','Soy un presional electrista. 20 a√±o de trayectoria',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0Martest\0\nMi√©rcolest\0Juevest\0Viernesx','Lorna mella','PRESTADOR','Regi√≥n Metropolitana',NULL,NULL,NULL,NULL,'56986171519',NULL),(18,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0	Peluquerox','1234','1v2a3l4e.mella@gmail.com','Corto pelo a ni√±os',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0S√°badox','LornaMella','PRESTADOR','Regi√≥n Metropolitana',NULL,NULL,NULL,NULL,'56986171519',NULL),(19,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0	Peluquerox','1234','soynico@gmail.com','Corto pelo a ni√±os',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0Domingox','Nicolas nu√±ez','PRESTADOR','O‚ÄôHiggins',NULL,NULL,NULL,NULL,'56986171519',NULL),(20,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0	Peluquerox','1234','lornamella@gmail.com','Corto pelo a bebes',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0Martesx','LornaMella','PRESTADOR','Valpara√≠so',NULL,NULL,NULL,NULL,'56986171519',NULL),(21,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Limpiezax','1234','lorna1@gmail.com','Soy limpiadora con 20 a√±os de experiencia',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0Martesx','LornaMella','PRESTADOR','Maule',NULL,NULL,NULL,NULL,'56986171519',NULL),(22,NULL,'1234','rosario1@gamil.com',NULL,NULL,'rosario mella','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(23,NULL,'1234','rosario1@gmail.com',NULL,NULL,'rosario mella','BUSCADOR',NULL,NULL,NULL,NULL,NULL,'56942953500',NULL),(25,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Electricistat\0Gasfiterx','segura123','carlos.perez@example.com','Experto en instalaciones domiciliarias',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0Martest\0Juevesx','Carlos P√©rez','PRESTADOR','Santiago',NULL,'17:00:00.000000','09:00:00.000000',NULL,'56986171519',NULL),(26,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Electricistat\0\nCarpinterox','1234','almeja.ramires@gmail.com','aaaaaaaaaaaaaaaaa',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0S√°badox','almeja ramires','PRESTADOR','Los Lagos',NULL,NULL,NULL,NULL,'56986171519',NULL),(27,_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0T√©cnico en computaci√≥nt\0	Masajistax','1234','2@gmail.com','hago comia',_binary '¨\Ì\0sr\0java.util.ArrayListxÅ\“ô\«aù\0I\0sizexp\0\0\0w\0\0\0t\0Lunest\0Viernesx','pablo mella',NULL,'Maule',NULL,NULL,NULL,NULL,'56986171519',NULL),(28,NULL,'1234','1234@gmail.com','qqqqqqq',NULL,'lorna mella',NULL,'Regi√≥n Metropolitana',NULL,'18:00:00.000000','09:00:00.000000',NULL,NULL,'BUSCADOR'),(29,NULL,'1234','1234@gmail.com',NULL,NULL,'Nicolas nu√±ez',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'BUSCADOR'),(30,NULL,'1234','1234@gmail.com',NULL,NULL,'LornaMella',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'BUSCADOR'),(31,NULL,'1234','google@gmail.com',NULL,NULL,'google',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'BUSCADOR'),(32,NULL,'1234','google@gmail.com',NULL,NULL,'google',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'BUSCADOR'),(33,NULL,'1234','gmail@gmail.com','soi seko',NULL,'gmail',NULL,'Valpara√≠so',NULL,'14:00:00.000000','09:00:00.000000',NULL,NULL,'PRESTADOR'),(34,NULL,'123','321@gmail.com','wwwww',NULL,'lorna mella ormazabal',NULL,'Los R√≠os',NULL,'14:00:00.000000','09:00:00.000000',NULL,NULL,'BUSCADOR'),(35,NULL,'1234','dana1@gmail.com','wwww',NULL,'danahe',NULL,'Los Lagos',NULL,'18:00:00.000000','09:00:00.000000',NULL,'56986171519','BUSCADOR'),(36,NULL,'password123','juan.perez@gmail.com','Profesional con experiencia en electricidad y carpinter√≠a.',NULL,'Juan P√©rez',NULL,'Santiago',NULL,'18:00:00.000000','08:00:00.000000','','56986171519','PRESTADOR'),(37,NULL,'password123','ana.gomez@gmail.com','Profesional con experiencia en electricidad y fontaner√≠a.',NULL,'Ana G√≥mez',NULL,'Santiago',NULL,'18:00:00.000000','08:00:00.000000','','56987654321','BUSCADOR'),(38,NULL,'password123','carlos.rodriguez@gmail.com','Profesional con experiencia en fontaner√≠a y electricidad.',NULL,'Carlos Rodr√≠guez',NULL,'Valpara√≠so',NULL,'18:00:00.000000','08:00:00.000000','','56998765432','PRESTADOR'),(39,NULL,'1234','4321@gamil.com',NULL,NULL,'LornaMella',NULL,NULL,NULL,NULL,NULL,NULL,'56986171519','BUSCADOR'),(40,NULL,'1234','54321@gmail.com','Soy el mejor',NULL,'LornaMella',NULL,'Valpara√≠so',NULL,'18:00:00.000000','09:00:00.000000',NULL,'56986171519','BUSCADOR'),(41,NULL,'1234','654321@gmail.com','aaaaaa',NULL,'LornaMella',NULL,'O‚ÄôHiggins',NULL,'18:00:00.000000','09:00:00.000000',NULL,'56986171519','PRESTADOR'),(42,NULL,'1234','alo@alo.com',NULL,NULL,'alooo',NULL,NULL,NULL,NULL,NULL,NULL,'56986171519','BUSCADOR'),(43,NULL,'contrasenaValida','test1751135637994@ejemplo.com',NULL,NULL,'Usuario de Prueba',NULL,NULL,NULL,NULL,NULL,NULL,'56912345678','BUSCADOR'),(44,NULL,'contrasenaValida','test1751135932283@ejemplo.com',NULL,NULL,'Usuario de Prueba',NULL,NULL,NULL,NULL,NULL,NULL,'56912345678','BUSCADOR'),(45,NULL,'contrasenaValida','test1751135935762@ejemplo.com',NULL,NULL,'Usuario de Prueba',NULL,NULL,NULL,NULL,NULL,NULL,'56912345678','BUSCADOR'),(46,NULL,'contrasenaValida','test1751136813554@ejemplo.com',NULL,NULL,'Usuario de Prueba',NULL,NULL,NULL,NULL,NULL,NULL,'56912345678','BUSCADOR'),(47,NULL,'contrasenaValida','test1751139556925@ejemplo.com',NULL,NULL,'Usuario de Prueba',NULL,NULL,NULL,NULL,NULL,NULL,'56912345678','BUSCADOR');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-28 17:33:17
