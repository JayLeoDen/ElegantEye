const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'ucka.veleri.hr',
  user: process.env.DB_USER || 'szaharija',
  password: process.env.DB_PASSWORD || '11',
  database: process.env.DB_NAME || 'szaharija',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
})

const ok = (res, data = {}) => res.json(data)
const fail = (res, error, code = 500) => {
  console.error(error)
  res.status(code).json({ error: error.sqlMessage || error.message || error })
}

async function q(sql, params = []) {
  const [rows] = await pool.query(sql, params)
  return rows
}

function token(payload) {
  return Buffer.from(JSON.stringify({ ...payload, ts: Date.now() })).toString('base64url')
}

app.get('/api/health', async (req, res) => {
  try { await q('SELECT 1'); ok(res, { status: 'OK' }) } catch (e) { fail(res, e) }
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { ime, prezime, email, lozinka, uloga, opis_rada } = req.body
    if (!ime || !prezime || !email || !lozinka || !uloga) return fail(res, 'Sva polja su obavezna', 400)
    if (uloga === 'fotograf') {
      const r = await q(`INSERT INTO snimatelj_fotograf
        (ime_fotografa_snimatelja, prezime_fotografa_snimatelja, email_adresa_fotografa_snimatelja, lozinka_fotografa_snimatelja, opis_rada_fotografa_snimatelja)
        VALUES (?, ?, ?, ?, ?)`, [ime, prezime, email, lozinka, opis_rada || ''])
      return ok(res, { message: 'Fotograf/snimatelj registriran', id: r.insertId })
    }
    const r = await q(`INSERT INTO korisnik
      (ime_korisnika, prezime_korisnika, email_adresa_korisnika, lozinka_korisnika)
      VALUES (?, ?, ?, ?)`, [ime, prezime, email, lozinka])
    ok(res, { message: 'Korisnik registriran', id: r.insertId })
  } catch (e) { fail(res, e) }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, lozinka } = req.body
    if (!email || !lozinka) return fail(res, 'Nedostaje email ili lozinka', 400)

    const admins = await q(`SELECT administrator_id id, email_adresa_administratora email, lozinka_administratora lozinka FROM administrator WHERE email_adresa_administratora=?`, [email])
    if (admins[0] && admins[0].lozinka === lozinka) return ok(res, { token: token({ id: admins[0].id, uloga: 'admin' }), user: { id: admins[0].id, email, uloga: 'admin', ime: 'Administrator' } })

    const korisnici = await q(`SELECT korisnik_id id, ime_korisnika ime, prezime_korisnika prezime, email_adresa_korisnika email, lozinka_korisnika lozinka FROM korisnik WHERE email_adresa_korisnika=?`, [email])
    if (korisnici[0] && korisnici[0].lozinka === lozinka) return ok(res, { token: token({ id: korisnici[0].id, uloga: 'korisnik' }), user: { id: korisnici[0].id, ime: korisnici[0].ime, prezime: korisnici[0].prezime, email, uloga: 'korisnik' } })

    const fotografi = await q(`SELECT fotograf_snimatelj_id id, ime_fotografa_snimatelja ime, prezime_fotografa_snimatelja prezime, email_adresa_fotografa_snimatelja email, lozinka_fotografa_snimatelja lozinka FROM snimatelj_fotograf WHERE email_adresa_fotografa_snimatelja=?`, [email])
    if (fotografi[0] && fotografi[0].lozinka === lozinka) return ok(res, { token: token({ id: fotografi[0].id, uloga: 'fotograf' }), user: { id: fotografi[0].id, ime: fotografi[0].ime, prezime: fotografi[0].prezime, email, uloga: 'fotograf' } })

    fail(res, 'Pogrešni podaci za prijavu', 401)
  } catch (e) { fail(res, e) }
})

app.post('/login', (req, res) => app._router.handle({ ...req, url: '/api/auth/login', method: 'POST' }, res))

