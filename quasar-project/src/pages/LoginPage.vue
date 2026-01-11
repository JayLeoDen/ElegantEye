<template>
  <q-page padding>
    <h2>Prijava korisnika</h2>

    <q-card flat bordered class="q-pa-md col-12 col-md-6">
      <q-form @submit.prevent="login">
        <q-input
          filled
          v-model="korisnik.korisnicko_ime"
          label="Korisničko ime"
          class="q-mb-md"
        />

        <q-input
          filled
          type="password"
          v-model="korisnik.lozinka"
          label="Lozinka"
          class="q-mb-md"
        />

        <q-btn
          label="Prijava"
          color="primary"
          type="submit"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const korisnik = ref({
  korisnicko_ime: '',
  lozinka: ''
})

async function login () {
  if (!korisnik.value.korisnicko_ime || !korisnik.value.lozinka) {
    $q.dialog({
      message: 'Molimo unesite korisničko ime i lozinku'
    })
    return
  }

  try {
    const res = await axios.post('http://localhost:3000/login', {
      korime: korisnik.value.korisnicko_ime,
      lozinka: korisnik.value.lozinka
    })

    localStorage.setItem('token', JSON.stringify(res.data))

    if (res.data.uloga === 'admin') {
      router.push('/admin')
    } else {
      router.push('/user')
    }

  } catch (error) {
    $q.dialog({
      message: 'Neispravno korisničko ime ili lozinka'
    })
    console.log(error)
  }
}
</script>
