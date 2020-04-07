-- Copyright 2020 Mirco Soderi
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
-- http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.

-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Creato il: Apr 07, 2020 alle 22:29
-- Versione del server: 5.5.64-MariaDB
-- Versione PHP: 7.1.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crowdedzone`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `a` bigint(11) NOT NULL,
  `b` bigint(11) NOT NULL,
  `oid` varchar(255) NOT NULL,
  `lat` int(11) NOT NULL,
  `lon` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `infected`
--

CREATE TABLE `infected` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `infected_id` bigint(20) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `literals`
--

CREATE TABLE `literals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `realtime`
--

CREATE TABLE `realtime` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lat` int(11) NOT NULL,
  `lon` int(11) NOT NULL,
  `oid` varchar(255) NOT NULL,
  `upd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `translations`
--

CREATE TABLE `translations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `literal_id` bigint(20) UNSIGNED NOT NULL,
  `lang` varchar(255) NOT NULL,
  `translation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `trend`
--

CREATE TABLE `trend` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `oid` varchar(255) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `people` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `infected`
--
ALTER TABLE `infected`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `literals`
--
ALTER TABLE `literals`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `realtime`
--
ALTER TABLE `realtime`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oid` (`oid`);

--
-- Indici per le tabelle `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `trend`
--
ALTER TABLE `trend`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oid_index` (`oid`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;