app.get('/api/usluge', async (req, res) => {
  try {
    const rows = await q(`SELECT usluga_id, naziv_nove_usluge naziv, opis_nove_usluge opis, cijena_nove_usluge cijena, trajanje_nove_usluge trajanje FROM usluga ORDER BY usluga_id DESC`)
    ok(res, rows)
  } catch (e) {
    try {
      const rows = await q(`SELECT Usluga_ID usluga_id, Tip_usluge naziv, Opis_usluge opis, Cijena_usluge cijena, '' trajanje FROM Usluga ORDER BY Usluga_ID DESC`)
      ok(res, rows)
    } catch (err) { fail(res, err) }
  }
})

app.post('/api/usluge', async (req, res) => {
  try {
    const { naziv, opis, cijena, trajanje, tip } = req.body
    const r = await q(` INSERT INTO usluga ( naziv_nove_usluge, opis_nove_usluge, cijena_nove_usluge, trajanje_nove_usluge, naziv_dostupne_usluge, opis_dostupne_usluge, cijena_dostupne_usluge, trajanje_dostupne_usluge ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [ naziv || tip, opis || '', cijena || 0, trajanje || '00:00:00', naziv || tip, opis || '', cijena || 0, trajanje || '00:00:00'])
    ok(res, { message: 'Usluga spremljena', id: r.insertId })
  } catch (e) { fail(res, e) }
})

app.put('/api/usluge/:id', async (req, res) => {
  try {
    const { naziv, opis, cijena, trajanje } = req.body
    await q(`UPDATE usluga SET naziv_nove_usluge=?, opis_nove_usluge=?, cijena_nove_usluge=?, trajanje_nove_usluge=? WHERE usluga_id=?`, [naziv, opis, cijena, trajanje, req.params.id])
    ok(res, { message: 'Usluga ažurirana' })
  } catch (e) { fail(res, e) }
})

app.delete('/api/usluge/:id', async (req, res) => {
  try { await q('DELETE FROM usluga WHERE usluga_id=?', [req.params.id]); ok(res, { message: 'Usluga obrisana' }) } catch (e) { fail(res, e) }
})

app.get('/api/fotografi', async (req, res) => {
  try {
    const rows = await q(`
      SELECT
        fotograf_snimatelj_id,
        ime_fotografa_snimatelja ime,
        prezime_fotografa_snimatelja prezime,
        email_adresa_fotografa_snimatelja email,
        opis_rada_fotografa_snimatelja opis_rada,
        4.8 ocjena
      FROM snimatelj_fotograf
      ORDER BY fotograf_snimatelj_id DESC
    `)

    ok(res, rows) } catch (e) { fail(res, e)}
})

app.post('/api/fotografi', async (req, res) => {
  try {
    const { ime, prezime, email, lozinka, opis_rada, opis } = req.body
    const r = await q(`INSERT INTO snimatelj_fotograf (ime_fotografa_snimatelja, prezime_fotografa_snimatelja, email_adresa_fotografa_snimatelja, lozinka_fotografa_snimatelja, opis_rada_fotografa_snimatelja) VALUES (?, ?, ?, ?, ?)`, [ime, prezime, email, lozinka || '1234', opis_rada || opis || ''])
    ok(res, { message: 'Fotograf spremljen', id: r.insertId })
  } catch (e) { fail(res, e) }
})

app.put('/api/fotografi/:id', async (req, res) => {
  try {
    const { ime, prezime, email, opis_rada } = req.body
    await q(`UPDATE snimatelj_fotograf SET ime_fotografa_snimatelja=?, prezime_fotografa_snimatelja=?, email_adresa_fotografa_snimatelja=?, opis_rada_fotografa_snimatelja=? WHERE fotograf_snimatelj_id=?`, [ime, prezime, email, opis_rada, req.params.id])
    ok(res, { message: 'Fotograf ažuriran' })
  } catch (e) { fail(res, e) }
})

app.delete('/api/fotografi/:id', async (req, res) => {
  try { await q('DELETE FROM snimatelj_fotograf WHERE fotograf_snimatelj_id=?', [req.params.id]); ok(res, { message: 'Fotograf obrisan' }) } catch (e) { fail(res, e) }
})

app.get('/api/korisnici', async (req, res) => {
  try { ok(res, await q('SELECT korisnik_id, ime_korisnika ime, prezime_korisnika prezime, email_adresa_korisnika email FROM korisnik ORDER BY korisnik_id DESC')) } catch (e) { fail(res, e) }
})

app.get('/api/portfolio', async (req, res) => {
  try {
    const where = req.query.fotograf_id
      ? 'WHERE p.fotograf_snimatelj_id = ?'
      : ''

    const rows = await q(`
      SELECT
        p.portfolio_id,
        p.fotograf_snimatelj_id,
        p.naziv_rada_portfolija AS naziv_rada,
        p.opis_rada_portfolija AS opis_rada,
        p.slika_video_portfolija AS medij,
        p.datum_objave_portfolija AS datum_objave,
        p.ime_fotografa_snimatelja,
        p.prezime_fotografa_snimatelja
      FROM portfolio p
      ${where}
      ORDER BY p.portfolio_id DESC
    `, req.query.fotograf_id ? [req.query.fotograf_id] : [])

    ok(res, rows)
  } catch (e) {
    fail(res, e)
  }
})

app.post('/api/portfolio', async (req, res) => {
  try {
    const b = req.body

    const r = await q(`
      INSERT INTO portfolio
      (
        fotograf_snimatelj_id,
        naziv_rada_portfolija,
        opis_rada_portfolija,
        slika_video_portfolija,
        datum_objave_portfolija,
        ime_fotografa_snimatelja,
        prezime_fotografa_snimatelja
      )
      VALUES (?, ?, ?, ?, CURDATE(), ?, ?)
    `, [
      b.fotograf_snimatelj_id,
      b.naziv_rada,
      b.opis_rada || '',
      b.medij || '',
      b.ime_fotografa_snimatelja || null,
      b.prezime_fotografa_snimatelja || null
    ])

    ok(res, { message: 'Portfolio spremljen', id: r.insertId })
  } catch (e) {
    fail(res, e)
  }
})

app.put('/api/portfolio/:id', async (req, res) => {
  try {
    const b = req.body

    await q(`
      UPDATE portfolio
      SET
        azurirani_naziv_rada_portfolija = ?,
        azurirani_opis_rada_portfolija = ?,
        azurirana_slika_video_portfolija = ?,
        datum_izmjene_portfolija = CURDATE(),
        ime_fotografa_snimatelja_izmjena = ?,
        prezime_fotografa_snimatelja_izmjena = ?
      WHERE portfolio_id = ?
    `, [
      b.naziv_rada,
      b.opis_rada || '',
      b.medij || '',
      b.ime_fotografa_snimatelja || null,
      b.prezime_fotografa_snimatelja || null,
      req.params.id
    ])

    ok(res, { message: 'Portfolio ažuriran' })
  } catch (e) {
    fail(res, e)
  }
})

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    await q('DELETE FROM portfolio WHERE portfolio_id = ?', [req.params.id])
    ok(res, { message: 'Portfolio obrisan' })
  } catch (e) {
    fail(res, e)
  }
})

app.get('/api/rezervacije', async (req, res) => {
  try {
    const cond = []
    const params = []
    if (req.query.korisnik_id) { cond.push('r.korisnik_id=?'); params.push(req.query.korisnik_id) }
    if (req.query.fotograf_snimatelj_id) { cond.push('r.fotograf_snimatelj_id=?'); params.push(req.query.fotograf_snimatelj_id) }
    const where = cond.length ? `WHERE ${cond.join(' AND ')}` : ''
    const rows = await q(`SELECT r.*, k.ime_korisnika, k.prezime_korisnika, f.ime_fotografa_snimatelja, f.prezime_fotografa_snimatelja,
      u.naziv_nove_usluge naziv_usluge, d.opis_dogadaja, d.lokacija_dogadaja
      FROM rezervacija_korisnika r
      LEFT JOIN korisnik k ON k.korisnik_id=r.korisnik_id
      LEFT JOIN snimatelj_fotograf f ON f.fotograf_snimatelj_id=r.fotograf_snimatelj_id
      LEFT JOIN usluga u ON u.usluga_id=r.usluga_id
      LEFT JOIN dogadaj d ON d.dogadaj_id=r.dogadaj_id
      ${where} ORDER BY r.rezervacija_id DESC`, params)
    ok(res, rows)
  } catch (e) { fail(res, e) }
})

app.post('/api/rezervacije', async (req, res) => {
  const c = await pool.getConnection()
  try {
    await c.beginTransaction()
    const b = req.body
    let dogadajId = b.dogadaj_id
    if (!dogadajId) {
      const [dr] = await c.query(`INSERT INTO dogadaj (datum_dogadaja, vrijeme_dogadaja, lokacija_dogadaja, opis_dogadaja) VALUES (?, ?, ?, ?)`, [b.datum_dogadaja || b.datum_nove_rezervacije, b.vrijeme_dogadaja || b.vrijeme_nove_rezervacije, b.lokacija_dogadaja || '', b.opis_dogadaja || 'Događaj'])
      dogadajId = dr.insertId
    }
    const [r] = await c.query(`INSERT INTO rezervacija_korisnika (korisnik_id, dogadaj_id, usluga_id, fotograf_snimatelj_id, datum_nove_rezervacije, vrijeme_nove_rezervacije, napomena_rezervacije) VALUES (?, ?, ?, ?, ?, ?, ?)`, [b.korisnik_id, dogadajId, b.usluga_id, b.fotograf_snimatelj_id, b.datum_nove_rezervacije || b.datum_dogadaja, b.vrijeme_nove_rezervacije || b.vrijeme_dogadaja, b.napomena_rezervacije || ''])
    await c.query(`INSERT INTO obavijest (fotograf_snimatelj_id, rezervacija_id, datum_obavijesti, vrijeme_obavijesti, status_obavijesti) VALUES (?, ?, CURDATE(), CURTIME(), 'nova')`, [b.fotograf_snimatelj_id, r.insertId]).catch(() => {})
    await c.commit(); ok(res, { message: 'Rezervacija kreirana', id: r.insertId })
  } catch (e) { await c.rollback(); fail(res, e) } finally { c.release() }
})

app.put('/api/rezervacije/:id/status', async (req, res) => {
  try {
    await q(
      'UPDATE rezervacija_korisnika SET status_rezervacije=? WHERE rezervacija_id=?',
      [req.body.status, req.params.id]
    )

    ok(res, { message: 'Status ažuriran' })
  } catch (e) {
    fail(res, e)
  }
})

app.put('/api/rezervacije/:id', async (req, res) => {
  try {
    const b = req.body

    const datum = b.datum_nove_rezervacije
      ? String(b.datum_nove_rezervacije).split('T')[0]
      : null

    const vrijeme = b.vrijeme_nove_rezervacije
      ? String(b.vrijeme_nove_rezervacije).slice(0, 5)
      : null

    await q(`
      UPDATE rezervacija_korisnika r
      LEFT JOIN dogadaj d ON d.dogadaj_id = r.dogadaj_id
      SET
        r.datum_nove_rezervacije = ?,
        r.vrijeme_nove_rezervacije = ?,
        r.napomena_rezervacije = ?,
        d.datum_dogadaja = ?,
        d.vrijeme_dogadaja = ?,
        d.lokacija_dogadaja = ?
      WHERE r.rezervacija_id = ?
    `, [
      datum,
      vrijeme,
      b.napomena_rezervacije || '',
      datum,
      vrijeme,
      b.lokacija_dogadaja || '',
      req.params.id
    ])

    ok(res, { message: 'Rezervacija ažurirana' })
  } catch (e) {
    fail(res, e)
  }
})

app.delete('/api/rezervacije/:id', async (req, res) => {
  try {
    await q(
      'DELETE FROM rezervacija_korisnika WHERE rezervacija_id=?',
      [req.params.id]
    )

    ok(res, { message: 'Rezervacija obrisana' })
  } catch (e) {
    fail(res, e)
  }
})

app.get('/api/dostupnost', async (req, res) => {
  try {
    const rows = await q(`
      SELECT
        dostupnost_id,
        fotograf_snimatelj_id,
        datum_dostupnosti_fotografa_snimatelja AS datum_dostupnosti,
        vrijeme_dostupnosti_fotografa_snimatelja AS vrijeme_dostupnosti,
        status_dostupnosti_fotografa_snimatelja AS status_dostupnosti,
        ime_fotografa_snimatelja,
        prezime_fotografa_snimatelja
      FROM dostupnost_fotografa
      WHERE (? IS NULL OR fotograf_snimatelj_id = ?)
      ORDER BY datum_dostupnosti_fotografa_snimatelja DESC
    `, [
      req.query.fotograf_snimatelj_id || null,
      req.query.fotograf_snimatelj_id || null
    ])

    ok(res, rows)
  } catch (e) {
    fail(res, e)
  }
})

app.post('/api/dostupnost', async (req, res) => {
  try {
    const b = req.body

    const r = await q(`
      INSERT INTO dostupnost_fotografa
      (
        fotograf_snimatelj_id,
        datum_dostupnosti_fotografa_snimatelja,
        vrijeme_dostupnosti_fotografa_snimatelja,
        status_dostupnosti_fotografa_snimatelja,
        ime_fotografa_snimatelja,
        prezime_fotografa_snimatelja
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      b.fotograf_snimatelj_id,
      b.datum_dostupnosti,
      b.vrijeme_dostupnosti,
      b.status_dostupnosti || 'slobodan',
      b.ime_fotografa_snimatelja || null,
      b.prezime_fotografa_snimatelja || null
    ])

    ok(res, {
      message: 'Dostupnost spremljena',
      id: r.insertId
    })
  } catch (e) {
    fail(res, e)
  }
})  

