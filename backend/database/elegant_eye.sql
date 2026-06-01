CREATE DATABASE IF NOT EXISTS elegant_eye CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elegant_eye;

CREATE TABLE IF NOT EXISTS administrator (
  administrator_id INT PRIMARY KEY AUTO_INCREMENT,
  email_adresa_administratora VARCHAR(100) UNIQUE NOT NULL,
  lozinka_administratora VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS korisnik (
  korisnik_id INT PRIMARY KEY AUTO_INCREMENT,
  ime_korisnika VARCHAR(50) NOT NULL,
  prezime_korisnika VARCHAR(50) NOT NULL,
  email_adresa_korisnika VARCHAR(100) UNIQUE NOT NULL,
  lozinka_korisnika VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS snimatelj_fotograf (
  fotograf_snimatelj_id INT PRIMARY KEY AUTO_INCREMENT,
  ime_fotografa_snimatelja VARCHAR(50) NOT NULL,
  prezime_fotografa_snimatelja VARCHAR(50) NOT NULL,
  email_adresa_fotografa_snimatelja VARCHAR(100) UNIQUE NOT NULL,
  lozinka_fotografa_snimatelja VARCHAR(255) NOT NULL,
  opis_rada_fotografa_snimatelja VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS usluga (
  usluga_id INT PRIMARY KEY AUTO_INCREMENT,
  naziv_nove_usluge VARCHAR(100) NOT NULL,
  opis_nove_usluge VARCHAR(500),
  cijena_nove_usluge DECIMAL(10,2) NOT NULL DEFAULT 0,
  trajanje_nove_usluge VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS dogadaj (
  dogadaj_id INT PRIMARY KEY AUTO_INCREMENT,
  datum_dogadaja DATE NOT NULL,
  vrijeme_dogadaja TIME NOT NULL,
  lokacija_dogadaja VARCHAR(150) NOT NULL,
  opis_dogadaja VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS rezervacija_korisnika (
  rezervacija_id INT PRIMARY KEY AUTO_INCREMENT,
  korisnik_id INT NOT NULL,
  fotograf_snimatelj_id INT NOT NULL,
  usluga_id INT NOT NULL,
  dogadaj_id INT NOT NULL,
  datum_nove_rezervacije DATE NOT NULL,
  vrijeme_nove_rezervacije TIME NOT NULL,
  napomena_rezervacije VARCHAR(1000),
  status_rezervacije VARCHAR(20) NOT NULL DEFAULT 'na cekanju',
  FOREIGN KEY (korisnik_id) REFERENCES korisnik(korisnik_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (fotograf_snimatelj_id) REFERENCES snimatelj_fotograf(fotograf_snimatelj_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (usluga_id) REFERENCES usluga(usluga_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (dogadaj_id) REFERENCES dogadaj(dogadaj_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS portfolio_stavka (
  portfolio_id INT PRIMARY KEY AUTO_INCREMENT,
  fotograf_snimatelj_id INT NOT NULL,
  naziv_rada VARCHAR(100) NOT NULL,
  opis_rada VARCHAR(500),
  medij VARCHAR(255) NOT NULL,
  datum_objave DATE NOT NULL,
  datum_izmjene DATE,
  FOREIGN KEY (fotograf_snimatelj_id) REFERENCES snimatelj_fotograf(fotograf_snimatelj_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS dostupnost (
  dostupnost_id INT PRIMARY KEY AUTO_INCREMENT,
  fotograf_snimatelj_id INT NOT NULL,
  datum_dostupnosti DATE NOT NULL,
  vrijeme_dostupnosti TIME NOT NULL,
  status_dostupnosti VARCHAR(20) NOT NULL DEFAULT 'slobodan',
  FOREIGN KEY (fotograf_snimatelj_id) REFERENCES snimatelj_fotograf(fotograf_snimatelj_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS obavijest (
  obavijest_id INT PRIMARY KEY AUTO_INCREMENT,
  fotograf_snimatelj_id INT NOT NULL,
  rezervacija_id INT NOT NULL,
  datum_obavijesti DATE NOT NULL,
  vrijeme_obavijesti TIME NOT NULL,
  status_obavijesti VARCHAR(20) NOT NULL DEFAULT 'nova',
  FOREIGN KEY (fotograf_snimatelj_id) REFERENCES snimatelj_fotograf(fotograf_snimatelj_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (rezervacija_id) REFERENCES rezervacija_korisnika(rezervacija_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS poruka_napomena (
  poruka_id INT PRIMARY KEY AUTO_INCREMENT,
  rezervacija_id INT NOT NULL,
  administrator_id INT,
  korisnik_id INT,
  fotograf_snimatelj_id INT,
  sadrzaj VARCHAR(1000) NOT NULL,
  datum DATE NOT NULL,
  vrijeme TIME NOT NULL,
  tip_poruke VARCHAR(30) NOT NULL,
  FOREIGN KEY (rezervacija_id) REFERENCES rezervacija_korisnika(rezervacija_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (administrator_id) REFERENCES administrator(administrator_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (korisnik_id) REFERENCES korisnik(korisnik_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (fotograf_snimatelj_id) REFERENCES snimatelj_fotograf(fotograf_snimatelj_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS povratna_informacija (
  povratna_informacija_id INT PRIMARY KEY AUTO_INCREMENT,
  korisnik_id INT NOT NULL,
  rezervacija_id INT NOT NULL,
  ocjena INT NOT NULL,
  komentar VARCHAR(1000),
  datum_povratne_informacije DATE NOT NULL,
  FOREIGN KEY (korisnik_id) REFERENCES korisnik(korisnik_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (rezervacija_id) REFERENCES rezervacija_korisnika(rezervacija_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT IGNORE INTO administrator (administrator_id, email_adresa_administratora, lozinka_administratora) VALUES (1, 'admin@eleganteye.hr', 'admin');
INSERT IGNORE INTO korisnik (korisnik_id, ime_korisnika, prezime_korisnika, email_adresa_korisnika, lozinka_korisnika) VALUES
(1, 'Ana', 'Marić', 'ana@gmail.com', '1234'),
(2, 'Marko', 'Korisnik', 'marko@gmail.com', '1234');
INSERT IGNORE INTO snimatelj_fotograf (fotograf_snimatelj_id, ime_fotografa_snimatelja, prezime_fotografa_snimatelja, email_adresa_fotografa_snimatelja, lozinka_fotografa_snimatelja, opis_rada_fotografa_snimatelja) VALUES
(1, 'Ivan', 'Horvat', 'ivan@studio.hr', '1234', 'Fotograf vjenčanja'),
(2, 'Ana', 'Marić', 'ana@video.hr', '1234', 'Snimatelj evenata'),
(3, 'Marko', 'Kovač', 'marko@foto.hr', '1234', 'Portreti i poslovna fotografija');
INSERT IGNORE INTO usluga (usluga_id, naziv_nove_usluge, opis_nove_usluge, cijena_nove_usluge, trajanje_nove_usluge) VALUES
(1, 'Fotografiranje vjenčanja', 'Premium paket fotografiranja vjenčanja', 850.00, '8 sati'),
(2, 'Snimanje događaja', 'Profesionalno snimanje i montaža', 600.00, '6 sati'),
(3, 'Foto + video paket', 'Kombinirana usluga fotografiranja i snimanja', 1200.00, '10 sati');
INSERT IGNORE INTO dogadaj (dogadaj_id, datum_dogadaja, vrijeme_dogadaja, lokacija_dogadaja, opis_dogadaja) VALUES
(1, '2026-06-15', '15:00:00', 'Hotel Bonavia', 'Vjenčanje');
INSERT IGNORE INTO portfolio_stavka (portfolio_id, fotograf_snimatelj_id, naziv_rada, opis_rada, medij, datum_objave) VALUES
(1, 1, 'Vjenčanje Ana', 'Ceremonija i portreti', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900', CURDATE()),
(2, 2, 'Event video', 'Video produkcija eventa', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900', CURDATE());
