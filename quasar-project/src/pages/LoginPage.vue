<template>
  <q-page padding>
    <h2>Login</h2>

    <q-card flat bordered class="q-pa-md col-12 col-md-4">
      <q-form @submit.prevent="prijavi">
        <q-input filled v-model="korisnicko_ime" label="Korisničko ime" class="q-mb-md" />
        <q-input filled type="password" v-model="lozinka" label="Lozinka" class="q-mb-md" />

        <q-btn label="Potvrdi" color="primary" type="submit" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const korisnicko_ime = ref('')
const lozinka = ref('')

function prijavi() {
  console.log('Prijava:', korisnicko_ime.value, lozinka.value)
  alert(`Prijava: ${korisnicko_ime.value} (test)`)
}
</script>