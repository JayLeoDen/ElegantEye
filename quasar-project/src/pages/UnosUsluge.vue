<template>
  <q-page padding>
    <h2>Unos nove usluge</h2>

    <q-card class="q-pa-md q-mb-md" flat bordered>
      <div class="row q-col-gutter-md">

        <q-input
          filled
          v-model="novaUsluga.tip"
          label="Tip usluge"
          class="col-12 col-md-6"
        />

        <q-input
          filled
          v-model.number="novaUsluga.cijena"
          label="Cijena usluge"
          type="number"
          class="col-12 col-md-6"
        />

        <q-input
          filled
          v-model="novaUsluga.opis"
          label="Opis usluge"
          type="text"
          class="col-12"
          autogrow
        />

      </div>

      <q-card-actions align="right">
        <q-btn label="Spremi" color="primary" @click="spremiUslugu" />
        <q-btn label="Odustani" color="negative" flat @click="odustani" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"

const backendURL = "http://localhost:3000/api/usluge"

const novaUsluga = ref({
  tip: "",
  cijena: null,
  opis: "",
})

function odustani() {
  novaUsluga.value = {
    tip: "",
    cijena: null,
    opis: "",
  }
}

async function spremiUslugu() {
  if (!novaUsluga.value.tip) {
    alert("Molimo unesite tip usluge.")
    return
  }

  try {
    const response = await axios.post(backendURL, novaUsluga.value)
    alert(`Usluga dodana! ID: ${response.data.insertedId}`)
    odustani()
  } catch (error) {
    console.error("Greška pri spremanju usluge:", error)
    alert("Greška pri spremanju. Provjeri konzolu.")
  }
}
</script>
