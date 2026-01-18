<template>
  <q-page padding>
    <h2>Popis usluga</h2>

    <div class="q-mt-lg q-ml-md">
      <div class="row q-col-gutter-md">
        <q-card
          v-for="usluga in usluge"
          :key="usluga.Usluga_ID"
          bordered
          class="col-12 col-md-4 q-pa-sm"
        >
          <q-card-section>
            <div class="text-h6">{{ usluga.Tip_usluge }}</div>
            <div class="text-subtitle2">ID: {{ usluga.Usluga_ID }}</div>

            <q-badge class="q-mt-sm" align="top">
              {{ formatCijena(usluga.Cijena_usluge) }}
            </q-badge>

            <div v-if="usluga.Opis_usluge" class="q-mt-sm text-caption">
              {{ usluga.Opis_usluge }}
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

const backendURL = 'http://localhost:3000/api/usluge'

const usluge = ref([])

function formatCijena(c) {
  if (c === null || c === undefined) return 'Cijena: Nije postavljena'
  try {
    const num = Number(c)
    if (Number.isNaN(num)) return 'Neispravna cijena'
    return num.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
  } catch {
    return c
  }
}

onMounted(async () => {
  try {
    const res = await axios.get(backendURL)
    usluge.value = res.data
  } catch (err) {
    console.error('Greška prilikom dohvaćanja usluga:', err)
  }
})
</script>