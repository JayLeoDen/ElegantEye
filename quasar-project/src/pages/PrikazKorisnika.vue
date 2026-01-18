<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card
      v-for="k in klijenti"
      :key="k.Sifra_klijenta"
      class="my-card"
    >
      <q-card-section>
        <div class="text-h6">
          {{ k.Ime_i_prezime_klijenta }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Šifra klijenta: {{ k.Sifra_klijenta }}
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ k.Email_klijenta }}
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ k.Broj_telefona_klijenta }}
      </q-card-section>

      <q-card-section>
        <q-chip
          :color="k.Status_klijenta === 'Novi korisnik' ? 'green' : 'red'"
          text-color="white"
        >
          {{ k.Status_klijenta }}
        </q-chip>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const klijenti = ref([])

function dohvati () {
  axios.get('http://localhost:3000/klijent')
    .then(res => {
      klijenti.value = res.data
    })
}

onMounted(dohvati)

defineExpose({ dohvati })
</script>

<style scoped lang="sass">
.my-card
  width: 100%
  max-width: 250px
</style>
