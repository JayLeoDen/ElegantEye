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
if (err) throw err;
console.log("Connected to DB");
});


app.get("/api/usluge", (req, res) => {
connection.query("SELECT * FROM Usluga", (error, results) => {
if (error) {
console.error("Greška u SQL-u:", error);
return res.status(500).json({ error: "Greška pri dohvaćanju usluga" });
}
res.json(results);
});
});

app.post("/api/usluge", (req, res) => {
const { id, tip, cijena, opis } = req.body;

if (!id || !tip) {
return res.status(400).json({ error: "ID i tip usluge su obavezni" });
}

const sql = `INSERT INTO Usluga (Usluga_ID, Tip_usluge, Cijena_usluge, Opis_usluge)
               VALUES (?, ?, ?, ?)`;

connection.query(sql, [id, tip, cijena || null, opis || null], (err, results) => {
if (err) {
console.error("Greška u SQL-u:", err);
return res.status(500).json({ error: "Greška pri unosu" });
}
res.json({ message: "Usluga dodana" });
});
});

app.put("/api/usluge/:id", (req, res) => {
const id = req.params.id;
const { tip, cijena, opis } = req.body;

const sql = `UPDATE Usluga SET Tip_usluge=?, Cijena_usluge=?, Opis_usluge=? WHERE Usluga_ID=?`;

connection.query(sql, [tip, cijena || null, opis || null, id], (err, results) => {
if (err) {
console.error("Greška u SQL-u:", err);
return res.status(500).json({ error: "Greška pri ažuriranju" });
}
res.json({ message: "Usluga ažurirana" });
});
});

app.delete("/api/usluge/:id", (req, res) => {
const id = req.params.id;
connection.query("DELETE FROM Usluga WHERE Usluga_ID = ?", [id], (err, results) => {
if (err) {
console.error("Greška u SQL-u:", err);
return res.status(500).json({ error: "Greška pri brisanju" });
}
res.json({ message: "Usluga obrisana" });
});
});

app.listen(port, () => {
console.log("Server running at port: " + port);
});
