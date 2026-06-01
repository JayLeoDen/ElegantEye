<template>
  <q-page class="ee-page">
    <div class="mock-title">3. Pregled usluga i profila fotografa/snimatelja</div>
    <section class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot"/><span class="mock-dot"/><span class="mock-dot"/>
        <span class="q-ml-md">Usluge i profili</span>
      </div>
      <div class="mock-content">

        <!-- Pretraga -->
        <q-input
          outlined dense
          v-model="search"
          label="Pretraga po imenu, lokaciji ili vrsti usluge"
          class="q-mb-md"
          clearable
        />

        <!-- Filter -->
        <q-select
          outlined dense
          v-model="filter"
          :options="['sve', 'fotograf', 'snimatelj', 'ocjena', 'cijena']"
          label="Filter: fotograf / snimatelj / ocjena / cijena"
          class="q-mb-md"
        />

        <!-- Loading -->
        <div v-if="ucitavanje" class="flex flex-center q-pa-md">
          <q-spinner color="primary" size="2em" />
        </div>

        <!-- Lista stavki -->
        <template v-else>
          <div
            v-for="stavka in filtrirano"
            :key="stavka._kljuc"
            class="card-line cursor-pointer row items-center justify-between"
            style="user-select:none"
          >
            <div>
              <b>{{ stavka.naziv }}</b><br>
              <span class="text-grey-7">
                {{ stavka.opis }}
                <template v-if="stavka.cijena"> · {{ formatCijena(stavka.cijena) }}</template>
                <template v-if="stavka.ocjena"> · Ocjena {{ stavka.ocjena }}</template>
              </span>
            </div>
            <q-btn
              flat dense
              color="primary"
              label="Detalji"
              @click.stop="$router.push(`/usluge/${stavka.id}`)"
            />
          </div>

          <div v-if="filtrirano.length === 0" class="text-grey text-center q-pa-md">
            Nema rezultata.
          </div>
        </template>

      </div>
    </section>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'

const route = useRoute()
const search = ref('')
const filter = ref('sve')
const fotografi = ref([])
const ucitavanje = ref(true)

function formatCijena(c) {
  if (!c) return null
  return Number(c).toLocaleString('hr-HR', { minimumFractionDigits: 2 }) + ' €'
}

// Kombinirana lista fotografa
const kombiniranoLista = computed(() => {
  return fotografi.value.map(f => ({
    _kljuc: `fotograf-${f.fotograf_snimatelj_id}`,
    id: f.fotograf_snimatelj_id,
    naziv: `${f.ime} ${f.prezime}`,
    opis: f.opis_rada || 'Fotograf / Snimatelj',
    cijena: null,
    ocjena: f.ocjena || null,
    tip: 'fotograf'
  }))
})

const filtrirano = computed(() => {
  const p = (search.value || '').toLowerCase().trim()
  const f = (filter.value === 'sve' ? '' : filter.value).toLowerCase()

  return kombiniranoLista.value.filter(s => {
    const matchSearch = !p ||
      s.naziv.toLowerCase().includes(p) ||
      s.opis.toLowerCase().includes(p)
    const matchFilter = !f ||
      s.tip.toLowerCase().includes(f) ||
      s.naziv.toLowerCase().includes(f) ||
      s.opis.toLowerCase().includes(f)
    return matchSearch && matchFilter
  })
})

onMounted(async () => {
  // Preuzmi filter query param ako dolazimo s LandingPage
  if (route.query.filter) filter.value = route.query.filter

  try {
    fotografi.value = (await api.get('/fotografi')).data
  } catch {
    fotografi.value = [
      { fotograf_snimatelj_id: 1, ime: 'Ivan', prezime: 'Horvat', opis_rada: 'Fotograf vjenčanja', ocjena: 4.9 },
      { fotograf_snimatelj_id: 2, ime: 'Ana',  prezime: 'Marić',  opis_rada: 'Snimatelj evenata',  ocjena: 4.8 },
      { fotograf_snimatelj_id: 3, ime: 'Marko',prezime: 'Kovač',  opis_rada: 'Portreti i poslovna fotografija', ocjena: 4.7 }
    ]
  } finally {
    ucitavanje.value = false
  }
})
</script>
