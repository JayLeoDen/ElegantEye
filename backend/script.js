const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "ucka.veleri.hr",
  user: "szaharija",
  password: "11",
  database: "szaharija",
  port: 3306
});

connection.connect(err => {
  if (err) throw err;
  console.log("Connected to DB");
});

// =====================
// DROPDOWN ENDPOINTI
// =====================

// Klijenti
app.get("/api/klijenti", (req, res) => {
  connection.query("SELECT Sifra_klijenta FROM Klijent", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results.map(r => r.Sifra_klijenta));
  });
});

// Događaji
app.get("/api/dogadaji", (req, res) => {
  connection.query("SELECT Sifra_dogadaja FROM Dogadaj", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results.map(r => r.Sifra_dogadaja));
  });
});

// Usluge
app.get("/api/usluge", (req, res) => {
  connection.query("SELECT Usluga_ID FROM Usluga", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results.map(r => r.Usluga_ID));
  });
});

// =====================
// REZERVACIJE
// =====================

// Dohvat svih rezervacija
app.get("/api/rezervacije", (req, res) => {
  connection.query("SELECT * FROM Rezervacija", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// Dodavanje nove rezervacije (auto-increment)
app.post("/api/rezervacije", (req, res) => {
  const { Sifra_klijenta, Sifra_dogadaja, Usluga_ID, Napomena } = req.body;

  if (!Sifra_klijenta || !Sifra_dogadaja || !Usluga_ID) {
    return res.status(400).json({ error: "Obavezna polja: klijent, događaj i usluga" });
  }

  connection.query(
    `INSERT INTO Rezervacija (Sifra_klijenta, Sifra_dogadaja, Usluga_ID, Napomena)
     VALUES (?, ?, ?, ?)`,
    [Number(Sifra_klijenta), Number(Sifra_dogadaja), Number(Usluga_ID), Napomena || null],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.sqlMessage });
      res.json({ message: "Rezervacija dodana", id: results.insertId });
    }
  );
});

// Brisanje rezervacije po ID-u
app.delete("/api/rezervacije/:id", (req, res) => {
  const id = Number(req.params.id);
  connection.query(
    "DELETE FROM Rezervacija WHERE Sifra_rezervacije = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json({ message: "Rezervacija obrisana" });
    }
  );
});

// =====================
// SERVER
// =====================
app.listen(port, () => {
  console.log("Server running at port: " + port);
});
