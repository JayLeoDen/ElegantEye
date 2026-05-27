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
  connection.query("SELECT * FROM snimatelj_fotograf", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/api/fotografi/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM snimatelj_fotograf WHERE fotograf_snimatelj_id = ?",
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
    email,
    lozinka,
    opis
  } = req.body;

  if (!ime || !prezime) {
    return res.status(400).json({ error: "Ime i prezime su obavezni" });
  }

  connection.query(
    `INSERT INTO snimatelj_fotograf
     (ime_fotografa_snimatelja,
      prezime_fotografa_snimatelja,
      email_adresa_fotografa_snimatelja,
      lozinka_fotografa_snimatelja,
      opis_rada_fotografa_snimatelja
      )
     VALUES (?, ?, ?, ?, ?)`,
    [ime, prezime, email, lozinka, opis || null],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Greška pri unosu" });
      }

      res.status(201).json({
        message: "Fotograf dodan",
        fotograf_snimatelj_id: results.insertId
      });
    }
  );
});


app.put("/api/fotografi/:id", (req, res) => {
  const id = req.params.id;
  const { ime, prezime, email, lozinka, opis } = req.body;

  connection.query(
    `UPDATE snimatelj_fotograf
     SET ime_fotografa_snimatelja=?,
      prezime_fotografa_snimatelja=?,
      email_adresa_fotografa_snimatelja=?,
      lozinka_fotografa_snimatelja=?,
      opis_rada_fotografa_snimatelja=?
     WHERE fotograf_snimatelj_id=?`,
    [ime, prezime, email, lozinka, opis || null, id],
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
    "DELETE FROM snimatelj_fotograf WHERE fotograf_snimatelj_id = ?",
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
  const { email, lozinka } = req.body;

  if (!email || !lozinka) {
    return res.status(400).json({ message: 'Nedostaje email ili lozinka' });
  }

  const query = `
    SELECT administrator_id, email_adresa_administratora, lozinka_administratora
    FROM administrator
    WHERE email_adresa_administratora = ?
  `;

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Greška na serveru' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Administrator ne postoji' });
    }

    const admin = results[0];

    if (admin.lozinka_administratora !== lozinka) {
      return res.status(401).json({ message: 'Pogrešna lozinka' });
    }

    res.json({
      id: admin.administrator_id,
      email: admin.email_adresa_administratora,
      uloga: 'admin'
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
  connection.query(
    "SELECT korisnik_id, ime_korisnika, prezime_korisnika FROM korisnik",
    (err, results) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.sqlMessage });
      }

      res.json(results);
    }
  );
});

app.get("/api/dogadaji2", (req, res) => {
  connection.query(
    "SELECT dogadaj_id, opis_dogadaja FROM dogadaj",
    (err, results) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.sqlMessage });
      }

      res.json(results);
    }
  );
});

app.get("/api/usluge2", (req, res) => {
  connection.query(
    "SELECT usluga_id, naziv_nove_usluge FROM usluga",
    (err, results) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.sqlMessage });
      }

      res.json(results);
    }
  );
});

app.get("/api/fotografi", (req, res) => {
  connection.query(
    "SELECT fotograf_snimatelj_id, ime_fotografa_snimatelja, prezime_fotografa_snimatelja FROM snimatelj_fotograf",
    (err, results) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.sqlMessage });
      }

      res.json(results);
    }
  );
});

app.get("/api/rezervacije", (req, res) => {
  connection.query("SELECT * FROM rezervacija_korisnika", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

app.post("/api/rezervacije", (req, res) => {
  console.log("POST /rezervacije");
  console.log("BODY:", req.body);
  const { korisnik_id, dogadaj_id, usluga_id, fotograf_snimatelj_id, datum_nove_rezervacije, vrijeme_nove_rezervacije, napomena_rezervacije } = req.body;

  if (!korisnik_id || !dogadaj_id || !usluga_id || !fotograf_snimatelj_id || !datum_nove_rezervacije || !vrijeme_nove_rezervacije) {
    return res.status(400).json({ error: "Obavezna polja: klijent, događaj, usluga, fotograf, datum i vrijeme" });
  }

  connection.query(
    `INSERT INTO rezervacija_korisnika (korisnik_id, dogadaj_id, usluga_id, fotograf_snimatelj_id, datum_nove_rezervacije, vrijeme_nove_rezervacije, napomena_rezervacije)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [Number(korisnik_id), Number(dogadaj_id), Number(usluga_id),Number(fotograf_snimatelj_id),datum_nove_rezervacije, vrijeme_nove_rezervacije, napomena_rezervacije || null],
    (error, results) => {
      if (error) {console.log("MYSQL ERROR FULL:", error);
      return res.status(500).json({ error: error.sqlMessage });
      }
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
