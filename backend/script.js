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

// Dohvat svih rezervacija
app.get("/api/rezervacije", (req, res) => {
  connection.query("SELECT * FROM Rezervacija", (error, results) => {
    if (error) {
      console.error("SQL ERROR:", error);
      return res.status(500).json({ error: error.sqlMessage });
    }
    res.json(results);
  });
});

// Dohvat rezervacije po ID-u
app.get("/api/rezervacije/:id", (req, res) => {
  const id = Number(req.params.id);
  connection.query(
    "SELECT * FROM Rezervacija WHERE Sifra_rezervacije = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error("SQL ERROR:", error);
        return res.status(500).json({ error: error.sqlMessage });
      }
      res.json(results[0]);
    }
  );
});

// Dodavanje nove rezervacije (Sifra_rezervacije ručno)
app.post("/api/rezervacije", (req, res) => {
  const { Sifra_rezervacije, Sifra_klijenta, Sifra_dogadaja, Usluga_ID, Napomena } = req.body;

  if (!Sifra_rezervacije || !Sifra_klijenta || !Sifra_dogadaja || !Usluga_ID) {
    return res.status(400).json({ error: "Obavezna polja: šifra rezervacije, klijenta, događaja i usluge" });
  }

  connection.query(
    `INSERT INTO Rezervacija
     (Sifra_rezervacije, Sifra_klijenta, Sifra_dogadaja, Usluga_ID, Napomena)
     VALUES (?, ?, ?, ?, ?)`,
    [Number(Sifra_rezervacije), Number(Sifra_klijenta), Number(Sifra_dogadaja), Number(Usluga_ID), Napomena || null],
    (error, results) => {
      if (error) {
        console.error("SQL ERROR:", error);
        return res.status(500).json({ error: error.sqlMessage });
      }
      res.json({ message: "Rezervacija dodana", id: Sifra_rezervacije });
    }
  );
});

// Ažuriranje rezervacije
app.put("/api/rezervacije/:id", (req, res) => {
  const id = Number(req.params.id);
  const { Sifra_klijenta, Sifra_dogadaja, Usluga_ID, Napomena } = req.body;

  connection.query(
    `UPDATE Rezervacija
     SET Sifra_klijenta=?, Sifra_dogadaja=?, Usluga_ID=?, Napomena=?
     WHERE Sifra_rezervacije=?`,
    [Number(Sifra_klijenta), Number(Sifra_dogadaja), Number(Usluga_ID), Napomena || null, id],
    (error, results) => {
      if (error) {
        console.error("SQL ERROR:", error);
        return res.status(500).json({ error: error.sqlMessage });
      }
      res.json({ message: "Rezervacija ažurirana" });
    }
  );
});

// Brisanje rezervacije
app.delete("/api/rezervacije/:id", (req, res) => {
  const id = Number(req.params.id);
  connection.query(
    "DELETE FROM Rezervacija WHERE Sifra_rezervacije = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error("SQL ERROR:", error);
        return res.status(500).json({ error: error.sqlMessage });
      }
      res.json({ message: "Rezervacija obrisana" });
    }
  );
});

app.listen(port, () => {
  console.log("Server running at port: " + port);
});