app.get('/api/poruke', async (req, res) => {
  try { ok(res, await q('SELECT * FROM poruka_napomena WHERE (? IS NULL OR rezervacija_id=?) ORDER BY poruka_id DESC', [req.query.rezervacija_id || null, req.query.rezervacija_id || null])) } catch (e) { ok(res, []) }
})

app.post('/api/poruke', async (req, res) => {
  try {
    const b = req.body
    const r = await q(`INSERT INTO poruka_napomena (rezervacija_id, administrator_id, korisnik_id, fotograf_snimatelj_id, sadrzaj, datum, vrijeme, tip_poruke) VALUES (?, ?, ?, ?, ?, CURDATE(), CURTIME(), ?)`, [b.rezervacija_id, b.administrator_id || null, b.korisnik_id || null, b.fotograf_snimatelj_id || null, b.sadrzaj, b.tip_poruke || 'napomena_rezervacije'])
    ok(res, { message: 'Poruka spremljena', id: r.insertId })
  } catch (e) { fail(res, e) }
})

app.post('/api/poruke/admin', async (req, res) => {
  try {
    const b = req.body
    await q(`
      INSERT INTO poruka_administratora 
      (administrator_id, sadrzaj_poruke_administratora, 
       datum_poruke_administratora, vrijeme_poruke_administratora)
      VALUES (?, ?, CURDATE(), CURTIME())
    `, [b.administrator_id, b.sadrzaj])
    res.json({ message: 'Poruka poslana' })
  } catch (e) { fail(res, e) }
})

