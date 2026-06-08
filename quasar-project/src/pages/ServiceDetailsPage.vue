<template>
  <q-page class="ee-page">
    <div class="mock-title">4. Pregled detalja usluge i recenzija</div>
    <section class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot"/><span class="mock-dot"/><span class="mock-dot"/>
        <span class="q-ml-md">Detalji usluge</span>
      </div>
      <div class="mock-content">

        <div v-if="ucitavanje" class="flex flex-center q-pa-xl">
          <q-spinner color="primary" size="3em" />
        </div>

        <template v-else>

          <div class="hero-box q-mb-md">
            <h1>
              {{ fotograf?.ime }} {{ fotograf?.prezime }}
              <template v-if="prvaUsluga"> – {{ prvaUsluga.naziv }}</template>
            </h1>
            <p>
              <template v-if="prvaUsluga?.cijena">
                Cijena: {{ formatCijena(prvaUsluga.cijena) }}
              </template>
              <template v-if="prvaUsluga?.trajanje">
                &nbsp;·&nbsp;Trajanje: {{ prvaUsluga.trajanje }}
              </template>
              &nbsp;·&nbsp;Dostupnost: slobodan termin
            </p>
          </div>

          <div class="card-line q-mb-md">
            <b>Opis usluge</b><br>
            <span class="text-grey-7">
              {{ prvaUsluga?.opis || fotograf?.opis_rada || 'Nema opisa.' }}
            </span>
            <div class="q-mt-sm">
              <q-btn
                color="primary" outline label="Rezerviraj"
                :to="`/korisnik/rezervacija?fotograf=${id}`"
              />
            </div>
          </div>

          <h6 class="q-my-sm" v-if="portfolio.length">Portfolio</h6>
          <div class="ee-grid" v-if="portfolio.length">
            <q-card v-for="p in portfolio" :key="p.portfolio_id || p.naziv_rada" flat bordered>
              <q-img :src="p.medij" ratio="16/9" />
              <q-card-section>
                <b>{{ p.naziv_rada }}</b>
                <p class="subtle q-mb-none">{{ p.opis_rada }}</p>
              </q-card-section>
            </q-card>
          </div>

          <h6 class="q-my-md">Recenzije</h6>

          <div v-if="ucitavanjeRecenzija" class="text-grey q-mb-sm">
            <q-spinner size="sm" class="q-mr-sm" />Učitavanje recenzija...
          </div>

          <template v-else>
            <div
              v-for="r in recenzije"
              :key="r.povratna_informacija_id"
              class="card-line"
            >
              <q-rating
                :model-value="r.ocjena_povratne_informacije"
                readonly size="xs" color="amber" class="q-mr-xs"
              />
              {{ r.komentar_povratne_informacije }}
              <span class="text-grey-6 q-ml-sm text-caption" v-if="r.ime_korisnika">
                — {{ r.ime_korisnika }} {{ r.prezime_korisnika }}
              </span>
            </div>

            <div v-if="recenzije.length === 0" class="card-line text-grey">
              Još nema recenzija.
            </div>
          </template>

        </template>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'

const route = useRoute()
const id = route.params.id

const fotograf = ref(null)
const portfolio = ref([])
const usluge = ref([])
const recenzije = ref([])
const ucitavanje = ref(true)
const ucitavanjeRecenzija = ref(true)

const prvaUsluga = computed(() => usluge.value[0] || null)

function formatCijena(c) {
  if (!c) return ''
  return Number(c).toLocaleString('hr-HR', { minimumFractionDigits: 2 }) + ' €'
}

onMounted(async () => {
  try {
    const fs = (await api.get('/fotografi')).data
    fotograf.value = fs.find(x => String(x.fotograf_snimatelj_id) === String(id)) || fs[0]
  } catch (err) {
    console.error('Greška kod dohvaćanja fotografa:', err)
  }

  try {
    portfolio.value = (await api.get('/portfolio', { params: { fotograf_id: id } })).data
  } catch {
    portfolio.value = []
  }

  try {
    usluge.value = (await api.get('/usluge')).data
  } catch {
    usluge.value = []
  }

  ucitavanje.value = false

  ucitavanjeRecenzija.value = true
  try {
    if (usluge.value.length > 0) {
      const uslugeRes = await Promise.all(
        usluge.value.slice(0, 3).map(u =>
          api.get(`/usluge/${u.usluga_id}/recenzije`).catch(() => ({ data: [] }))
        )
      )
      recenzije.value = uslugeRes.flatMap(r => r.data)
    }
  } catch (err) {
    console.error('Greška kod dohvaćanja recenzija:', err)
    recenzije.value = []
  } finally {
    ucitavanjeRecenzija.value = false
  }
})
</script>
