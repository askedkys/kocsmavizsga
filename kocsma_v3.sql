-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Máj 05. 13:47
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `kocsma_v3`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `alkoholositalokraktar`
--

CREATE TABLE `alkoholositalokraktar` (
  `ItalId` int(11) NOT NULL,
  `Nev` longtext NOT NULL,
  `Mennyiseg` int(11) NOT NULL,
  `Ar` decimal(18,2) NOT NULL,
  `Alkoholszazalek` double NOT NULL,
  `Szarmazas` longtext NOT NULL,
  `Kiszereles` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `alkoholositalokraktar`
--

INSERT INTO `alkoholositalokraktar` (`ItalId`, `Nev`, `Mennyiseg`, `Ar`, `Alkoholszazalek`, `Szarmazas`, `Kiszereles`) VALUES
(1, 'Pálinka Szilva', 47, 2200.00, 40, 'Magyarország', 0.5),
(2, 'Pálinka Barack', 60, 2300.00, 40, 'Magyarország', 0.5),
(3, 'Pálinka Körte', 55, 2100.00, 40, 'Magyarország', 0.5),
(4, 'Unicum', 80, 3000.00, 40, 'Magyarország', 0.7),
(5, 'Zwack', 69, 2800.00, 40, 'Magyarország', 0.7),
(6, 'Tokaji Aszú', 30, 9500.00, 12, 'Magyarország', 0.5),
(7, 'Egri Bikavér', 30, 3200.00, 14, 'Magyarország', 0.75),
(8, 'Villányi Vörös', 50, 3500.00, 13, 'Magyarország', 0.75),
(9, 'Soproni Sör', 200, 500.00, 5, 'Magyarország', 0.5),
(10, 'Dreher Sör', 180, 550.00, 5, 'Magyarország', 0.5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznaloadatok`
--

CREATE TABLE `felhasznaloadatok` (
  `Id` int(11) NOT NULL,
  `Nev` longtext NOT NULL,
  `Felhasznalonev` longtext NOT NULL,
  `Email` longtext NOT NULL,
  `Jelszo` longtext NOT NULL,
  `IsAdmin` tinyint(1) NOT NULL,
  `KocsmaId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `felhasznaloadatok`
--

INSERT INTO `felhasznaloadatok` (`Id`, `Nev`, `Felhasznalonev`, `Email`, `Jelszo`, `IsAdmin`, `KocsmaId`) VALUES
(1, 'admin', 'admin', 'admin@gmail.com', 'admin123', 1, NULL),
(2, 'Hawer', 'haver1', 'haver@gmail.com', 'haver1', 0, NULL),
(3, 'Forgács Terasz', 'forgacs1', 'forgacs1@gmail.com', 'forgacs1', 0, 1),
(4, 'Mester Márton', 'mestermarton', 'mester@gmail.com', 'mester123', 0, NULL),
(5, 'asd', 'asd', 'asd@gmail.com', 'asd123', 0, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kocsmak`
--

CREATE TABLE `kocsmak` (
  `KocsmaId` int(11) NOT NULL,
  `Nev` longtext NOT NULL,
  `Cim` longtext NOT NULL,
  `Telefon` longtext NOT NULL,
  `TulajFelhasznalo` longtext NOT NULL,
  `Hetfo` longtext DEFAULT NULL,
  `Kedd` longtext DEFAULT NULL,
  `Szerda` longtext DEFAULT NULL,
  `Csutortok` longtext DEFAULT NULL,
  `Pentek` longtext DEFAULT NULL,
  `Szombat` longtext DEFAULT NULL,
  `Vasarnap` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kocsmak`
--

INSERT INTO `kocsmak` (`KocsmaId`, `Nev`, `Cim`, `Telefon`, `TulajFelhasznalo`, `Hetfo`, `Kedd`, `Szerda`, `Csutortok`, `Pentek`, `Szombat`, `Vasarnap`) VALUES
(1, 'Forgács Terasz', '8100 Várpalota, Körmöcbánya utca 3.', '+36 20 111 1111', 'forgacs1', '06-22', '06-22', '06-22', '06-22', '06-24', '07-24', '07-22'),
(2, 'Bácska', '8100 Várpalota, Erdődy Pálffy Tamás utca 1.', '+36 20 222 2222', 'bacska1', '10-22', '10-22', '10-22', '10-22', '10-23', '10-23', '10-20'),
(3, 'Alagsor', '8100 Várpalota, Szent István utca 14.', '+36 20 333 3333', 'alagsor1', 'Zárva', '16-24', '16-24', '16-24', '16-02', '16-02', 'Zárva'),
(4, 'Piroska Borozó', '8100 Várpalota, Bátorkő utca 11.', '+36 20 444 4444', 'piroska1', '15-23', '15-23', '15-23', '15-23', '15-01', '15-01', 'Zárva'),
(5, 'Mátyás Borozó', '8100 Várpalota, Rózsakút utca 22.', '+36 20 555 5555', 'matyas1', 'Zárva', '16-23', '16-23', '16-23', '16-02', '16-02', '16-22'),
(6, 'Glória Presszó', '8100 Várpalota, Erdődy Pálffy Tamás utca 21-19.', '+36 20 666 6666', 'gloria1', '08-20', '08-20', '08-20', '08-20', '08-22', '10-22', '10-18'),
(7, 'Héttéteres Söröző', '8100 Várpalota, Gárdonyi Géza utca 37/6.', '+36 20 777 7777', 'hetmeteres1', '16-24', '16-24', '16-24', '16-24', '16-02', '14-02', '14-22'),
(8, 'Böllér Söröző', '8100 Várpalota, Radnóti Miklós utca 44.', '+36 20 888 8888', 'boller1', 'Zárva', '15-23', '15-23', '15-23', '15-01', '15-01', '15-22');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kocsmaraktar`
--

CREATE TABLE `kocsmaraktar` (
  `RaktarId` int(11) NOT NULL,
  `KocsmaId` int(11) NOT NULL,
  `ItalId` int(11) NOT NULL,
  `Mennyiseg` int(11) NOT NULL,
  `Ar` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `__efmigrationshistory`
--

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20260304102021_kocsma', '8.0.20');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `alkoholositalokraktar`
--
ALTER TABLE `alkoholositalokraktar`
  ADD PRIMARY KEY (`ItalId`);

--
-- A tábla indexei `felhasznaloadatok`
--
ALTER TABLE `felhasznaloadatok`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_FelhasznaloAdatok_KocsmaId` (`KocsmaId`);

--
-- A tábla indexei `kocsmak`
--
ALTER TABLE `kocsmak`
  ADD PRIMARY KEY (`KocsmaId`);

--
-- A tábla indexei `kocsmaraktar`
--
ALTER TABLE `kocsmaraktar`
  ADD PRIMARY KEY (`RaktarId`),
  ADD KEY `IX_KocsmaRaktar_ItalId` (`ItalId`),
  ADD KEY `IX_KocsmaRaktar_KocsmaId` (`KocsmaId`);

--
-- A tábla indexei `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `alkoholositalokraktar`
--
ALTER TABLE `alkoholositalokraktar`
  MODIFY `ItalId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT a táblához `felhasznaloadatok`
--
ALTER TABLE `felhasznaloadatok`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `kocsmak`
--
ALTER TABLE `kocsmak`
  MODIFY `KocsmaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `kocsmaraktar`
--
ALTER TABLE `kocsmaraktar`
  MODIFY `RaktarId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `felhasznaloadatok`
--
ALTER TABLE `felhasznaloadatok`
  ADD CONSTRAINT `FK_FelhasznaloAdatok_Kocsmak_KocsmaId` FOREIGN KEY (`KocsmaId`) REFERENCES `kocsmak` (`KocsmaId`);

--
-- Megkötések a táblához `kocsmaraktar`
--
ALTER TABLE `kocsmaraktar`
  ADD CONSTRAINT `FK_KocsmaRaktar_AlkoholosItalokRaktar_ItalId` FOREIGN KEY (`ItalId`) REFERENCES `alkoholositalokraktar` (`ItalId`),
  ADD CONSTRAINT `FK_KocsmaRaktar_Kocsmak_KocsmaId` FOREIGN KEY (`KocsmaId`) REFERENCES `kocsmak` (`KocsmaId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
