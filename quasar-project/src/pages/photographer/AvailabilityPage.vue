<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Dostupnost fotografa/snimatelja</h1>

    <q-card flat bordered class="q-pa-md q-mb-md">
      <q-form @submit.prevent="save" class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-input
            outlined
            dense
            v-model="form.datum_dostupnosti"
            type="date"
            label="Datum dostupnosti"
            :min="today"
          />
        </div>

        <div class="col-12 col-md-4">
          <q-input
            outlined
            dense
            v-model="form.vrijeme_dostupnosti"
            type="time"
            label="Vrijeme dostupnosti"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-select
            outlined
            dense
            v-model="form.status_dostupnosti"
            :options="statusOptions"
            label="Status"
          />
        </div>

        <div class="col-12 col-md-1 flex items-end">
          <q-btn color="primary" icon="add" type="submit" />
        </div>
      </q-form>
    </q-card>

    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="dostupnost_id"
      no-data-label="Nema unesenih termina dostupnosti."
    />
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'

const $q = useQuasar()
const user = getUser() || {}

const rows = ref([])
const today = new Date().toISOString().slice(0, 10)

const statusOptions = ['slobodan', 'zauzet']

const form = reactive({
  fotograf_snimatelj_id: user.id || '',
  ime_fotografa_snimatelja: user.ime || '',
  prezime_fotografa_snimatelja: user.prezime || '',
  datum_dostupnosti: '',
  vrijeme_dostupnosti: '',
  status_dostupnosti: 'slobodan'
})

const columns = [
  {
    name: 'datum',
    label: 'Datum',
    field: row => formatDate(row.datum_dostupnosti),
    align: 'left',
    sortable: true
  },
  {
    name: 'vrijeme',
    label: 'Vrijeme',
    field: row => formatTime(row.vrijeme_dostupnosti),
    align: 'left'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status_dostupnosti',
    align: 'left'
  }
]

function formatDate (value) {
  if (!value) return ''
  return String(value).slice(0, 10).split('-').reverse().join('.')
}

function formatTime (value) {
  if (!value) return ''
  return String(value).slice(0, 5)
}

async function load () {
  try {
    const res = await api.get('/dostupnost', {
      params: {
        fotograf_snimatelj_id: form.fotograf_snimatelj_id
      }
    })

    rows.value = res.data
  } catch (error) {
    console.error(error)

    rows.value = []

    $q.notify({
      type: 'negative',
      message: 'Greška kod učitavanja dostupnosti.'
    })
  }
}

async function save () {
  if (!form.fotograf_snimatelj_id) {
    $q.notify({
      type: 'negative',
      message: 'Nije pronađen ID fotografa. Prijavi se ponovno.'
    })
    return
  }

  if (!form.datum_dostupnosti || !form.vrijeme_dostupnosti || !form.status_dostupnosti) {
    $q.notify({
      type: 'warning',
      message: 'Unesi datum, vrijeme i status.'
    })
    return
  }

  try {
    await api.post('/dostupnost', {
      fotograf_snimatelj_id: form.fotograf_snimatelj_id,
      datum_dostupnosti: form.datum_dostupnosti,
      vrijeme_dostupnosti: form.vrijeme_dostupnosti,
      status_dostupnosti: form.status_dostupnosti,
      ime_fotografa_snimatelja: form.ime_fotografa_snimatelja,
      prezime_fotografa_snimatelja: form.prezime_fotografa_snimatelja
    })

    $q.notify({
      type: 'positive',
      message: 'Dostupnost je spremljena.'
    })

    form.datum_dostupnosti = ''
    form.vrijeme_dostupnosti = ''
    form.status_dostupnosti = 'slobodan'

    await load()
  } catch (error) {
    console.error(error.response?.data || error)

    $q.notify({
      type: 'negative',
      message: error.response?.data?.error || 'Greška kod spremanja dostupnosti.'
    })
  }
}

onMounted(load)
</script>

<style scoped>
.ee-page {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100vh;
}

.page-heading {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 20px;
  color: #17213a;
}
</style>