import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2";

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
  if (err) {
    console.error("Greška pri spajanju na bazu:", err);
    return;
  }
  console.log("Connected to DB");
});

app.get("/api/dogadaji", (req, res) => {
  connection.query(
    "SELECT * FROM Dogadaj ORDER BY Datum_i_vrijeme_dogadaja DESC",
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Greška pri dohvaćanju" });
      }
      res.json(results);
    }
  );
});

app.post("/api/dogadaji", (req, res) => {
  const { tip, datumVrijeme, lokacija, opis } = req.body;

  connection.query(
    `INSERT INTO Dogadaj 
     (Tip_dogadaja, Datum_i_vrijeme_dogadaja, Lokacija_dogadaja, Opis_dogadaja)
     VALUES (?, ?, ?, ?)`,
    [tip, datumVrijeme, lokacija, opis],
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Greška pri unosu događaja" });
      }

      res.json({
        message: "Događaj uspješno dodan",
        id: result.insertId
      });
    }
  );
});

app.get("/api/rezervacije/:sifraDogadaja", (req, res) => {
  const sifraDogadaja = req.params.sifraDogadaja;

  connection.query(
    "SELECT * FROM Rezervacija WHERE Sifra_dogadaja = ?",
    [sifraDogadaja],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Greška pri dohvaćanju rezervacija" });
      }
      res.json(results);
    }
  );
});


app.listen(port, () => {
  console.log("Server running at port: " + port);
});
