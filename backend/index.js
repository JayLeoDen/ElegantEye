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
    ime,
    prezime,
    uloga,
    email,
    telefon,
    portfolio,
  } = req.body;

  if (!ime || !prezime) {
    return res.status(400).json({ error: "Ime i prezime su obavezni" });
  }

  connection.query(
    `INSERT INTO Fotograf_Snimatelj
     (Ime_fotografa_snimatelja,
      Prezime_fotografa_snimatelja,
      Specijalizacija_fotografa_snimatelja,
      Email_fotografa_snimatelja,
      Telefon_fotografa_snimatelja,
      Portfolio_fotografa_snimatelja)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [ime, prezime, uloga, email, telefon, portfolio || null],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Greška pri unosu" });
      }

      res.status(201).json({
        message: "Fotograf dodan",
        MB_fotografa_snimatelja: results.insertId
      });
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

app.get("/api/registracija", (req, res) => {
  connection.query(
    "SELECT * FROM registracija",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Greška pri dohvaćanju" });
      }
      res.json(results);
    }
  );
});


app.post("/api/registracija", (req, res) => {
  const { ime, prezime, email, korime, lozinka } = req.body;

  if (!ime || !prezime || !korime || !lozinka || !email) {
    return res.status(400).json({ error: "Sva polja su obavezna" });
  }

  connection.query(
    `INSERT INTO registracija (ime, prezime, korime, lozinka, email)
     VALUES (?, ?, ?, ?, ?)`,
    [ime, prezime, korime, lozinka, email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Greška pri unosu" });
      }
      res.json({ message: "Korisnik registriran" });
    }
  );
});


app.post("/api/registracija/:id/odobri", (req, res) => {
  const { id } = req.params;
  const { uloga } = req.body;

  if (!uloga) {
    return res.status(400).json({ error: "Uloga je obavezna" });
  }

  connection.query(
    "SELECT * FROM registracija WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Greška pri dohvaćanju korisnika" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Korisnik ne postoji" });
      }

      const korisnik = results[0];

      connection.query(
        "SELECT id FROM prijava WHERE korime = ?",
        [korisnik.korime],
        (err2, postoji) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: "Greška pri provjeri korisnika" });
          }

          if (postoji.length > 0) {
            return res.status(400).json({
              error: "Korisnik već postoji u sustavu"
            });
          }

          connection.query(
  "INSERT INTO prijava (ime, prezime, korime, lozinka, email, uloga) VALUES (?, ?, ?, ?, ?, ?)",
  [
    korisnik.ime, korisnik.prezime, korisnik.korime, korisnik.lozinka, korisnik.email, uloga
  ],
  (err3) => {
    if (err3) {
      console.error(err3);
      return res.status(500).json({ error: "Greška pri upisu u prijava" });
    }

              connection.query(
                "DELETE FROM registracija WHERE id = ?",
                [id],
                (err4) => {
                  if (err4) {
                    console.error(err4);
                    return res.status(500).json({ error: "Greška pri brisanju iz registracija" });
                  }

                  res.json({
                    message: "Korisnik uspješno odobren"
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});




app.listen(port, () => {
  console.log("Server running at port: " + port);
});
