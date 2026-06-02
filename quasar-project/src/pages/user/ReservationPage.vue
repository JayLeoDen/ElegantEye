<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Kreiranje rezervacije</h1>
    <p class="subtle">
      Odaberi uslugu, fotografa/snimatelja i termin događaja.
    </p>

    <section class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="q-ml-md">Kreiranje rezervacije</span>
      </div>

      <div class="mock-content">
        <q-form @submit="save" class="q-gutter-md">
          <q-select
            outlined
            v-model="form.usluga_id"
            :options="usluge"
            option-label="naziv"
            option-value="usluga_id"
            emit-value
            map-options
            label="Odabrana usluga"
          />

          <q-select
            outlined
            v-model="form.fotograf_snimatelj_id"
            :options="fotografi"
            option-label="full"
            option-value="fotograf_snimatelj_id"
            emit-value
            map-options
            label="Pružatelj usluge"
          />

          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12 col-md-6">
              <q-input
                outlined
                type="date"
                v-model="form.datum_nove_rezervacije"
                label="Datum događaja"
                class="date-input"
                :min="today"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                type="time"
                v-model="form.vrijeme_nove_rezervacije"
                label="Vrijeme događaja"
              />
            </div>
          </div>

          <q-input
            outlined
            v-model="form.lokacija_dogadaja"
            label="Lokacija događaja"
          />

          <q-input
            outlined
            type="textarea"
            v-model="form.napomena_rezervacije"
            label="Dodatne napomene"
          />

          <div class="summary-box">
            <strong>Sažetak rezervacije</strong>
            <div>
              Cijena: {{ odabranaUsluga?.cijena || '-' }} €
              • Pružatelj usluge: {{ odabraniFotograf?.full || '-' }}
            </div>
          </div>

          <div class="row q-gutter-sm">
            <q-btn
              color="primary"
              label="Potvrdi rezervaciju"
              type="submit"
              :loading="loading"
              unelevated
            />

            <q-btn
              outline
              color="primary"
              label="Odustani"
              @click="router.back()"
            />
          </div>
        </q-form>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const today = new Date().toISOString().split('T')[0]
const user = getUser()

const usluge = ref([])
const fotografi = ref([])

const form = reactive({
  korisnik_id: user?.id,
  usluga_id: null,
  fotograf_snimatelj_id: route.query.fotograf
    ? Number(route.query.fotograf)
    : null,
  datum_nove_rezervacije: '',
  vrijeme_nove_rezervacije: '',
  lokacija_dogadaja: '',
  napomena_rezervacije: ''
})

const odabranaUsluga = computed(() => {
  return usluge.value.find(u => u.usluga_id === form.usluga_id)
})

const odabraniFotograf = computed(() => {
  return fotografi.value.find(
    f => f.fotograf_snimatelj_id === form.fotograf_snimatelj_id
  )
})

onMounted(async () => {
  usluge.value = (await api.get('/usluge')).data

  fotografi.value = (await api.get('/fotografi')).data.map(f => ({
    ...f,
    full: `${f.ime} ${f.prezime}`
  }))
})

async function save () {
  if (form.datum_nove_rezervacije < today) {
    $q.notify({
      type: 'negative',
      message: 'Nije moguće odabrati datum u prošlosti.'
    })
    return
  }

  loading.value = true

  try {
    await api.post('/rezervacije', form)

    $q.notify({
      type: 'positive',
      message: 'Rezervacija spremljena'
    })

    router.push('/korisnik/rezervacije')
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: e.response?.data?.error || 'Greška kod spremanja rezervacije'
    })
  } finally {
    loading.value = false
  }
}
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
  margin: 0 0 6px;
  color: #17233c;
}

.subtle {
  text-align: center;
  color: #718096;
  margin-bottom: 18px;
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
  padding: 28px 22px;
  background: #f8fbff;
}

.summary-box {
  border: 1px solid #d9e3ef;
  border-radius: 12px;
  background: white;
  padding: 14px 16px;
  color: #1f2937;
}

.summary-box strong {
  display: block;
  margin-bottom: 4px;
}

:deep(.date-input .q-field__control) {
  padding-left: 12px;
  border-radius: 10px;
  background: white;
}

:deep(.q-field__label) {
  color: #718096;
}

.q-btn {
  border-radius: 9px;
  font-weight: 700;
}
</style>