app.post('/api/povratne-informacije', async (req, res) => {
  try {
    const b = req.body

    const r = await q(`
      INSERT INTO povratne_informacije (
        korisnik_id,
        usluga_id,
        ocjena_povratne_informacije,
        komentar_povratne_informacije,
        datum_povratne_informacije
      )
      VALUES (?, ?, ?, ?, CURDATE())
    `, [
      b.korisnik_id,
      b.usluga_id,
      b.ocjena,
      b.komentar || ''
    ])

    ok(res, { message: 'Recenzija spremljena', id: r.insertId })
  } catch (e) {
    fail(res, e)
  }
})

app.get('/api/reports/summary', async (req, res) => {
  try {
    const [[korisnici], [fotografi], [usluge], [rezervacije], [ocjena]] = await Promise.all([
      q('SELECT COUNT(*) broj FROM korisnik'), q('SELECT COUNT(*) broj FROM snimatelj_fotograf'), q('SELECT COUNT(*) broj FROM usluga'), q('SELECT COUNT(*) broj FROM rezervacija_korisnika'), q('SELECT ROUND(AVG(ocjena_povratne_informacije),1) broj FROM povratne_informacije')
    ])
    ok(res, { korisnici: korisnici.broj, fotografi: fotografi.broj, usluge: usluge.broj, rezervacije: rezervacije.broj, prosjecna_ocjena: ocjena.broj || 0 })
  } catch (e) { fail(res, e) }
})


