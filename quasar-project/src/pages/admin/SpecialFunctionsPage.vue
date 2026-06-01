<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Specijalne funkcije</h1>
    <p class="subtle q-mb-lg">Administratorske funkcije za nadzor sustava, obavijesti i kvalitetu usluge.</p>

    <div class="ee-grid q-mb-lg">
      <q-card v-for="item in cards" :key="item.title" flat bordered class="q-pa-lg">
        <q-icon :name="item.icon" color="primary" size="42px" />
        <div class="text-h6 q-mt-md">{{ item.title }}</div>
        <p class="subtle">{{ item.text }}</p>
        <q-btn outline color="primary" :label="item.button" @click="item.action" />
      </q-card>
    </div>

    <q-card flat bordered class="q-pa-lg">
      <div class="text-h6 q-mb-md">Slanje obavijesti korisnicima</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4"><q-input outlined dense v-model="message.naslov" label="Naslov" /></div>
        <div class="col-12 col-md-8"><q-input outlined dense v-model="message.sadrzaj" label="Sadržaj obavijesti" /></div>
        <div class="col-12"><q-btn color="primary" label="Pošalji obavijest" @click="send" /></div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const message = reactive({ naslov: '', sadrzaj: '' })
const cards = [
  { title: 'Statistika sustava', icon: 'query_stats', text: 'Pregled broja rezervacija, korisnika, fotografa i ocjena.', button: 'Otvori izvještaje', action: () => location.hash = '#/admin/izvjestaji' },
  { title: 'Kontrola portfolija', icon: 'collections', text: 'Pregled i kontrola sadržaja koji fotografi objavljuju u portfoliju.', button: 'Pregledaj', action: () => $q.notify('Funkcija je pripremljena za povezivanje s API-jem.') },
  { title: 'Napomene događaja', icon: 'speaker_notes', text: 'Pregled posebnih zahtjeva i napomena vezanih uz događaje.', button: 'Pregledaj', action: () => $q.notify('Napomene su dostupne kroz rezervacije.') }
]

function send () {
  $q.notify({ type: 'positive', message: 'Obavijest je pripremljena za slanje.' })
  message.naslov = ''
  message.sadrzaj = ''
}
</script>
