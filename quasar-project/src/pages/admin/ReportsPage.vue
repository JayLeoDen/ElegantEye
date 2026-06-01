<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Izvještaji i specijalne funkcije</h1>
    <q-card flat bordered class="q-pa-md q-mb-md"><div class="row q-col-gutter-md"><div class="col-12 col-md-4"><q-input outlined dense type="date" label="Od datuma" /></div><div class="col-12 col-md-4"><q-input outlined dense type="date" label="Do datuma" /></div><div class="col-12 col-md-4"><q-select outlined dense label="Status rezervacije" :options="['sve','na cekanju','potvrdjena','odbijena']" /></div></div></q-card>
    <div class="ee-grid">
      <q-card v-for="c in cards" :key="c.label" flat bordered class="q-pa-lg text-center"><q-icon :name="c.icon" color="primary" size="38px"/><div class="text-h4 text-weight-bold q-mt-sm">{{ c.value }}</div><div class="subtle">{{ c.label }}</div></q-card>
    </div>
  </q-page>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from 'boot/axios'
const data = ref({})
const cards = computed(()=>[
  {label:'Broj rezervacija', value:data.value.rezervacije ?? 0, icon:'event'},
  {label:'Registrirani korisnici', value:data.value.korisnici ?? 0, icon:'people'},
  {label:'Fotografi/Snimatelji', value:data.value.fotografi ?? 0, icon:'photo_camera'},
  {label:'Dostupne usluge', value:data.value.usluge ?? 0, icon:'design_services'},
  {label:'Prosječna ocjena', value:data.value.prosjecna_ocjena ?? 0, icon:'star'}
])
onMounted(async () => {
  try {
    data.value = (await api.get('/reports/summary')).data
  } catch (err) {
    console.error('Greška kod dohvaćanja izvještaja:', err)
  }
})
</script>
