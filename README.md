# Elegant Eye

Kompletan Quasar + Express + MySQL/MariaDB projekt prema dokumentaciji.

## Pokretanje baze
1. Otvori HeidiSQL.
2. Spoji se na MySQL/MariaDB server.
3. Pokreni skriptu: `backend/database/elegant_eye.sql`.

## Backend
```bash
cd backend
node index.js
```
API radi na `http://localhost:3000`.

Ako koristiš lokalnu bazu, prije pokretanja možeš postaviti varijable:
```bash
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
set DB_NAME=elegant_eye
node index.js
```

## Frontend
```bash
cd quasar-project
npm install
npm run dev
```

## Testni korisnici
- Admin: `admin@eleganteye.hr` / `admin`
- Korisnik: `ana@gmail.com` / `1234`
- Fotograf: `ivan@studio.hr` / `1234`
