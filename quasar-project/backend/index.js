import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Spajanje na MySQL bazu
const connection = mysql.createConnection({
  host: "ucka.veleri.hr",
  user: "szaharija",
  password: "11",
  database: "szaharija",
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error("Greška pri spajanju na bazu:", err);
    return;
  }

  console.log("Connected to DB");
});


// =========================
// GET svi događaji
// =========================
app.get("/api/dogadaji", (req, res) => {
  connection.query(
    "SELECT * FROM dogadaj ORDER BY datum_dogadaja DESC",
    (error, results) => {
      if (error) {
        console.error("SQL ERROR:", error);

        return res.status(500).json({
          error: "Greška pri dohvaćanju događaja"
        });
      }

      res.json(results);
    }
  );
});


// =========================
// POST novi događaj
// =========================
app.post("/api/dogadaji", (req, res) => {

  const {
    datum_dogadaja,
    vrijeme_dogadaja,
    lokacija_dogadaja,
    opis_dogadaja
  } = req.body;

  // Provjera podataka
  if (
    !datum_dogadaja ||
    !vrijeme_dogadaja ||
    !lokacija_dogadaja ||
    !opis_dogadaja
  ) {
    return res.status(400).json({
      error: "Sva polja su obavezna"
    });
  }

  connection.query(
    `
    INSERT INTO dogadaj
    (
      datum_dogadaja,
      vrijeme_dogadaja,
      lokacija_dogadaja,
      opis_dogadaja
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      datum_dogadaja,
      vrijeme_dogadaja,
      lokacija_dogadaja,
      opis_dogadaja
    ],
    (error, result) => {

      if (error) {
        console.error("SQL ERROR:", error);

        return res.status(500).json({
          error: "Greška pri unosu događaja"
        });
      }

      res.json({
        message: "Događaj uspješno dodan",
        id: result.insertId
      });
    }
  );
});


// =========================
// GET rezervacije po događaju
// =========================
app.get("/api/rezervacije/:sifraDogadaja", (req, res) => {

  const sifraDogadaja = req.params.sifraDogadaja;

  connection.query(
    "SELECT * FROM Rezervacija WHERE Sifra_dogadaja = ?",
    [sifraDogadaja],
    (error, results) => {

      if (error) {
        console.error("SQL ERROR:", error);

        return res.status(500).json({
          error: "Greška pri dohvaćanju rezervacija"
        });
      }

      res.json(results);
    }
  );
});


// Pokretanje servera
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});