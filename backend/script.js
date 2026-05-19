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

app.get("/api/klijenti", (req, res) => {
  connection.query("SELECT korisnik_id FROM rezervacija_korisnika", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results.map(r => r.korisnik_id));
  });
});

app.get("/api/dogadaji", (req, res) => {
  connection.query("SELECT dogadaj_id FROM rezervacija_korisnika", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results.map(r => r.dogadaj_id));
  });
});

app.get("/api/usluge", (req, res) => {
  connection.query("SELECT usluga_id FROM rezervacija_korisnika", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results.map(r => r.usluga_id));
  });
});

app.get("/api/rezervacije", (req, res) => {
  connection.query("SELECT * FROM rezervacija_korisnika", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

app.post("/api/rezervacije", (req, res) => {
  const { korisnik_id, dogadaj_id, usluga_id, napomena_rezervacije } = req.body;

  if (!korisnik_id || !dogadaj_id || !usluga_id) {
    return res.status(400).json({ error: "Obavezna polja: klijent, događaj i usluga" });
  }

  connection.query(
    `INSERT INTO rezervacija_korisnika (korisnik_id, dogadaj_id, usluga_id, napomena_rezervacije)
     VALUES (?, ?, ?, ?)`,
    [Number(korisnik_id), Number(dogadaj_id), Number(usluga_id), napomena_rezervacije || null],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.sqlMessage });
      res.json({ message: "Rezervacija dodana", id: results.insertId });
    }
  );
});

app.delete("/api/rezervacije/:id", (req, res) => {
  const id = Number(req.params.id);
  connection.query(
    "DELETE FROM rezervacija_korisnika WHERE rezervacija_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json({ message: "Rezervacija obrisana" });
    }
  );
});

app.listen(port, () => {
  console.log("Server running at port: " + port);
});
