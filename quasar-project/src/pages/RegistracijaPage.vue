<template>
  <q-page padding>
    <h2>Registracija korisnika</h2>

    <q-card flat bordered class="q-pa-md col-12 col-md-6">
      <q-form @submit.prevent="registriraj">
        <q-input filled v-model="korisnik.ime" label="Ime i prezime" class="q-mb-md" />
        <q-input filled v-model="korisnik.email" label="Email" class="q-mb-md" />
        <q-input filled v-model="korisnik.korisnicko_ime" label="Korisničko ime" class="q-mb-md" />
        <q-input filled type="password" v-model="korisnik.lozinka" label="Lozinka" class="q-mb-md" />

        <q-btn label="Potvrdi" color="primary" type="submit" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const korisnik = ref({ ime:'', email:'', korisnicko_ime:'', lozinka:'' })

function registriraj() {
  console.log('Registriran korisnik:', korisnik.value)
  alert('Korisnik registriran (test)')
}
</script>