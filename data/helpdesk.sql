-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-07-2021 a las 02:42:19
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `helpdesk`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertarNotificacion` (IN `descripcion_notificacion` VARCHAR(200), IN `fecha_historial_` DATETIME, IN `solicitud_historial` INT, IN `area_historial` INT)  NO SQL
INSERT INTO notificacion( fecha, descripcion, estado, fecha_historial, id_solicitud_historial, id_area_historial) VALUES (now(),descripcion_notificacion,"no visto",fecha_historial_,solicitud_historial,area_historial)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `notificaMas15` ()  NO SQL
BEGIN
DECLARE v_id int;
DECLARE v_cantidad int;
DECLARE c_solicitudes CURSOR FOR SELECT DISTINCT h.id_solicitud FROM solicitud s join historial h on (s.id_solicitud=h.id_solicitud) WHERE DATEDIFF( NOW(),s.fecha_solicitud)>15 and estado!="Resuelto";
DECLARE CONTINUE HANDLER FOR NOT FOUND SET @hecho = TRUE;
OPEN c_solicitudes;
L1:LOOP
    FETCH c_solicitudes into v_id;
    if(@hecho) THEN
        LEAVE L1;
    end if;
        INSERT INTO notificacion( fecha, descripcion, estado, fecha_historial, id_solicitud_historial, id_area_historial) VALUES (now(),"La solicitud paso 15 dias sin resolverse","no visto",null,v_id,null);
END LOOP L1;
CLOSE c_solicitudes;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `notificaPrioridad` ()  NO SQL
BEGIN
DECLARE v_fecha_ingreso datetime;
DECLARE v_id_area int;
DECLARE v_id_solicitud int;
DECLARE c_solicitudes CURSOR FOR SELECT h.fecha_ingreso ,h.id_area , h.id_solicitud from historial h join solicitud s on (h.id_solicitud= s.id_solicitud) where TIMESTAMPDIFF(HOUR,h.fecha_ingreso,NOW())>36 and s.prioridad = "Alta" and h.estado = "Pendiente" ;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET @hecho = TRUE;
OPEN c_solicitudes;
L1:LOOP
    FETCH c_solicitudes into v_fecha_ingreso,v_id_area,v_id_solicitud;
    if(@hecho) THEN
        LEAVE L1;
    end if;
        INSERT INTO notificacion( fecha, descripcion, estado, fecha_historial, id_solicitud_historial, id_area_historial) VALUES (now(),"Esta solicitud paso mas de 36 horas sin resolverse o tranferirse","no visto",v_fecha_ingreso,v_id_solicitud,v_id_area);
END LOOP L1;
CLOSE c_solicitudes;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area`
--

