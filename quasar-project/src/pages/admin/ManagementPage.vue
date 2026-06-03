<template>
  <div class="ee-page">
    <div class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-bar-title">Upravljanje podacima</span>
      </div>

      <div class="mock-content">

        <div class="tab-row q-mb-md">
          <q-btn
            v-for="tab in tabs"
            :key="tab.key"
            :label="tab.label"
            :outline="activeTab !== tab.key"
            :color="activeTab === tab.key ? 'primary' : 'grey-7'"
            size="sm"
            no-caps
            class="tab-btn"
            @click="switchTab(tab.key)"
          />
        </div>

        <q-table
          :rows="rows"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :loading="loading"
          selection="single"
          v-model:selected="selected"
          :rows-per-page-options="[10, 20, 0]"
          class="crud-table"
          no-data-label="Nema podataka"
          loading-label="Učitavanje..."
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="statusColor(props.row.status)"
                :text-color="statusTextColor(props.row.status)"
                class="status-badge"
              >
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-action="props">
            <q-td :props="props">
              <span class="inline-action-link" @click="handleInlineAction(props.row)">
                {{ props.row.action }}
              </span>
            </q-td>
          </template>
        </q-table>

        <div class="action-row q-mt-md q-gutter-sm">
          <q-btn
            label="Dodaj novo"
            color="green"
            size="sm"
            no-caps
            unelevated
            class="action-btn"
            @click="openAddDialog"
          />
          <q-btn
            label="Uredi odabrano"
            color="amber-7"
            size="sm"
            no-caps
            unelevated
            class="action-btn"
            :disable="selected.length === 0"
            @click="openEditDialog"
          />
          <q-btn
            label="Obriši / deaktiviraj"
            color="red-4"
            size="sm"
            no-caps
            unelevated
            class="action-btn"
            :disable="selected.length === 0"
            @click="confirmDeleteOpen"
          />
        </div>
      </div>
    </div>

    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 360px">
        <q-card-section>
          <div class="text-h6">{{ dialogMode === 'add' ? 'Dodaj novo' : 'Uredi' }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">

          <template v-if="activeTab === 'korisnici'">
            <q-input v-model="form.ime"     label="Ime"     outlined dense />
            <q-input v-model="form.prezime" label="Prezime" outlined dense />
            <q-input v-model="form.email"   label="Email"   outlined dense type="email" />
          </template>

          <template v-else-if="activeTab === 'usluge'">
            <q-input v-model="form.naziv"  label="Naziv usluge" outlined dense />
            <q-input v-model="form.opis"   label="Opis"         outlined dense type="textarea" autogrow />
            <q-input v-model="form.cijena" label="Cijena (EUR)" outlined dense type="number" />
          </template>

          <template v-else-if="activeTab === 'rezervacije'">
            <q-select
              v-model="form.status"
              label="Status rezervacije"
              :options="['Aktivna', 'Otkazana', 'Završena', 'Na čekanju']"
              outlined dense
            />
          </template>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" color="grey"    no-caps v-close-popup />
          <q-btn flat label="Spremi"   color="primary" no-caps :loading="saving" @click="saveRecord" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Potvrda brisanja</div>
          <div class="q-mt-sm text-body2">
            Jeste li sigurni da želite obrisati/deaktivirati odabrani zapis?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Odustani" color="grey"     no-caps v-close-popup />
          <q-btn flat label="Obriši"   color="negative" no-caps :loading="deleting" @click="deleteRecord" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

const tabs = [
  { key: 'korisnici',   label: 'Korisnici'   },
  { key: 'usluge',      label: 'Usluge'      },
  { key: 'rezervacije', label: 'Rezervacije' }
]
const activeTab = ref('korisnici')

const loading  = ref(false)
const rows     = ref([])
const selected = ref([])

const columnsMap = {
  korisnici: [
    { name: 'naziv',  label: 'Naziv / Korisnik', field: 'naziv',  align: 'left', sortable: true },
    { name: 'vrsta',  label: 'Vrsta',             field: 'vrsta',  align: 'left' },
    { name: 'status', label: 'Status',            field: 'status', align: 'left' },
    { name: 'action', label: 'Akcija',            field: 'action', align: 'left' }
  ],
  usluge: [
    { name: 'naziv',  label: 'Naziv usluge', field: 'naziv',  align: 'left', sortable: true },
    { name: 'cijena', label: 'Cijena',       field: 'cijena', align: 'left' },
    { name: 'status', label: 'Status',       field: 'status', align: 'left' },
    { name: 'action', label: 'Akcija',       field: 'action', align: 'left' }
  ],
  rezervacije: [
    { name: 'naziv',  label: 'Naziv / Korisnik', field: 'naziv',  align: 'left', sortable: true },
    { name: 'datum',  label: 'Datum',            field: 'datum',  align: 'left' },
    { name: 'status', label: 'Status',           field: 'status', align: 'left' },
    { name: 'action', label: 'Akcija',           field: 'action', align: 'left' }
  ]
}
const columns = computed(() => columnsMap[activeTab.value])


async function fetchData () {
  loading.value  = true
  selected.value = []
  rows.value     = []
  try {
    if (activeTab.value === 'korisnici') {
      const { data } = await api.get('/korisnici')
      rows.value = data.map(k => ({
        id:     k.korisnik_id,
        naziv:  `${k.ime} ${k.prezime}`,
        vrsta:  'Korisnik',
        status: 'Aktivan',
        action: 'Uredi',
        _raw:   k
      }))

    } else if (activeTab.value === 'usluge') {
      const { data } = await api.get('/usluge')
      rows.value = data.map(u => ({
        id:     u.usluga_id,
        naziv:  u.naziv,
        cijena: `${u.cijena} EUR`,
        status: 'Aktivan',
        action: 'Uredi',
        _raw:   u
      }))

    } else if (activeTab.value === 'rezervacije') {
      const { data } = await api.get('/rezervacije')
      rows.value = data.map(r => ({
        id:     r.rezervacija_id,
        naziv:  r.ime_korisnika
          ? `${r.ime_korisnika} ${r.prezime_korisnika}`
          : `Rezervacija #${r.rezervacija_id}`,
        datum:  r.datum_nove_rezervacije?.substring(0, 10) ?? '-',
        status: r.status_rezervacije ?? 'Na čekanju',
        action: 'Uredi',
        _raw:   r
      }))
    }
  } catch (err) {
    console.error('Greška pri dohvatu podataka:', err)
    $q.notify({ type: 'negative', message: 'Greška pri dohvatu podataka.' })
  } finally {
    loading.value = false
  }
}

function switchTab (key) {
  activeTab.value = key
  fetchData()
}

onMounted(fetchData)

function handleInlineAction (row) {
  selected.value = [row]
  openEditDialog()
}

function statusColor (status) {
  const map = {
    'Aktivan':    'green-2',
    'Aktivna':    'green-2',
    'Završena':   'blue-2',
    'Otkazana':   'red-2',
    'Na čekanju': 'orange-2'
  }
  return map[status] ?? 'grey-3'
}
function statusTextColor (status) {
  const map = {
    'Aktivan':    'green-9',
    'Aktivna':    'green-9',
    'Završena':   'blue-9',
    'Otkazana':   'red-9',
    'Na čekanju': 'orange-9'
  }
  return map[status] ?? 'grey-8'
}

const dialogOpen = ref(false)
const dialogMode = ref('add')
const saving     = ref(false)
const emptyForm  = () => ({ ime: '', prezime: '', email: '', naziv: '', opis: '', cijena: '', trajanje: '', status: '' })
const form       = ref(emptyForm())

function openAddDialog () {
  dialogMode.value = 'add'
  form.value = emptyForm()
  dialogOpen.value = true
}

function openEditDialog () {
  if (!selected.value || selected.value.length === 0) {
    $q.notify({ type: 'warning', message: 'Nije ništa odabrano.' })
    return
  }
  const raw = selected.value[0]._raw
  dialogMode.value = 'edit'

  if (activeTab.value === 'korisnici') {
    form.value = {
      ...emptyForm(),
      ime:     raw.ime     ?? '',
      prezime: raw.prezime ?? '',
      email:   raw.email   ?? ''
    }
  } else if (activeTab.value === 'usluge') {
    form.value = {
      ...emptyForm(),
      naziv:   raw.naziv   ?? '',
      opis:    raw.opis    ?? '',
      cijena:  raw.cijena  ?? '',
      trajanje: raw.trajanje ?? ''
    }
  } else if (activeTab.value === 'rezervacije') {
    form.value = {
      ...emptyForm(),
      status: raw.status_rezervacije ?? ''
    }
  }

  dialogOpen.value = true
}

async function saveRecord () {
  saving.value = true
  try {
    const tab = activeTab.value
    const id  = selected.value[0]?.id

    if (dialogMode.value === 'add') {
      if (tab === 'korisnici') {
        // POST /api/korisnici → { ime, prezime, email }
        await api.post('/korisnici', {
          ime:     form.value.ime,
          prezime: form.value.prezime,
          email:   form.value.email
        })
      } else if (tab === 'usluge') {
        await api.post('/usluge', {
          naziv:    form.value.naziv,
          opis:     form.value.opis,
          cijena:   form.value.cijena,
          trajanje: form.value.trajanje || '00:00:00'
        })
      } else if (tab === 'rezervacije') {
        $q.notify({ type: 'warning', message: 'Dodavanje rezervacija nije podržano u ovoj formi.' })
        return
      }
      $q.notify({ type: 'positive', message: 'Zapis uspješno dodan.' })

    } else {
      if (tab === 'korisnici') {
        await api.put(`/korisnici/${id}`, {
          ime:     form.value.ime,
          prezime: form.value.prezime,
          email:   form.value.email
        })
      } else if (tab === 'usluge') {
        await api.put(`/usluge/${id}`, {
          naziv:    form.value.naziv,
          opis:     form.value.opis,
          cijena:   form.value.cijena,
          trajanje: form.value.trajanje || '00:00:00'
        })
      } else if (tab === 'rezervacije') {
        await api.put(`/rezervacije/${id}/status`, {
          status: form.value.status
        })
      }
      $q.notify({ type: 'positive', message: 'Zapis uspješno ažuriran.' })
    }

    dialogOpen.value = false
    fetchData()

  } catch (err) {
    console.error('Greška pri spremanju:', err)
    $q.notify({ type: 'negative', message: 'Greška pri spremanju: ' + (err.response?.data?.error || err.message) })
  } finally {
    saving.value = false
  }
}

const confirmOpen = ref(false)
const deleting    = ref(false)

function confirmDeleteOpen () {
  if (selected.value.length === 0) return
  confirmOpen.value = true
}

async function deleteRecord () {
  deleting.value = true
  const id  = selected.value[0].id
  const tab = activeTab.value
  try {
    if (tab === 'korisnici') {
      await api.delete(`/korisnici/${id}`)
    } else if (tab === 'usluge') {
      await api.delete(`/usluge/${id}`)
    } else if (tab === 'rezervacije') {
      await api.delete(`/rezervacije/${id}`)
    }
    $q.notify({ type: 'positive', message: 'Zapis uspješno obrisan.' })
    confirmOpen.value = false
    fetchData()
  } catch (err) {
    console.error('Greška pri brisanju:', err)
    $q.notify({ type: 'negative', message: 'Greška pri brisanju: ' + (err.response?.data?.error || err.message) })
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.ee-page {
  padding: 32px 24px;
  max-width: 740px;
  margin: 0 auto;
}

.mock-window {
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.mock-bar {
  background: #f2f2f2;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mock-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cacaca;
  display: inline-block;
}

.mock-bar-title {
  margin-left: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #555;
}

.mock-content {
  padding: 20px 18px 24px;
}

.tab-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  border-radius: 20px;
  font-size: 13px;
}

.crud-table {
  font-size: 14px;
  border-radius: 8px;
  overflow: hidden;
}

.crud-table :deep(thead tr th) {
  background: #f0f4f8;
  font-weight: 600;
  font-size: 13px;
  color: #444;
}

.status-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.inline-action-link {
  color: #1976d2;
  cursor: pointer;
  font-size: 13px;
  text-decoration: underline;
}

.inline-action-link:hover {
  color: #1250a0;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
}

.action-btn {
  border-radius: 20px;
}
</style>