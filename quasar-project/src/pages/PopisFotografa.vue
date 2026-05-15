<template>
  <q-page padding>
    <h2>Popis svih fotografa</h2>

    <div class="q-mt-lg q-ml-md">
      <div class="row q-col-gutter-md">
        <q-card
          v-for="osoba in fotografi"
          :key="osoba.fotograf_snimatelj_id"
          bordered
          class="col-12 col-md-4 q-pa-sm"
        >
          <q-card-section>
            <div class="text-h6">{{ osoba.ime_fotografa_snimatelja }} {{ osoba.prezime_fotografa_snimatelja }}</div>
            <div class="text-subtitle2">ID: {{ osoba.fotograf_snimatelj_id }}</div>


            <div class="q-mt-sm">Email: {{ osoba.email_adresa_fotografa_snimatelja }}</div>
            <div>Opis rada: {{ osoba.opis_rada_fotografa_snimatelja }}</div>


          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const fotografi = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/fotografi')
    fotografi.value = res.data
  } catch (err) {
    console.error(err)
  }
})
</script>