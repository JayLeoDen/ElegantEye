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

app.get("/api/klijenti2", (req, res) => {
  connection.query("SELECT Sifra_klijenta FROM Klijent", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results.map(r => r.Sifra_klijenta));
  });
});

app.get("/api/dogadaji2", (req, res) => {
  connection.query("SELECT Sifra_dogadaja FROM Dogadaj", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results.map(r => r.Sifra_dogadaja));
  });
});

app.get("/api/usluge2", (req, res) => {
  connection.query("SELECT Usluga_ID FROM Usluga", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results.map(r => r.Usluga_ID));
  });
});

app.get("/api/rezervacije", (req, res) => {
  connection.query("SELECT * FROM Rezervacija", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

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

app.get("/api/dogadaji", (req, res) => {
  connection.query(
    "SELECT * FROM Dogadaj ORDER BY Datum_i_vrijeme_dogadaja DESC",
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Greška pri dohvaćanju" });
      }
      res.json(results);
    }
  );
});

app.post("/api/dogadaji", (req, res) => {
  const {
    tip,
    datumVrijeme,
    lokacija,
    opis
  } = req.body;

  connection.query(
    `INSERT INTO Dogadaj
     (Tip_dogadaja, Datum_i_vrijeme_dogadaja,
      Lokacija_dogadaja, Opis_dogadaja)
     VALUES (?, ?, ?, ?)`,
    [
      tip || null,
      datumVrijeme || null,
      lokacija || null,
      opis || null
    ],
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

app.get("/api/usluge", (req, res) => {
  connection.query("SELECT * FROM Usluga", (err, results) => {
    if (err) {
      console.error("Greška u SQL-u:", err);
      return res.status(500).json({ error: "Greška pri dohvaćanju" });
    }
    res.json(results);
  });
});


app.post("/api/usluge", (req, res) => {
  const { tip, cijena, opis } = req.body;

  if (!tip) {
    return res.status(400).json({ error: "Tip usluge je obavezan" });
  }

  const sql = `
    INSERT INTO Usluga (Tip_usluge, Cijena_usluge, Opis_usluge)
    VALUES (?, ?, ?)
  `;

  connection.query(
    sql,
    [tip, cijena || null, opis || null],
    (err, results) => {
      if (err) {
        console.error("Greška u SQL-u:", err);
        return res.status(500).json({ error: "Greška pri unosu" });
      }

      res.json({
        message: "Usluga dodana",
        insertedId: results.insertId
      });
    }
  );
});


app.put("/api/usluge/:id", (req, res) => {
  const id = req.params.id;
  const { tip, cijena, opis } = req.body;

  const sql = `
    UPDATE Usluga
    SET Tip_usluge = ?, Cijena_usluge = ?, Opis_usluge = ?
    WHERE Usluga_ID = ?
  `;

  connection.query(
    sql,
    [tip, cijena || null, opis || null, id],
    (err, results) => {
      if (err) {
        console.error("Greška u SQL-u:", err);
        return res.status(500).json({ error: "Greška pri ažuriranju" });
      }
      res.json({ message: "Usluga ažurirana" });
    }
  );
});


app.delete("/api/usluge/:id", (req, res) => {
  const id = req.params.id;

  connection.query(
    "DELETE FROM Usluga WHERE Usluga_ID = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Greška u SQL-u:", err);
        return res.status(500).json({ error: "Greška pri brisanju" });
      }
      res.json({ message: "Usluga obrisana" });
    }
  );
});

app.get('/klijent', (req, res) => {
  connection.query('SELECT * FROM Klijent ORDER BY Sifra_klijenta DESC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/klijent', (req, res) => {
  const {
    Ime_i_prezime_klijenta,
    Email_klijenta,
    Broj_telefona_klijenta,
    Status_klijenta
  } = req.body;

  const sql = `
    INSERT INTO Klijent
    (Ime_i_prezime_klijenta, Email_klijenta, Broj_telefona_klijenta, Status_klijenta)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [Ime_i_prezime_klijenta, Email_klijenta, Broj_telefona_klijenta, Status_klijenta],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ Sifra_klijenta: result.insertId });
    }
  );
});

app.listen(port, () => {
  console.log("Server running at port: " + port);
});
