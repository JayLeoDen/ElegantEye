<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Moje rezervacije i profil</h1>

    <section class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="q-ml-md">Moje rezervacije i profil</span>
      </div>

      <div class="mock-content">

      <div class="menu-box">
        <button
          class="mock-menu-button"
          @click="$router.push('/korisnik/rezervacija')"
        >
          Nova rezervacije
        </button>

        <button
          class="mock-menu-button"
          @click="$router.push('/korisnik/profil')"
        >
          Moj profil
        </button>

        <button
          class="mock-menu-button"
          @click="$router.push('/korisnik/usluge')"
        >
          Usluge
        </button>
      </div>

        <q-table
          flat
          bordered
          class="reservation-table"
          :rows="filteredRows"
          :columns="columns"
          row-key="rezervacija_id"
          :loading="loading"
          hide-bottom
        >
          <template #body-cell-status_rezervacije="p">
            <q-td :props="p">
              {{ p.value || 'Na čekanju' }}
            </q-td>
          </template>

          <template #body-cell-actions="p">
            <q-td :props="p">
              <div class="row q-gutter-sm">
                <q-btn
                  dense
                  outline
                  color="orange"
                  label="Ažuriraj"
                  @click="openEdit(p.row)"
                />

                <q-btn
                  dense
                  outline
                  color="red"
                  label="Otkaži"
                  @click="deleteReservation(p.row)"
                />

                <q-btn
                  dense
                  outline
                  color="green"
                  label="Recenzija"
                  @click="openReview(p.row)"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </section>

    <q-dialog v-model="editDialog">
      <q-card style="min-width: 420px">
        <q-card-section>
          <div class="text-h6">Ažuriraj rezervaciju</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            outlined
            type="date"
            v-model="editForm.datum_nove_rezervacije"
            label="Datum događaja"
            :min="today"
          />

          <q-input
            outlined
            type="time"
            v-model="editForm.vrijeme_nove_rezervacije"
            label="Vrijeme događaja"
          />

          <q-input
            outlined
            v-model="editForm.lokacija_dogadaja"
            label="Lokacija događaja"
          />

          <q-input
            outlined
            type="textarea"
            v-model="editForm.napomena_rezervacije"
            label="Napomena"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="primary" label="Spremi" @click="updateReservation" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="reviewDialog">
      <q-card style="min-width:360px">
        <q-card-section>
          <div class="text-h6">Povratna informacija</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-rating v-model="review.ocjena" size="2em" />
          <q-input
            outlined
            type="textarea"
            v-model="review.komentar"
            label="Komentar"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="primary" label="Spremi" @click="saveReview" />
        </q-card-actions>
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

const editDialog = ref(false)
const reviewDialog = ref(false)

const today = new Date().toISOString().split('T')[0]

const editForm = reactive({
  rezervacija_id: null,
  datum_nove_rezervacije: '',
  vrijeme_nove_rezervacije: '',
  lokacija_dogadaja: '',
  napomena_rezervacije: ''
})

const review = reactive({
  ocjena: 5,
  komentar: ''
})

const filteredRows = computed(() => rows.value)

const columns = [
  {
    name: 'usluga',
    label: 'Usluga',
    field: 'naziv_usluge',
    align: 'left'
  },
  {
    name: 'datum',
    label: 'Datum',
    field: row => {
      if (!row.datum_nove_rezervacije) return ''

      return String(row.datum_nove_rezervacije).split('T')[0]
    },
    align: 'left'
  },
  {
    name: 'vrijeme',
    label: 'Vrijeme',
    field: row => {
      if (!row.vrijeme_nove_rezervacije) return ''

      return String(row.vrijeme_nove_rezervacije).substring(0, 5)
    },
    align: 'left'
  },
  {
    name: 'status_rezervacije',
    label: 'Status',
    field: 'status_rezervacije',
    align: 'left'
  },
  {
    name: 'actions',
    label: 'Akcija',
    field: 'actions',
    align: 'left'
  }
]

