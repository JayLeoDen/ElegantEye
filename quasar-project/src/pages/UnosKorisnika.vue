<template>
  <div>
    <q-input filled v-model="imePrezime" label="Ime i prezime" />
    <q-input filled v-model="email" label="Email adresa" />
    <q-input filled v-model="telefon" label="Broj mobitela" />

    <q-select
      filled
      v-model="status"
      :options="['Novi korisnik', 'Stari korisnik']"
      label="Status klijenta"
    />

    <div class="q-mt-md">
      <q-btn label="Spremi" color="green" @click="spremi" />
      <q-btn label="Odustani" color="red" @click="reset" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['osvjezi'])

const imePrezime = ref('')
const email = ref('')
const telefon = ref('')
const status = ref('Novi korisnik')

function spremi () {
  axios.post('http://localhost:3000/klijent', {
    Ime_i_prezime_klijenta: imePrezime.value,
    Email_klijenta: email.value,
    Broj_telefona_klijenta: telefon.value,
    Status_klijenta: status.value
  }).then(() => {
    emit('osvjezi')
    reset()
  })
}

function reset () {
  imePrezime.value = ''
  email.value = ''
  telefon.value = ''
  status.value = 'Novi korisnik'
}
</script>
