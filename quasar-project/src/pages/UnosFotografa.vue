<template>
  <q-page padding>
    <h2>Unos novih suradnika</h2>

    <!-- Forma ostaje kao prije -->
    <q-card class="q-pa-md q-mb-md" flat bordered>
      <div class="row q-col-gutter-md">
        <q-input
          filled
          v-model="noviSuradnik.ime"
          label="Ime"
          class="col-12 col-md-6"
        />
        <q-input
          filled
          v-model="noviSuradnik.prezime"
          label="Prezime"
          class="col-12 col-md-6"
        />

        <q-input
          filled
          v-model="noviSuradnik.portfolio"
          label="Link na portfolio"
          type="url"
          class="col-12 col-md-6"
        />

        <q-select
          filled
          v-model="noviSuradnik.uloga"
          :options="ulogaOpcije"
          label="Uloga"
          class="col-12 col-md-6"
        />

        <q-input
          filled
          v-model="noviSuradnik.opis"
          label="Kratka napomena (neobavezno)"
          type="textarea"
          class="col-12"
          autogrow
        />
      </div>

      <q-card-actions align="right">
        <q-btn label="Spremi" color="primary" @click="spremiSuradnika" />
        <q-btn label="Odustani" color="negative" flat @click="odustani" />
      </q-card-actions>
    </q-card>

    <!-- Kartice ispod forme s laganim pomakom udesno -->
    <div class="q-mt-lg q-ml-md">
      <div class="row q-col-gutter-md">
        <q-card
          v-for="osoba in suradnici"
          :key="osoba.id"
          bordered
          class="col-12 col-md-4 q-pa-sm"
        >
          <q-card-section>
            <div class="text-h6">{{ osoba.ime }} {{ osoba.prezime }}</div>

            <q-badge
              :color="bojaUloge(osoba.uloga)"
              class="q-mt-sm"
              align="top"
            >
              {{ osoba.uloga }}
            </q-badge>

            <div v-if="osoba.portfolio" class="q-mt-sm">
              <a
                :href="osoba.portfolio"
                target="_blank"
                class="text-primary"
              >
                Pogledaj portfolio
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
import { ref } from 'vue'

const ulogaOpcije = ['Fotograf', 'Snimatelj', 'Oboje']

const noviSuradnik = ref({
  id: 0,
  ime: '',
  prezime: '',
  portfolio: '',
  uloga: '',
  opis: ''
})

const suradnici = ref([])

function bojaUloge(uloga) {
  switch (uloga) {
    case 'Fotograf': return 'primary'
    case 'Snimatelj': return 'secondary'
    case 'Oboje': return 'accent'
    default: return 'grey'
  }
}

function spremiSuradnika() {
  if (!noviSuradnik.value.ime || !noviSuradnik.value.prezime) {
    alert('Molimo unesite ime i prezime.')
    return
  }

  const noviId = suradnici.value.length + 1

  suradnici.value.push({
    id: noviId,
    ime: noviSuradnik.value.ime,
    prezime: noviSuradnik.value.prezime,
    portfolio: noviSuradnik.value.portfolio,
    uloga: noviSuradnik.value.uloga || 'Fotograf',
    opis: noviSuradnik.value.opis
  })

  odustani()
}

function odustani() {
  noviSuradnik.value = {
    id: 0,
    ime: '',
    prezime: '',
    portfolio: '',
    uloga: '',
    opis: ''
  }
}
</script>
