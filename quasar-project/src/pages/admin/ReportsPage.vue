<template>
  <div class="ee-page">
    <div class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-bar-title">Izvještaji i specijalne funkcije</span>
      </div>

      <div class="mock-content">

        <div class="section-card q-mb-md">
          <div class="section-title">Izvještaji</div>

          <q-select
            v-model="reportFilter.razdoblje"
            :options="periodOptions"
            label="Razdoblje"
            outlined dense
            class="q-mb-sm filter-field"
            clearable
          />

          <q-select
            v-model="reportFilter.vrstaUsluge"
            :options="serviceOptions"
            label="Vrsta usluge"
            outlined dense
            class="q-mb-sm filter-field"
            clearable
            :loading="loadingServices"
          />

          <q-select
            v-model="reportFilter.statusRezervacije"
            :options="statusOptions"
            label="Status rezervacije"
            outlined dense
            class="q-mb-md filter-field"
            clearable
          />

          <q-btn
            label="Generiraj izvještaj"
            color="primary"
            no-caps unelevated size="sm"
            class="report-btn"
            :loading="generatingReport"
            @click="generateReport"
          />

          <div v-if="reportResult" class="report-result q-mt-md">
            <div class="report-result-title">Rezultati izvještaja</div>
            <q-markup-table flat bordered dense class="q-mt-sm">
              <thead>
                <tr>
                  <th class="text-left">Stavka</th>
                  <th class="text-left">Vrijednost</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(val, key) in reportResult" :key="key">
                  <td>{{ reportLabels[key] ?? key }}</td>
                  <td>{{ val ?? '-' }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>

        <div class="section-card">
          <div class="section-title">Specijalne funkcije</div>

          <q-list class="special-list q-mb-md">
            <q-item
              v-for="fn in specialFunctions"
              :key="fn.key"
              tag="label"
              class="special-item"
            >
              <q-item-section side top>
                <q-radio v-model="selectedFunction" :val="fn.key" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ fn.label }}</q-item-label>
                <q-item-label caption>{{ fn.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div
            v-if="selectedFunction === 'obavijesti'"
            class="notif-form q-mb-md q-pa-md"
          >
            <q-input
              v-model="notifForm.sadrzaj"
              label="Tekst poruke"
              outlined dense
              type="textarea"
              autogrow
            />
          </div>

          <q-btn
            label="Pokreni funkciju"
            color="teal"
            no-caps unelevated size="sm"
            class="report-btn"
            :disable="!selectedFunction"
            :loading="runningFunction"
            @click="runSpecialFunction"
          />
        </div>

        <div class="footer-note q-mt-md">
          Ovaj prozor objedinjuje pristup izvještajima i dodatnim administrativnim funkcijama.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'

const user = getUser()

const $q = useQuasar()

const periodOptions = ['Ovaj tjedan', 'Ovaj mjesec', 'Prošli mjesec', 'Ovo tromjesečje', 'Ova godina', 'Sve']
const statusOptions = ['Aktivna', 'Završena', 'Otkazana', 'Na čekanju']

const serviceOptions  = ref([])
const loadingServices = ref(false)

const reportFilter = ref({
  razdoblje:         null,
  vrstaUsluge:       null,
  statusRezervacije: null
})

const generatingReport = ref(false)
const reportResult     = ref(null)

const reportLabels = {
  korisnici:        'Ukupno korisnika',
  fotografi:        'Ukupno fotografa',
  usluge:           'Ukupno usluga',
  rezervacije:      'Ukupno rezervacija',
  prosjecna_ocjena: 'Prosječna ocjena'
}

async function generateReport () {
  generatingReport.value = true
  reportResult.value     = null
  try {
    const params = {}
    if (reportFilter.value.razdoblje)         params.razdoblje          = reportFilter.value.razdoblje
    if (reportFilter.value.vrstaUsluge)       params.vrsta_usluge       = reportFilter.value.vrstaUsluge
    if (reportFilter.value.statusRezervacije) params.status_rezervacije = reportFilter.value.statusRezervacije

    const { data } = await api.get('/reports/summary', { params })
    reportResult.value = data
    $q.notify({ type: 'positive', message: 'Izvještaj uspješno generiran.' })
  } catch (err) {
    console.error('Greška pri generiranju izvještaja:', err)
    $q.notify({ type: 'negative', message: 'Greška pri generiranju izvještaja.' })
  } finally {
    generatingReport.value = false
  }
}

const specialFunctions = [
  {
    key:         'statistika',
    label:       'Pregled statistike sustava',
    description: 'Dohvati ukupnu statistiku korisnika, rezervacija i ocjena.'
  },
  {
    key:         'obavijesti',
    label:       'Slanje obavijesti korisnicima',
    description: 'Pošalji poruku svim ili odabranim korisnicima.'
  },
  {
    key:         'portfoliji',
    label:       'Nadzor sadržaja portfolija',
    description: 'Pregled i moderacija portfolija fotografa i snimatelja.'
  }
]

const selectedFunction = ref(null)
const runningFunction  = ref(false)
const notifForm        = ref({ sadrzaj: '' })

async function runSpecialFunction () {
  if (!selectedFunction.value) return
  runningFunction.value = true
  try {
    switch (selectedFunction.value) {

      case 'statistika': {
        const { data } = await api.get('/reports/summary')
        reportResult.value = data
        $q.notify({ type: 'positive', message: 'Statistika sustava učitana.' })
        break
      }

      case 'obavijesti': {
        if (!notifForm.value.sadrzaj.trim()) {
          $q.notify({ type: 'warning', message: 'Unesite tekst poruke.' })
          break
        }
        await api.post('/poruke/admin', {
          sadrzaj:notifForm.value.sadrzaj,
          administrator_id: user?.id,
          korisnik_id:null
        })
        notifForm.value = { sadrzaj: '' }
        $q.notify({ type: 'positive', message: 'Obavijest uspješno poslana.' })
        break
      }

      case 'portfoliji': {
        $q.notify({ type: 'info', message: 'Nadzor portfolija nije dostupan putem ovog sučelja.' })
        break
      }
    }
  } catch (err) {
    console.error('Greška pri pokretanju funkcije:', err)
    $q.notify({ type: 'negative', message: 'Greška: ' + (err.response?.data?.error || err.message) })
  } finally {
    runningFunction.value = false
  }
}

onMounted(async () => {
  loadingServices.value = true
  try {
    const { data } = await api.get('/usluge')
    serviceOptions.value = data.map(u => u.naziv)
  } catch (err) {
    console.error('Greška pri dohvatu usluga:', err)
  } finally {
    loadingServices.value = false
  }
})
</script>

<style scoped>
.ee-page {
  padding: 32px 24px;
  max-width: 680px;
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

.section-card {
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  padding: 16px;
  background: #fafafa;
}

.section-title {
  font-weight: 600;
  font-size: 15px;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.filter-field {
  background: #fff;
  border-radius: 6px;
}

.report-btn {
  border-radius: 20px;
}

.report-result {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
}

.report-result-title {
  font-weight: 600;
  font-size: 13px;
  color: #444;
  margin-bottom: 6px;
}

.special-list {
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  padding: 0;
}

.special-item {
  border-bottom: 1px solid #f0f0f0;
  min-height: 48px;
}

.special-item:last-child {
  border-bottom: none;
}

.notif-form {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.footer-note {
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>