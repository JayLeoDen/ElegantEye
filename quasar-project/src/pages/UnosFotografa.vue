<template>
  <q-page padding>
    <h2>Unos novog fotografa</h2>

    <q-card class="q-pa-md q-mb-md" flat bordered>
      <div class="row q-col-gutter-md">

        <q-input
          filled
          v-model="noviFotograf.ime"
          label="Ime"
          class="col-12 col-md-6"
        />

        <q-input
          filled
          v-model="noviFotograf.prezime"
          label="Prezime"
          class="col-12 col-md-6"
        />

        <q-select
          filled
          v-model="noviFotograf.uloga"
          :options="ulogaOpcije"
          label="Specijalizacija / Uloga"
          class="col-12 col-md-6"
        />

        <q-input
          filled
          v-model="noviFotograf.email"
          label="Email"
          type="email"
          class="col-12 col-md-6"
        />

        <q-input
          filled
          v-model="noviFotograf.telefon"
          label="Telefon"
          type="tel"
          class="col-12 col-md-6"
        />

        <q-input
          filled
          v-model="noviFotograf.portfolio"
          label="Link na portfolio"
          type="url"
          class="col-12 col-md-6"
        />

      </div>

      <q-card-actions align="right">
        <q-btn label="Spremi" color="primary" @click="spremiFotografa" />
        <q-btn label="Odustani" color="negative" flat @click="odustani" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const backendURL = "http://localhost:3000/api/fotografi";

const ulogaOpcije = ["Fotograf", "Snimatelj", "Oboje"];

const noviFotograf = ref({
  ime: "",
  prezime: "",
  uloga: "",
  email: "",
  telefon: "",
  portfolio: "",
});

function odustani() {
  noviFotograf.value = {
    ime: "",
    prezime: "",
    uloga: "",
    email: "",
    telefon: "",
    portfolio: "",
  };
}

async function spremiFotografa() {
  if (!noviFotograf.value.ime || !noviFotograf.value.prezime) {
    alert("Molimo unesite ime i prezime.");
    return;
  }

  try {
    await axios.post(backendURL, noviFotograf.value);
    alert("Fotograf uspješno dodan!");
    odustani();
  } catch (error) {
    console.error("Greška pri spremanju:", error);
    alert("Došlo je do greške pri unosu fotografa.");
  }
}
</script>