app.get('/api/usluge/:id', async (req, res) => {
  try {
    const rows = await q(
      `SELECT usluga_id,
              naziv_dostupne_usluge naziv,
              opis_dostupne_usluge   opis,
              cijena_dostupne_usluge cijena,
              trajanje_dostupne_usluge trajanje
       FROM usluga WHERE usluga_id = ?`,
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Usluga ne postoji' })
    res.json(rows[0])
  } catch (e) { fail(res, e) }
})


app.get('/api/usluge/:id/recenzije', async (req, res) => {
  try {
    const rows = await q(
      `SELECT
         pi.povratna_informacija_id,
         pi.ocjena_povratne_informacije,
         pi.komentar_povratne_informacije,
         pi.datum_povratne_informacije,
         k.ime_korisnika,
         k.prezime_korisnika
       FROM povratne_informacije pi
       LEFT JOIN korisnik k ON k.korisnik_id = pi.korisnik_id
       WHERE pi.usluga_id = ?
       ORDER BY pi.datum_povratne_informacije DESC`,
      [req.params.id]
    )
    res.json(rows)
  } catch (e) { fail(res, e) }
})

app.post('/api/korisnici', async (req, res) => {
  try {
    const { ime, prezime, email } = req.body
    const r = await q(`
      INSERT INTO korisnik
      (
        ime_korisnika,
        prezime_korisnika,
        email_adresa_korisnika,
        lozinka_korisnika
      )
      VALUES (?, ?, ?, ?)
    `, [
      ime,
      prezime,
      email,
      '1234'
    ])

    res.json({
      message: 'Korisnik dodan',
      id: r.insertId
    })

  } catch (e) {
    fail(res, e)
  }
})

app.put('/api/korisnici/:id', async (req, res) => {
  try {

    const { ime, prezime, email } = req.body
    await q(`
      UPDATE korisnik
      SET
        ime_korisnika = ?,
        prezime_korisnika = ?,
        email_adresa_korisnika = ?
      WHERE korisnik_id = ?
    `, [
      ime,
      prezime,
      email,
      req.params.id
    ])

    res.json({
      message: 'Korisnik ažuriran'
    })

  } catch (e) {
    fail(res, e)
  }
})

app.delete('/api/korisnici/:id', async (req, res) => {
  try {

    await q(`
      DELETE FROM korisnik
      WHERE korisnik_id = ?
    `, [req.params.id])

    res.json({
      message: 'Korisnik obrisan'
    })

  } catch (e) {
    fail(res, e)
  }
})



app.listen(port, () => console.log(`Elegant Eye API running on http://localhost:${port}`))
