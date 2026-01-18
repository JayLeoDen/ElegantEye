<template>
  <q-page padding>
    <q-banner class="bg-secondary text-white q-mb-lg rounded-borders">
      <div class="text-h5">Unos novog događaja</div>
      <div class="text-subtitle2">Dodaj novi događaj u sustav</div>
    </q-banner>

    <div class="row justify-center">
      <q-card class="col-12 col-md-8 q-pa-lg" bordered>
        <div class="row q-col-gutter-md">

          <q-input
            filled
            v-model="noviDogadaj.tip"
            label="Tip događaja"
            class="col-12 col-md-6"
            prepend-icon="category"
          />

          <q-input
            filled
            v-model="noviDogadaj.datumVrijeme"
            label="Datum i vrijeme"
            type="datetime-local"
            class="col-12 col-md-6"
            prepend-icon="event"
          />

          <q-input
            filled
            v-model="noviDogadaj.lokacija"
            label="Lokacija"
            class="col-12 col-md-6"
            prepend-icon="place"
          />

          <q-input
            filled
            v-model="noviDogadaj.opis"
            label="Opis događaja"
            type="textarea"
            class="col-12"
            autogrow
            prepend-icon="description"
          />
        </div>

        <q-separator class="q-my-md" />

        <q-card-actions align="right">
          <q-btn
            label="Odustani"
            color="grey-7"
            flat
            icon="close"
            @click="odustani"
          />
          <q-btn
            label="Spremi događaj"
            color="primary"
            icon="save"
            @click="spremiDogadaj"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const backendURL = "http://localhost:3000/api/dogadaji";

const noviDogadaj = ref({
  tip: "",
  datumVrijeme: "",
  lokacija: "",
  opis: "",
});

function odustani() {
  noviDogadaj.value = {
    tip: "",
    datumVrijeme: "",
    lokacija: "",
    opis: "",
  };
}

async function spremiDogadaj() {
  try {
    await axios.post(backendURL, noviDogadaj.value);
    alert("Događaj uspješno dodan!");
    odustani();
  } catch (error) {
    console.error(error);
    alert("Došlo je do greške pri unosu događaja.");
  }
}
</script>