async function load () {
  loading.value = true

  try {
    rows.value = (
      await api.get('/rezervacije', {
        params: {
          korisnik_id: user?.id
        }
      })
    ).data
  } finally {
    loading.value = false
  }
}

function openEdit (row) {
  selectedRow.value = row

  editForm.rezervacija_id = row.rezervacija_id
  editForm.datum_nove_rezervacije = row.datum_nove_rezervacije
    ? String(row.datum_nove_rezervacije).split('T')[0]
    : ''

  editForm.vrijeme_nove_rezervacije = row.vrijeme_nove_rezervacije
    ? String(row.vrijeme_nove_rezervacije).substring(0, 5)
    : ''
  editForm.lokacija_dogadaja = row.lokacija_dogadaja || ''
  editForm.napomena_rezervacije = row.napomena_rezervacije || ''

  editDialog.value = true
}

function openReview (row) {
  selectedRow.value = row
  reviewDialog.value = true
}

async function updateReservation () {
  if (editForm.datum_nove_rezervacije < today) {
    $q.notify({
      type: 'negative',
      message: 'Nije moguće odabrati datum u prošlosti.'
    })
    return
  }

  try {
    await api.put(`/rezervacije/${editForm.rezervacija_id}`, editForm)

    $q.notify({
      type: 'positive',
      message: 'Rezervacija ažurirana'
    })

    editDialog.value = false
    await load()
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: e.response?.data?.error || 'Greška kod ažuriranja rezervacije'
    })
  }
}

async function deleteReservation (row) {
  $q.dialog({
    title: 'Potvrda',
    message: 'Želiš li stvarno otkazati ovu rezervaciju?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/rezervacije/${row.rezervacija_id}`)

      $q.notify({
        type: 'positive',
        message: 'Rezervacija otkazana'
      })

      await load()
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.response?.data?.error || 'Greška kod otkazivanja rezervacije'
      })
    }
  })
}

async function saveReview () {
  try {
    await api.post('/povratne-informacije', {
      korisnik_id: user?.id,
      usluga_id: selectedRow.value?.usluga_id,
      ocjena: review.ocjena,
      komentar: review.komentar
    })

    $q.notify({
      type: 'positive',
      message: 'Recenzija spremljena'
    })

    reviewDialog.value = false
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: e.response?.data?.error || 'Greška kod spremanja recenzije'
    })
  }
}

onMounted(load)
</script>

<style scoped>
.ee-page {
  min-height: 100vh;
  padding: 32px 18px;
  background: #f8fbff;
}

.page-heading {
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 18px;
  color: #17233c;
}

.mock-window {
  max-width: 980px;
  margin: 0 auto;
  border: 1px solid #cfd8e3;
  border-radius: 16px;
  background: #f8fbff;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(20, 40, 80, 0.08);
}

.mock-bar {
  height: 36px;
  background: #d7e0eb;
  border-bottom: 1px solid #c4cfdd;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 700;
  color: #43546a;
}

.mock-dot {
  width: 9px;
  height: 9px;
  background: #8fa0b5;
  border-radius: 50%;
  display: inline-block;
  margin-right: 7px;
}

.mock-content {
  padding: 22px;
  background: #f8fbff;
}

.menu-box {
  border: 1px solid #d9e3ef;
  border-radius: 12px;
  background: white;
  padding: 10px;
  margin-bottom: 26px;
}

.mock-menu-button {
  width: 100%;
  height: 44px;
  border: 1px solid #d9e3ef;
  border-radius: 9px;
  background: #ffffff;
  color: #4a5568;
  font-weight: 500;
  text-align: left;
  padding: 0 14px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mock-menu-button:last-child {
  margin-bottom: 0;
}

.mock-menu-button:hover {
  background: #f8fbff;
  border-color: #d0dbea;
}

.reservation-table {
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

:deep(.reservation-table thead tr) {
  background: #e9eefb;
}

:deep(.reservation-table th) {
  font-weight: 800;
  color: #26364f;
}

:deep(.reservation-table td) {
  color: #26364f;
}

.q-btn {
  border-radius: 9px;
  font-weight: 700;
}
</style>