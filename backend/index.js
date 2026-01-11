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

app.get("/api/fotografi", (req, res) => {
  connection.query("SELECT * FROM Fotograf_Snimatelj", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/api/fotografi/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM Fotograf_Snimatelj WHERE MB_fotografa_snimatelja = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.json(results[0]);
    }
  );
});

app.post("/api/fotografi", (req, res) => {
  const {
    id,
    ime,
    prezime,
    uloga,
    email,
    telefon,
    portfolio,
  } = req.body;

  if (!id || !ime || !prezime) {
    return res.status(400).json({ error: "MB, ime i prezime su obavezni" });
  }

  connection.query(
    `INSERT INTO Fotograf_Snimatelj
     (MB_fotografa_snimatelja, Ime_fotografa_snimatelja, Prezime_fotografa_snimatelja,
      Specijalizacija_fotografa_snimatelja, Email_fotografa_snimatelja,
      Telefon_fotografa_snimatelja, Portfolio_fotografa_snimatelja)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, ime, prezime, uloga, email, telefon, portfolio || null],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Greška pri unosu" });
      }
      res.json({ message: "Fotograf dodan" });
    }
  );
});

app.put("/api/fotografi/:id", (req, res) => {
  const id = req.params.id;
  const { ime, prezime, uloga, email, telefon, portfolio } = req.body;

  connection.query(
    `UPDATE Fotograf_Snimatelj
     SET Ime_fotografa_snimatelja=?, Prezime_fotografa_snimatelja=?,
         Specijalizacija_fotografa_snimatelja=?, Email_fotografa_snimatelja=?,
         Telefon_fotografa_snimatelja=?, Portfolio_fotografa_snimatelja=?
     WHERE MB_fotografa_snimatelja=?`,
    [ime, prezime, uloga, email, telefon, portfolio || null, id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Greška pri ažuriranju" });
      }
      res.json({ message: "Fotograf ažuriran" });
    }
  );
});

app.delete("/api/fotografi/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "DELETE FROM Fotograf_Snimatelj WHERE MB_fotografa_snimatelja = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Greška pri brisanju" });
      }
      res.json({ message: "Fotograf obrisan" });
    }
  );
});

app.post('/login', (req, res) => {
  const { korime, lozinka } = req.body;

  if (!korime || !lozinka) {
    return res.status(400).json({ message: 'Nedostaje korime ili lozinka' });
  }

  const query = 'SELECT id, korime, lozinka, uloga FROM prijava WHERE korime = ?';

  connection.query(query, [korime], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Greška na serveru' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Korisnik ne postoji' });
    }

    const user = results[0];

    if (user.lozinka !== lozinka) {
      return res.status(401).json({ message: 'Pogrešna lozinka' });
    }

    res.json({
      id: user.id,
      korime: user.korime,
      uloga: user.uloga
    });
  });
});


app.listen(port, () => {
  console.log("Server running at port: " + port);
});
