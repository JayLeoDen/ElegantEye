<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Moje rezervacije i profil</h1>
    <p class="subtle q-mb-lg">Pregled statusa rezervacija, dodavanje napomena i slanje povratnih informacija.</p>

    <q-card flat bordered class="q-pa-md q-mb-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4"><q-select outlined dense v-model="filter" :options="statusi" label="Filtriraj po statusu" /></div>
        <div class="col-12 col-md-4 flex items-end"><q-btn outline color="primary" label="Osvježi" @click="load" /></div>
      </div>
    </q-card>

    <q-table flat bordered :rows="filteredRows" :columns="columns" row-key="rezervacija_id" :loading="loading">
      <template #body-cell-status_rezervacije="p"><q-td :props="p"><span class="status-pill">{{ p.value || 'na cekanju' }}</span></q-td></template>
      <template #body-cell-actions="p">
        <q-td :props="p">
          <q-btn dense outline color="primary" label="Napomena" @click="openNote(p.row)" class="q-mr-sm" />
          <q-btn dense outline color="secondary" label="Recenzija" @click="openReview(p.row)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="noteDialog">
      <q-card style="min-width:360px">
        <q-card-section><div class="text-h6">Dodaj napomenu rezervaciji</div></q-card-section>
        <q-card-section><q-input outlined type="textarea" v-model="note.sadrzaj" label="Posebni zahtjevi / napomena" /></q-card-section>
        <q-card-actions align="right"><q-btn flat label="Odustani" v-close-popup /><q-btn color="primary" label="Spremi" @click="saveNote" /></q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="reviewDialog">
      <q-card style="min-width:360px">
        <q-card-section><div class="text-h6">Povratna informacija</div></q-card-section>
        <q-card-section class="q-gutter-md"><q-rating v-model="review.ocjena" size="2em" /><q-input outlined type="textarea" v-model="review.komentar" label="Komentar" /></q-card-section>
        <q-card-actions align="right"><q-btn flat label="Odustani" v-close-popup /><q-btn color="primary" label="Spremi" @click="saveReview" /></q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'

const $q = useQuasar()
const user = getUser()
const loading = ref(false)
const rows = ref([])
const selectedRow = ref(null)
const filter = ref('sve')
const statusi = ['sve', 'na cekanju', 'potvrdjena', 'odbijena', 'otkazana']
const noteDialog = ref(false)
const reviewDialog = ref(false)
const note = reactive({ sadrzaj: '' })
const review = reactive({ ocjena: 5, komentar: '' })
const filteredRows = computed(() => filter.value === 'sve' ? rows.value : rows.value.filter(r => (r.status_rezervacije || 'na cekanju') === filter.value))
const columns = [
  { name: 'rezervacija_id', label: 'ID', field: 'rezervacija_id', align: 'left' },
  { name: 'datum', label: 'Datum', field: 'datum_nove_rezervacije', align: 'left' },
  { name: 'vrijeme', label: 'Vrijeme', field: 'vrijeme_nove_rezervacije', align: 'left' },
  { name: 'usluga', label: 'Usluga', field: 'naziv_usluge', align: 'left' },
  { name: 'fotograf', label: 'Fotograf', field: r => `${r.ime_fotografa_snimatelja || ''} ${r.prezime_fotografa_snimatelja || ''}`, align: 'left' },
  { name: 'status_rezervacije', label: 'Status', field: 'status_rezervacije', align: 'left' },
  { name: 'actions', label: 'Akcije', field: 'actions', align: 'right' }
]
async function load () { loading.value = true; try { rows.value = (await api.get('/rezervacije', { params: { korisnik_id: user?.id } })).data } finally { loading.value = false } }
function openNote (row) { selectedRow.value = row; note.sadrzaj = row.napomena_rezervacije || ''; noteDialog.value = true }
function openReview (row) { selectedRow.value = row; review.ocjena = 5; review.komentar = ''; reviewDialog.value = true }
async function saveNote () {
  try {
    await api.post('/poruke', { korisnik_id: user?.id, rezervacija_id: selectedRow.value.rezervacija_id, sadrzaj: note.sadrzaj, tip_poruke: 'napomena_rezervacije' })
    $q.notify({ type: 'positive', message: 'Napomena spremljena' })
    noteDialog.value = false
  } catch (e) { $q.notify({ type: 'negative', message: e.response?.data?.error || 'Greška' }) }
}
async function saveReview () {
  try {
    await api.post('/povratne-informacije', { korisnik_id: user?.id, rezervacija_id: selectedRow.value.rezervacija_id, ...review })
    $q.notify({ type: 'positive', message: 'Recenzija spremljena' })
    reviewDialog.value = false
  } catch (e) { $q.notify({ type: 'negative', message: e.response?.data?.error || 'Greška' }) }
}
onMounted(load)
</script>
