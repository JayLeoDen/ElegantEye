<template>
  <q-page padding class="q-pa-md col-12 col-md-6">
    <h2>Registracija korisnika</h2>

    <q-form @submit.prevent="registriraj">
      <q-input filled v-model="noviKorisnik.ime" label="Ime" class="q-mb-md" />
      <q-input filled v-model="noviKorisnik.prezime" label="Prezime" class="q-mb-md" />
      <q-input filled v-model="noviKorisnik.email" label="Email" type="email" class="q-mb-md" />
      <q-input filled v-model="noviKorisnik.korime" label="Korisničko ime" class="q-mb-md" />
      <q-input filled v-model="noviKorisnik.lozinka" label="Lozinka" type="password" class="q-mb-md" />

      <q-btn type="submit" label="Registriraj se" color="primary" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const backendURL = "http://localhost:3000/api/registracija"

const noviKorisnik = ref({
  ime: '',
  prezime: '',
  email: '',
  korime: '',
  lozinka: ''
})

async function registriraj() {
  if (!noviKorisnik.value.ime || !noviKorisnik.value.prezime || !noviKorisnik.value.email || !noviKorisnik.value.korime || !noviKorisnik.value.lozinka) {
    alert("Sva polja moraju biti ispunjena!")
    return
  }

  try {
    await axios.post(backendURL, noviKorisnik.value)
    alert("Registracija uspješna! Čeka se odobrenje admina.")
    noviKorisnik.value = { ime:'', prezime:'', email:'', korime:'', lozinka:'' }
  } catch (err) {
    console.error(err)
    alert("Greška pri registraciji")
  }
}
</script>
