<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Korisnički profil</h1>
    <p class="subtle q-mb-lg">Pregled osobnih podataka i brzi pristup rezervacijama.</p>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-5">
        <q-card flat bordered class="q-pa-lg">
          <div class="text-h6 q-mb-md">Osobni podaci</div>
          <q-input outlined dense v-model="profile.ime" label="Ime" class="q-mb-md" />
          <q-input outlined dense v-model="profile.prezime" label="Prezime" class="q-mb-md" />
          <q-input outlined dense v-model="profile.email" label="Email" class="q-mb-md" />
          <q-btn color="primary" label="Spremi promjene" @click="save" />
        </q-card>
      </div>

      <div class="col-12 col-md-7">
        <q-card flat bordered class="q-pa-lg q-mb-md">
          <div class="text-h6 q-mb-md">Sažetak profila</div>
          <div class="ee-grid">
            <q-card flat bordered class="q-pa-md text-center">
              <q-icon name="event_note" color="primary" size="34px" />
              <div class="text-h5 text-weight-bold q-mt-sm">{{ reservations.length }}</div>
              <div class="subtle">Moje rezervacije</div>
            </q-card>
            <q-card flat bordered class="q-pa-md text-center">
              <q-icon name="hourglass_empty" color="primary" size="34px" />
              <div class="text-h5 text-weight-bold q-mt-sm">{{ pending }}</div>
              <div class="subtle">Na čekanju</div>
            </q-card>
          </div>
        </q-card>

        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Zadnje rezervacije</div>
          </q-card-section>
          <q-table flat :rows="reservations.slice(0, 5)" :columns="columns" row-key="rezervacija_id" hide-bottom />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getUser, setUser } from 'src/services/auth'

const $q = useQuasar()
const user = getUser() || {}
const profile = reactive({ ime: user.ime || '', prezime: user.prezime || '', email: user.email || '' })
const reservations = ref([])
const pending = computed(() => reservations.value.filter(r => (r.status_rezervacije || 'na cekanju') === 'na cekanju').length)
const columns = [
  { name: 'datum', label: 'Datum', field: 'datum_nove_rezervacije', align: 'left' },
  { name: 'vrijeme', label: 'Vrijeme', field: 'vrijeme_nove_rezervacije', align: 'left' },
  { name: 'usluga', label: 'Usluga', field: 'naziv_usluge', align: 'left' },
  { name: 'status', label: 'Status', field: r => r.status_rezervacije || 'na cekanju', align: 'left' }
]

async function load () {
  try { reservations.value = (await api.get('/rezervacije', { params: { korisnik_id: user.id } })).data } catch { reservations.value = [] }
}

function save () {
  setUser({ user: { ...user, ...profile }, token: localStorage.getItem('ee_token') })
  $q.notify({ type: 'positive', message: 'Profil je spremljen lokalno.' })
}

onMounted(load)
</script>