CREATE TABLE `area` (
  `id_area` int(11) NOT NULL,
  `nombre_area` varchar(200) NOT NULL,
  `estado` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `area`
--

INSERT INTO `area` (`id_area`, `nombre_area`, `estado`) VALUES
(1, 'HelpDesk', '1'),
(2, 'Calidad', '1'),
(3, 'Gestion', '1'),
(13, 'Atencion Al Cliente', '1'),
(14, 'Ventas', '1'),
(15, 'reciclados', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `dni` bigint(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `apellido` varchar(200) NOT NULL,
  `mail` varchar(200) NOT NULL,
  `celular` bigint(20) NOT NULL,
  `contraseña` varchar(2000) NOT NULL,
  `fecha` datetime NOT NULL,
  `estado` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`dni`, `nombre`, `apellido`, `mail`, `celular`, `contraseña`, `fecha`, `estado`) VALUES
(11, 'marcela', 'perez', 'marcela@cliente.com', 4545, '$2a$10$uQQkCg0V.Hftt5WzypSH3uiwbGiVZWD2HGnQ.KXad3X1EGnO.8zSq', '2021-07-22 21:00:00', 'Aceptado'),
(22222, 'juan', 'perez', 'juan@cliente.com', 12, '$2a$10$oIc/B1VWJmRzk20cBSxyhOMteWuOyQdqH.44X1SUCepSgk2XVCxIa', '2021-07-17 00:00:00', 'Aceptado'),
(565812, 'fernando', 'saez', 'fernando@cliente.com', 2665986345, '$2a$10$1XgK0/d.eo9YoIs5pBjxI.8eGB8bUgzWskBhoumEzu63LFg9CvJja', '2021-07-15 21:00:00', 'Aceptado'),
(568266, 'roberto', 'flores', 'martufar15@gmail.com', 45465465, '$2a$10$vzipiQW9AZrc/OkDCDyI1.0vsjnHBCZWHIQYiQWFTQ6DiCBBpcv4G', '2021-07-24 00:00:00', 'Pendiente'),
(5156454, 'Gaston', 'Sosa', 'agasag@gmail.com', 226166458, 'hyouka21', '2021-05-18 13:13:22', 'Aceptado'),
(40595561, 'jon', 'WICK', 'joni2210122@gmail.com', 1212, '$2a$10$//NTm66v9Y939WhhiYepteeQiBBqlf91weW8bBpiw/ZQ0NiyNS9o6', '2021-07-23 00:00:00', 'Aceptado'),
(45695385, 'chicho', 'gatica', 'chicho@cliente.com', 55648481513, '$2a$10$iXD2Rma/M7wgY0ulnc2nh.l/A1IOd.gzfqO/0h9hghegjlj6ujCsS', '2009-03-18 21:00:00', 'Aceptado'),
(123456789, 'pedro', 'paez', 'pedro@cliente.com', 4545, '$2a$10$OX58ZO6cBcJg1UxcpDaYLeuMQrnS3ZgB.GTmjW.cXvOmr/74dX752', '2021-07-15 21:00:00', 'Aceptado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `dni` bigint(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `apellido` varchar(200) NOT NULL,
  `mail` varchar(200) NOT NULL,
  `telefono` bigint(20) NOT NULL,
  `contraseña` varchar(2000) NOT NULL,
  `rol` varchar(200) NOT NULL,
  `id_area` int(11) NOT NULL,
  `estado` varchar(200) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`dni`, `nombre`, `apellido`, `mail`, `telefono`, `contraseña`, `rol`, `id_area`, `estado`, `fecha`) VALUES
(1, 'joniiiiiiiiiii', 'Salassssssss', 'joni_1122@hotmail.com', 2222222222, '$2a$10$kLkCpT346XmUl80Vt/jmJ.wNu6hVDuRFmoOMfLwu4QgETMWUwdXQ2', 'empleado', 3, '1', '2021-07-10 00:00:00'),
(777, 'leo', 'messi', 'leo@empleado.com', 333333333333, '$2a$10$LCjl57bVRFOCUlHvNjGL2OqyedG1gmrHfYCPpqomnC.dZVFwD202a', 'Empleado', 13, '1', '2021-06-30 21:00:00'),
(12345, 'lucho', 'farias', 'lucho@helpdesk.com', 123456, '$2a$10$kEmTPOnVzCp/.TeCi5zOYOVrme/cqOwQSyQM5lGgsYlNOE58KD93O', 'Empleado', 1, '1', '2021-07-03 00:00:00'),
(561564, 'Hernan', 'Constante', 'gasaa@gmail.com', 23145346556, 'loquita22', 'empleado', 3, '0', '2021-05-18 14:56:20'),
(1564566, 'joni', 'salas', 'agsag@gsa.com', 14564745, 'perrito22', 'admin', 1, '1', '2021-05-18 13:14:38'),
(33333333, 'marcelo', 'sosa', 'marce@calidad.com', 98989656, '$2a$10$q7vvDHypOrPIbNKD8..VYu5Z3Q.ZBAW/5aSAYOz35O21gq4iVLvfm', 'Empleado', 2, '1', '2021-07-08 21:00:00'),
(40938243, 'sol', 'martin', 'sol.martin@hotmail.com', 5345373, '$2a$10$x7dwF23155Fv35I.vhzVZ.vWaV1L1RmRUdsLfmEtDsJH/MfUBOOHG', 'Empleado', 1, '1', '2021-07-15 21:00:00'),
(44906895, 'facundo', 'medina', 'facu@helpdesk.com', 55546465, '$2a$10$vtsRSXC/4ujGM9WTcbxxNehKp8S1xAa3j66LEPVnRggKlR2gaz0nq', 'Empleado', 1, '1', '2021-07-02 21:00:00'),
(98989898, 'luis', 'morales', 'luis@ventas.com', 1123434569, '$2a$10$e4mRYXqVT6rZ7x/nXDbT6eZykeMj9YlFDWq4/4sSq5O/zyad3d1t.', 'Empleado', 14, '1', '2021-06-30 21:00:00'),
(123132125, 'fernando', 'gatica', 'fer@calidad.com', 545465, '$2a$10$aP9xs4sF.m8AJMDwVroteePKUP68PmCB.YHs1moiV3osUtT0WQkUm', 'Empleado', 2, '1', '2021-07-03 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial`
--

CREATE TABLE `historial` (
  `fecha_ingreso` datetime NOT NULL,
  `estado` varchar(200) NOT NULL,
  `detalle_razon` varchar(200) NOT NULL,
  `detalle_solucion` varchar(200) NOT NULL,
  `id_area` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `dni_empleado` bigint(11) DEFAULT NULL,
  `fecha_egreso` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `historial`
--

INSERT INTO `historial` (`fecha_ingreso`, `estado`, `detalle_razon`, `detalle_solucion`, `id_area`, `id_solicitud`, `dni_empleado`, `fecha_egreso`) VALUES
('2021-05-18 13:19:07', 'Transferido', 'se transfirio al area de servicios', '', 1, 1, 1564566, '2021-05-18 13:20:37'),
('2021-05-18 14:57:21', 'Pendiente', '', '', 3, 1, NULL, NULL),
('2021-07-22 22:06:43', 'Resuelto', '', '\r\n54245', 1, 12, 12345, '2021-07-23 00:46:41'),
('2021-07-23 00:48:00', 'Resuelto', '', 'no puedo hacer nada por vos, suerte', 1, 13, 12345, '2021-07-23 00:48:47'),
('2021-07-23 00:50:28', 'Resuelto', '', '56165', 1, 14, 12345, '2021-07-23 00:52:02'),
('2021-07-23 02:17:51', 'Transferido', 'transfiero a area calidad, por que es imposible que se arregle', '', 1, 15, 12345, '2021-07-23 02:21:34'),
('2021-07-23 02:21:34', 'Resuelto', '', 'Lo podemos resolver en area calidad', 2, 15, 33333333, '2021-07-26 21:25:37'),
('2021-07-23 04:07:43', 'Transferido', 'Transfiero a area helpdesk ', '', 1, 16, 33333333, '2021-07-26 21:25:57'),
('2021-07-23 04:09:02', 'Pendiente', '', '', 2, 16, NULL, NULL),
('2021-07-23 04:15:28', 'Resuelto', '', 'probando mis resueltas', 1, 17, 12345, '2021-07-23 04:38:13'),
('2021-07-23 04:49:08', 'Resuelto', '', 'La luz esta cortada de manera permanente', 1, 18, 12345, '2021-07-23 04:52:28'),
('2021-07-23 05:12:22', 'Pendiente', '', '', 1, 19, NULL, NULL),
('2021-07-23 17:27:51', 'Pendiente', '', '', 1, 29, NULL, NULL),
('2021-07-23 18:02:55', 'Resuelto', 'la trasnfiero por que pinta', 'era un probleam de identacion', 1, 20, 12345, '2021-07-23 18:05:03'),
('2021-07-23 19:03:03', 'Transferido', 'transfiero', 'intentando resolverla', 1, 23, 12345, '2021-07-23 19:15:36'),
('2021-07-23 19:04:01', 'Pendiente', '', '', 2, 23, NULL, NULL),
('2021-07-23 19:25:23', 'Resuelto', 'ya entendi el problema', 'testeando final', 1, 24, 12345, '2021-07-23 20:08:29'),
('2021-07-23 19:25:54', 'Resuelto', '', 'a ver si funciona', 1, 24, 12345, '2021-07-23 20:11:15'),
('2021-07-23 20:11:57', 'Transferido', 'le tengo fe', '', 1, 25, 12345, '2021-07-23 20:12:34'),
('2021-07-23 20:12:34', 'Resuelto', '', 'la resolvi y funciono bien', 1, 25, 12345, '2021-07-23 20:13:13'),
('2021-07-24 21:38:56', 'Transferido', 'mostrando trasnferencia', '', 1, 26, 12345, '2021-07-24 21:39:40'),
('2021-07-25 13:52:42', 'Pendiente', '', '', 1, 35, NULL, NULL),
('2021-07-25 13:59:47', 'Transferido', 'transfiero a calidad por que no se resolvio a tiempo', '', 1, 36, 12345, '2021-07-29 14:04:53'),
('2021-07-26 21:35:54', 'Transferido', 'transfiero otra ves a calidad', '', 1, 28, 12345, '2021-07-26 21:44:21'),
('2021-07-26 21:42:21', 'Transferido', 'transfiero nuevamente a helpdesk', '', 2, 28, 33333333, '2021-07-26 21:43:49'),
('2021-07-26 21:43:49', 'Transferido', 'transfiero otra ves a calidad', '', 1, 28, 12345, '2021-07-26 21:46:43'),
('2021-07-26 21:46:43', 'Transferido', 'transfiero por ultima ves a helpdesk', '', 2, 28, 33333333, '2021-07-26 21:47:33'),
('2021-07-26 21:47:33', 'Transferido', 'esta si es la ultima ves dale resolvela vago', '', 1, 28, 12345, '2021-07-26 21:48:05'),
('2021-07-26 21:48:05', 'Resuelto', '', 'resuelvo la solicitud en calidad no tengo otra opcion', 2, 28, 33333333, '2021-07-26 21:48:52'),
('2021-07-27 17:37:37', 'Transferido', 'transfiero 1 ves', '', 1, 30, 12345, '2021-07-27 17:38:07'),
('2021-07-27 17:38:07', 'Transferido', '', '', 2, 30, 33333333, '2021-07-27 17:48:03'),
('2021-07-27 17:48:03', 'Transferido', 'transfiero calidad 2 ves', '', 1, 30, 12345, '2021-07-27 17:48:40'),
('2021-07-27 17:48:40', 'Transferido', 'transfiero a help desk', '', 2, 30, 33333333, '2021-07-27 17:49:10'),
('2021-07-27 17:49:10', 'Transferido', 'transfiero a calidad 3 ves', '', 1, 30, 12345, '2021-07-27 17:49:31'),
('2021-07-27 17:49:31', 'Transferido', 'transfiero help desk', '', 2, 30, 33333333, '2021-07-27 17:49:47'),
('2021-07-27 17:49:47', 'Transferido', 'transfiero calidad 4ta ves', '', 1, 30, 12345, '2021-07-27 17:50:17'),
('2021-07-27 17:50:17', 'Transferido', 'transfiero 5ta ves', '', 2, 30, 33333333, '2021-07-27 17:51:37'),
('2021-07-27 17:51:37', 'Pendiente', '', '', 1, 30, NULL, NULL),
('2021-07-27 21:29:09', 'Transferido', 'transfiero a atencion al cliente', '', 1, 31, 12345, '2021-07-27 21:29:50'),
('2021-07-27 21:29:50', 'Transferido', 'transfiero a gestion', '', 13, 31, 777, '2021-07-27 21:45:13'),
('2021-07-27 21:45:13', 'Transferido', 'transfiero a atencion al cliente', '', 2, 31, 33333333, '2021-07-27 21:48:03'),
('2021-07-27 21:48:03', 'Resuelto', '', 'Resuelvo el problema, soy leo messi', 13, 31, 777, '2021-07-27 21:49:06'),
('2021-07-28 16:43:05', 'Transferido', 'resolvelo en ventas loco', '', 1, 32, 44906895, '2021-07-28 17:14:19'),
('2021-07-28 17:14:19', 'Resuelto', '', 'tenes que juntar 50 mil pesos', 14, 32, 98989898, '2021-07-28 17:16:00'),
('2021-07-29 00:52:04', 'Transferido', 'solucione el problema', '', 1, 33, 12345, '2021-07-29 00:53:02'),
('2021-07-29 00:53:02', 'Transferido', 'fhc', '', 2, 33, 33333333, '2021-07-29 00:53:39'),
('2021-07-29 00:53:39', 'Resuelto', '', 'desenchufe y vuelva a enchufar', 13, 33, 777, '2021-07-29 00:55:36'),
('2021-07-29 13:40:03', 'Transferido', 'resolver esta consulta ', '', 1, 34, 12345, '2021-07-29 13:43:08'),
('2021-07-29 14:04:53', 'Resuelto', '', 'Corte el gas, aunque ya es demasiado tarde', 2, 36, 33333333, '2021-07-29 14:07:28'),
('2021-07-29 14:36:09', 'Transferido', 'transfiero a ventas para mejor asesoracion ', '', 1, 37, 12345, '2021-07-29 14:39:12'),
('2021-07-29 14:39:12', 'Pendiente', '', '', 14, 37, NULL, NULL),
('2021-07-29 14:44:21', 'Transferido', 'transfiero a ventas', '', 1, 38, 12345, '2021-07-29 14:45:18'),
('2021-07-29 14:45:18', 'Transferido', 'transfiero a atencion al cliente ', '', 14, 38, 98989898, '2021-07-29 14:45:40'),
('2021-07-29 14:45:40', 'Transferido', 'transfiero de nuevo a ventas ', '', 13, 38, 777, '2021-07-29 14:46:38'),
('2021-07-29 14:46:38', 'Transferido', 'transfiero a calidad ', '', 14, 38, 98989898, '2021-07-29 14:46:57'),
('2021-07-29 14:46:57', 'Transferido', 'transfiero a helpdesk', '', 2, 38, 33333333, '2021-07-29 14:49:26'),
('2021-07-29 14:49:26', 'Pendiente', '', '', 1, 38, NULL, NULL),
('2021-07-29 15:27:53', 'Transferido', 'transfiero a reciclados', '', 1, 39, 12345, '2021-07-29 15:33:25'),
('2021-07-29 15:33:25', 'Transferido', 'transfiero a atencion al cliente', '', 15, 39, 777, '2021-07-29 15:35:08'),
('2021-07-29 15:35:08', 'Transferido', 'transferir a ventas', '', 13, 39, 777, '2021-07-29 15:36:02'),
('2021-07-29 15:36:02', 'Transferido', 'transfiero a helpdesk', '', 14, 39, 98989898, '2021-07-29 15:36:25'),
('2021-07-29 15:36:25', 'Transferido', 'transfiero a ventas ', '', 1, 39, 12345, '2021-07-29 15:36:55'),
('2021-07-29 15:36:55', 'Transferido', 'transfiero a helpdesk', '', 14, 39, 98989898, '2021-07-29 15:39:48'),
('2021-07-29 15:39:48', 'Pendiente', '', '', 1, 39, NULL, NULL);

--
-- Disparadores `historial`
--
DELIMITER $$
CREATE TRIGGER `TRG_historial_INSERT` AFTER INSERT ON `historial` FOR EACH ROW BEGIN
DECLARE cantidad int;
SELECT count(*) into cantidad FROM historial WHERE id_solicitud = NEW.id_solicitud AND estado="Transferido";
if(cantidad>=4)
then 
call insertarNotificacion("Se transfirio 4 o mas veces esta solicitud",NEW.fecha_ingreso,NEW.id_solicitud,NEW.id_area);
end if;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id_notificacion` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `estado` varchar(200) NOT NULL,
  `fecha_historial` datetime DEFAULT NULL,
  `id_solicitud_historial` int(11) NOT NULL,
  `id_area_historial` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `notificacion`
--

INSERT INTO `notificacion` (`id_notificacion`, `fecha`, `descripcion`, `estado`, `fecha_historial`, `id_solicitud_historial`, `id_area_historial`) VALUES
(1, '2021-07-26 23:34:37', 'probando notificacion', 'productivo', '2021-05-18 14:57:21', 1, 1),
(2, '2021-07-27 17:25:21', 'esta solicitud paso mas de 15 dias sin resolverse', 'no visto', NULL, 1, NULL),
(3, '2021-07-27 17:35:53', 'Esta solicitud paso mas de 36 horas sin resolverse o tranferirse', 'no visto', '2021-07-23 17:27:51', 29, 1),
(4, '2021-07-27 17:51:37', 'Se transfirio 4 o mas veces esta solicitud', 'no visto', '2021-07-27 17:51:37', 30, 1),
(6, '2021-07-29 14:02:23', 'Esta solicitud paso mas de 36 horas sin resolverse o tranferirse', 'no visto', '2021-07-25 13:52:42', 35, 1),
(7, '2021-07-29 14:02:23', 'Esta solicitud paso mas de 36 horas sin resolverse o tranferirse', 'no visto', '2021-07-25 13:59:47', 36, 1),
(10, '2021-07-29 14:49:26', 'Se transfirio 4 o mas veces esta solicitud', 'no visto', '2021-07-29 14:49:26', 38, 1),
(11, '2021-07-29 15:37:33', 'Esta solicitud paso mas de 36 horas sin resolverse o tranferirse', 'no visto', '2021-07-23 17:27:51', 29, 1),
(12, '2021-07-29 15:37:33', 'Esta solicitud paso mas de 36 horas sin resolverse o tranferirse', 'no visto', '2021-07-25 13:52:42', 35, 1),
(13, '2021-07-29 15:39:48', 'Se transfirio 4 o mas veces esta solicitud', 'no visto', '2021-07-29 15:39:48', 39, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud`
--

CREATE TABLE `solicitud` (
  `id_solicitud` int(11) NOT NULL,
  `ticket` bigint(20) NOT NULL,
  `prioridad` varchar(200) DEFAULT NULL,
  `fecha_solicitud` datetime NOT NULL,
  `detalle` varchar(200) NOT NULL,
  `tipo` varchar(200) NOT NULL,
  `dni_cliente` bigint(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `solicitud`
--

INSERT INTO `solicitud` (`id_solicitud`, `ticket`, `prioridad`, `fecha_solicitud`, `detalle`, `tipo`, `dni_cliente`) VALUES
(1, 15456745, 'Media', '2021-05-18 13:15:45', 'necesito que me re incorporen el servicio porque no tengo internet hace varios dias', 'reclamo', 5156454),
(12, 7959715, 'Alta', '2021-07-22 22:06:43', 'test 3', 'consulta', 40595561),
(13, 2272808, 'Media', '2021-07-23 00:48:00', 'probando moment fecha', 'baja', 40595561),
(14, 7128389, 'Media', '2021-07-23 00:50:28', 'kjbh', 'reclamo', 40595561),
(15, 6750297, 'Baja', '2021-07-23 02:17:51', 'probando', 'consulta', 40595561),
(16, 8212057, 'Media', '2021-07-23 04:07:43', 'probando historial transfer', 'consulta', 40595561),
(17, 5250910, 'Media', '2021-07-23 04:15:28', 'probando definitivo', 'consulta', 40595561),
(18, 1710980, 'Alta', '2021-07-23 04:49:08', 'quiero cortar la luz', 'baja', 40595561),
(19, 5102125, 'Baja', '2021-07-23 05:12:22', 'asafgdhjkjhrgey', 'baja', 40595561),
(20, 6834012, 'Alta', '2021-07-23 18:02:55', 'problemas con vista solicutudes', 'consulta', 123456789),
(23, 1174808, 'Media', '2021-07-23 19:23:17', 'prueba historial4', 'baja', 123456789),
(24, 5075762, 'Alta', '2021-07-23 19:25:23', 'ya entendi el problemita', 'consulta', 123456789),
(25, 1694334, 'Alta', '2021-07-23 20:11:57', 'probar nueva solicitud', 'baja', 123456789),
(26, 5205521, 'Baja', '2021-07-24 21:38:56', 'muestro', 'baja', 123456789),
(27, 6140829, 'Media', '2021-07-25 04:06:26', '123', 'consulta', 123456789),
(28, 8691620, 'Media', '2021-07-26 21:35:54', 'solicitud de prueba', 'consulta', 123456789),
(29, 8803412, 'Alta', '2021-07-24 17:27:51', 'probando 36hs', 'consulta', 123456789),
(30, 9472812, 'Media', '2021-07-27 17:37:37', 'transferir mas de 4 veces', 'baja', 123456789),
(31, 7584461, 'Baja', '2021-07-27 21:29:09', 'consulta para leomessi', 'consulta', 123456789),
(32, 4441208, 'Media', '2021-07-28 16:43:05', 'compra de celular samsung A30', 'consulta', 45695385),
(33, 1318333, 'Media', '2021-07-29 00:52:04', 'no funciona mi heladera', 'reclamo', 45695385),
(34, 9526483, 'Alta', '2021-07-29 13:40:03', 'quiero dar la baja de mi servicio claro', 'baja', 45695385),
(35, 1081819, 'Alta', '2021-07-25 13:52:42', 'no me funciona el lavarropas', 'consulta', 45695385),
(36, 5790703, 'Alta', '2021-07-25 13:59:47', 'tengo un perdida de gas', 'consulta', 45695385),
(37, 3830040, 'Media', '2021-07-29 14:36:09', 'Tengo problemas con mi ford ka', 'reclamo', 11),
(38, 1113857, 'Alta', '2021-07-29 14:44:21', 'quiero que me corten megacable urgente!!! ', 'baja', 11),
(39, 4834670, 'Alta', '2021-07-29 15:27:53', 'solicitud profe fernando', 'consulta', 565812);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`id_area`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`dni`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`dni`),
  ADD KEY `id_areaEmp` (`id_area`);

--
-- Indices de la tabla `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`fecha_ingreso`,`id_area`,`id_solicitud`),
  ADD KEY `id_solicitud` (`id_solicitud`),
  ADD KEY `id` (`id_area`),
  ADD KEY `dni_empleado` (`dni_empleado`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `fk_not_hist_area` (`id_area_historial`),
  ADD KEY `fk_not_hist_fecha` (`fecha_historial`),
  ADD KEY `fk_not_hist_solicitud` (`id_solicitud_historial`);

--
-- Indices de la tabla `solicitud`
--
ALTER TABLE `solicitud`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `dni_cliente` (`dni_cliente`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `area`
--
ALTER TABLE `area`
  MODIFY `id_area` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `solicitud`
--
ALTER TABLE `solicitud`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `id_areaEmp` FOREIGN KEY (`id_area`) REFERENCES `area` (`id_area`);

--
-- Filtros para la tabla `historial`
--
ALTER TABLE `historial`
  ADD CONSTRAINT `dni_empleado` FOREIGN KEY (`dni_empleado`) REFERENCES `empleado` (`dni`),
  ADD CONSTRAINT `id` FOREIGN KEY (`id_area`) REFERENCES `area` (`id_area`),
  ADD CONSTRAINT `id_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud` (`id_solicitud`);

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `fk_not_hist_area` FOREIGN KEY (`id_area_historial`) REFERENCES `historial` (`id_area`),
  ADD CONSTRAINT `fk_not_hist_fecha` FOREIGN KEY (`fecha_historial`) REFERENCES `historial` (`fecha_ingreso`),
  ADD CONSTRAINT `fk_not_hist_solicitud` FOREIGN KEY (`id_solicitud_historial`) REFERENCES `historial` (`id_solicitud`);

--
-- Filtros para la tabla `solicitud`
--
ALTER TABLE `solicitud`
  ADD CONSTRAINT `dni_cliente` FOREIGN KEY (`dni_cliente`) REFERENCES `cliente` (`dni`);

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`localhost` EVENT `CADA24HS` ON SCHEDULE EVERY 24 HOUR STARTS '2021-07-27 17:11:37' ON COMPLETION NOT PRESERVE DISABLE DO CALL notificaMas15()$$

CREATE DEFINER=`root`@`localhost` EVENT `CADA24HS2` ON SCHEDULE EVERY 24 HOUR STARTS '2021-07-27 17:12:41' ON COMPLETION NOT PRESERVE DISABLE DO CALL notificaPrioridad()$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
