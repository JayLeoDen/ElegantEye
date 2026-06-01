<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Upravljanje sustavom</h1>
    <p class="subtle q-mb-lg">Korisnici, fotografi/snimatelji i usluge na jednom mjestu.</p>

    <q-card flat bordered>
      <q-tabs v-model="tab" dense active-color="primary" indicator-color="primary" align="left" @update:model-value="changeTab">
        <q-tab name="korisnici" icon="people" label="Korisnici" />
        <q-tab name="fotografi" icon="photo_camera" label="Fotografi" />
        <q-tab name="usluge" icon="design_services" label="Usluge" />
      </q-tabs>
      <q-separator />

      <q-card-section>
        <q-form v-if="config.fields.length" @submit="save" class="row q-col-gutter-md q-mb-md">
          <div v-for="field in config.fields" :key="field.name" class="col-12 col-md-3">
            <q-input outlined dense v-model="form[field.name]" :label="field.label" :type="field.type || 'text'" />
          </div>
          <div class="col-12 col-md-2 flex items-end">
            <q-btn color="primary" :label="editing ? 'Spremi' : 'Dodaj'" type="submit" />
          </div>
        </q-form>

        <q-table flat bordered :rows="rows" :columns="config.columns" :row-key="config.id" :loading="loading">
          <template #body-cell-actions="p">
            <q-td :props="p">
              <q-btn dense flat icon="edit" color="primary" @click="edit(p.row)" />
              <q-btn dense flat icon="delete" color="negative" @click="remove(p.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const tab = ref('korisnici')
const rows = ref([])
const loading = ref(false)
const editing = ref(null)
const form = reactive({})

const configs = {
  korisnici: {
    endpoint: '/korisnici', id: 'korisnik_id', fields: [],
    columns: [
      { name: 'korisnik_id', label: 'ID', field: 'korisnik_id', align: 'left' },
      { name: 'ime', label: 'Ime', field: 'ime', align: 'left' },
      { name: 'prezime', label: 'Prezime', field: 'prezime', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' }
    ]
  },
  fotografi: {
    endpoint: '/fotografi', id: 'fotograf_snimatelj_id',
    fields: [{ name: 'ime', label: 'Ime' }, { name: 'prezime', label: 'Prezime' }, { name: 'email', label: 'Email' }, { name: 'lozinka', label: 'Lozinka' }, { name: 'opis_rada', label: 'Opis rada' }],
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
    endpoint: '/usluge', id: 'usluga_id',
    fields: [{ name: 'naziv', label: 'Naziv' }, { name: 'opis', label: 'Opis' }, { name: 'cijena', label: 'Cijena', type: 'number' }, { name: 'trajanje', label: 'Trajanje' }],
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
const config = computed(() => configs[tab.value])
function reset () { Object.keys(form).forEach(k => delete form[k]); config.value.fields.forEach(f => { form[f.name] = '' }); editing.value = null }
async function load () { loading.value = true; try { rows.value = (await api.get(config.value.endpoint)).data } finally { loading.value = false } }
function changeTab () { reset(); load() }
function edit (row) { editing.value = row; config.value.fields.forEach(f => { form[f.name] = row[f.name] || '' }) }
async function save () {
  try {
    if (editing.value) await api.put(`${config.value.endpoint}/${editing.value[config.value.id]}`, form)
    else await api.post(config.value.endpoint, form)
    $q.notify({ type: 'positive', message: 'Spremljeno' })
    reset(); load()
  } catch (e) { $q.notify({ type: 'negative', message: e.response?.data?.error || 'Greška' }) }
}
async function remove (row) {
  try { await api.delete(`${config.value.endpoint}/${row[config.value.id]}`); $q.notify({ type: 'positive', message: 'Obrisano' }); load() } catch (e) { $q.notify({ type: 'negative', message: e.response?.data?.error || 'Greška' }) }
}
onMounted(() => { reset(); load() })
</script>
