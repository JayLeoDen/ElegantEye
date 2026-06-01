<template>
  <q-page class="ee-page">
    <h1 class="page-heading">{{ config.title }}</h1>

    <q-card flat bordered class="q-pa-md q-mb-md">
      <q-form @submit.prevent="save" class="row q-col-gutter-md">
        <div
          v-for="field in config.fields"
          :key="field.name"
          class="col-12 col-md-3"
        >
          <q-input
             v-if="field.name !== 'trajanje'"
            outlined
            dense
            v-model="form[field.name]"
            :label="field.label"
            :type="field.type || 'text'"
          />

          <q-input
            v-else
            outlined
            dense
            v-model="form.trajanje"
            label="Trajanje (HH:MM:SS)"
            mask="##:##:##"
            hint="Primjer: 01:30:00"
          />
        </div>

        <div class="col-12 col-md-2 flex items-end">
          <q-btn
            color="primary"
            :label="editing ? 'Spremi izmjene' : 'Dodaj'"
            type="submit"
          />
        </div>
      </q-form>
    </q-card>

    <q-table
      flat
      bordered
      :rows="rows"
      :columns="config.columns"
      :row-key="config.id"
      :loading="loading"
      no-data-label="Nema podataka"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            flat
            icon="edit"
            color="primary"
            @click="edit(props.row)"
          />
          <q-btn
            dense
            flat
            icon="delete"
            color="negative"
            @click="remove(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const route = useRoute()
const $q = useQuasar()

const rows = ref([])
const loading = ref(false)
const editing = ref(null)
const form = reactive({})

const configs = {
  korisnici: {
    title: 'Upravljanje korisnicima',
    endpoint: '/korisnici',
    id: 'korisnik_id',
    fields: [],
    columns: [
      { name: 'korisnik_id', label: 'ID', field: 'korisnik_id', align: 'left' },
      { name: 'ime', label: 'Ime', field: 'ime', align: 'left' },
      { name: 'prezime', label: 'Prezime', field: 'prezime', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' }
    ]
  },

  fotografi: {
    title: 'Upravljanje fotografima/snimateljima',
    endpoint: '/fotografi',
    id: 'fotograf_snimatelj_id',
    fields: [
      { name: 'ime', label: 'Ime' },
      { name: 'prezime', label: 'Prezime' },
      { name: 'email', label: 'Email' },
      { name: 'lozinka', label: 'Lozinka' },
      { name: 'opis_rada', label: 'Opis rada' }
    ],
    columns: [
      { name: 'fotograf_snimatelj_id', label: 'ID', field: 'fotograf_snimatelj_id', align: 'left' },
      { name: 'ime', label: 'Ime', field: 'ime', align: 'left' },
      { name: 'prezime', label: 'Prezime', field: 'prezime', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'opis_rada', label: 'Opis', field: 'opis_rada', align: 'left' },
      { name: 'actions', label: 'Akcije', field: 'actions', align: 'right' }
    ]
  },

  usluge: {
    title: 'Upravljanje uslugama',
    endpoint: '/usluge',
    id: 'usluga_id',
    fields: [
      { name: 'naziv', label: 'Naziv' },
      { name: 'opis', label: 'Opis' },
      { name: 'cijena', label: 'Cijena', type: 'number' },
      { name: 'trajanje', label: 'Trajanje (HH:MM:SS)'}
    ],
    columns: [
      { name: 'usluga_id', label: 'ID', field: 'usluga_id', align: 'left' },
      { name: 'naziv', label: 'Naziv', field: 'naziv', align: 'left' },
      { name: 'opis', label: 'Opis', field: 'opis', align: 'left' },
      { name: 'cijena', label: 'Cijena', field: 'cijena', align: 'left' },
      { name: 'trajanje', label: 'Trajanje', field: 'trajanje', align: 'left' },
      { name: 'actions', label: 'Akcije', field: 'actions', align: 'right' }
    ]
  }
}

const config = computed(() => {
  if (route.path.includes('/admin/korisnici')) return configs.korisnici
  if (route.path.includes('/admin/fotografi')) return configs.fotografi
  if (route.path.includes('/admin/usluge')) return configs.usluge

  return configs.usluge
})

function reset () {
  Object.keys(form).forEach(key => {
    delete form[key]
  })

  config.value.fields.forEach(field => {
    form[field.name] = ''
  })

  editing.value = null
}

async function load () {
  loading.value = true

  try {
    const response = await api.get(config.value.endpoint)

    console.log('PATH:', route.path)
    console.log('ENDPOINT:', config.value.endpoint)
    console.log('RESPONSE:', response.data)

    rows.value = Array.isArray(response.data)
      ? response.data
      : []

    console.log('ROWS:', rows.value)
  } catch (e) {
    console.error('Greška kod dohvaćanja:', e)

    rows.value = []

    $q.notify({
      type: 'negative',
      message: e.response?.data?.error || 'Greška kod dohvaćanja podataka'
    })
  } finally {
    loading.value = false
  }
}

function edit (row) {
  editing.value = row

  config.value.fields.forEach(field => {
    form[field.name] = row[field.name] ?? ''
  })
}

async function save () {
  try {
    if (editing.value) {
      await api.put(
        `${config.value.endpoint}/${editing.value[config.value.id]}`,
        { ...form }
      )
    } else {
      await api.post(config.value.endpoint, { ...form })
    }

    $q.notify({
      type: 'positive',
      message: 'Spremljeno'
    })

    reset()
    await load()
  } catch (e) {
    console.error('Greška kod spremanja:', e)

    $q.notify({
      type: 'negative',
      message: e.response?.data?.error || 'Greška kod spremanja'
    })
  }
}

async function remove (row) {
  try {
    await api.delete(`${config.value.endpoint}/${row[config.value.id]}`)

    $q.notify({
      type: 'positive',
      message: 'Obrisano'
    })

    await load()
  } catch (e) {
    console.error('Greška kod brisanja:', e)

    $q.notify({
      type: 'negative',
      message: e.response?.data?.error || 'Greška kod brisanja'
    })
  }
}

onMounted(async () => {
  reset()
  await load()
})

watch(
  () => route.path,
  async () => {
    reset()
    await load()
  }
)
</script>