<template>
  <q-page padding>
    <h2>Popis svih fotografa</h2>

    <div class="q-mt-lg q-ml-md">
      <div class="row q-col-gutter-md">
        <q-card
          v-for="osoba in fotografi"
          :key="osoba.MB_fotografa_snimatelja"
          bordered
          class="col-12 col-md-4 q-pa-sm"
        >
          <q-card-section>
            <div class="text-h6">{{ osoba.Ime_fotografa_snimatelja }} {{ osoba.Prezime_fotografa_snimatelja }}</div>
            <div class="text-subtitle2">ID: {{ osoba.MB_fotografa_snimatelja }}</div>

            <q-badge
              :color="bojaUloge(osoba.Specijalizacija_fotografa_snimatelja)"
              class="q-mt-sm"
              align="top"
            >
              {{ formatUloga(osoba.Specijalizacija_fotografa_snimatelja) }}
            </q-badge>

            <div class="q-mt-sm">Email: {{ osoba.Email_fotografa_snimatelja }}</div>
            <div>Telefon: {{ osoba.Telefon_fotografa_snimatelja }}</div>

            <div v-if="osoba.Portfolio_fotografa_snimatelja" class="q-mt-sm">
              <a
                :href="pripremiLink(osoba.Portfolio_fotografa_snimatelja)"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio
              </a>
            </div>

            <div v-if="osoba.opis" class="text-caption q-mt-sm">
              {{ osoba.opis }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const fotografi = ref([])

function formatUloga(uloga) {
  if (!uloga) return ''
  return uloga.charAt(0).toUpperCase() + uloga.slice(1).toLowerCase()
}

function bojaUloge(uloga) {
  const normalized = formatUloga(uloga)
  switch (normalized) {
    case 'Fotograf': return 'primary'
    case 'Snimatelj': return 'secondary'
    case 'Oboje': return 'accent'
    default: return 'grey'
  }
}

function pripremiLink(link) {
  if (!/^https?:\/\//i.test(link)) {
    return 'https://' + link
  }
  return link
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/fotografi')
    fotografi.value = res.data
  } catch (err) {
    console.error(err)
  }
})
</script>
