<template>
  <q-page class="q-pa-md flex flex-center">

    <q-card
      class="q-pa-lg"
      style="width: 100%; max-width: 500px"
    >

      <q-card-section>
        <div class="text-h6">
          Unos novog događaja
        </div>
      </q-card-section>


      <q-form ref="forma">

        <!-- Datum -->
        <q-input
          filled
          type="date"
          v-model="dogadaj.datum_dogadaja"
          label="Datum događaja"
          class="q-mb-md"
          :rules="[
            val => !!val || 'Datum događaja je obavezan'
          ]"
        />


        <!-- Vrijeme -->
        <q-input
          filled
          type="time"
          v-model="dogadaj.vrijeme_dogadaja"
          label="Vrijeme događaja"
          class="q-mb-md"
          :rules="[
            val => !!val || 'Vrijeme događaja je obavezno'
          ]"
        />


        <!-- Lokacija -->
        <q-input
          filled
          v-model="dogadaj.lokacija_dogadaja"
          label="Lokacija događaja"
          class="q-mb-md"
          :rules="[
            val => !!val || 'Lokacija je obavezna'
          ]"
        />


        <!-- Opis -->
        <q-input
          filled
          type="textarea"
          v-model="dogadaj.opis_dogadaja"
          label="Opis događaja"
          class="q-mb-md"
          :rules="[
            val => !!val || 'Opis događaja je obavezan'
          ]"
        />


        <!-- Gumbi -->
        <div class="q-mt-md row justify-end q-gutter-sm">

          <q-btn
            label="Spremi događaj"
            color="primary"
            @click="spremiDogadaj"
          />

          <q-btn
            label="Očisti"
            color="negative"
            flat
            @click="resetForme"
          />

        </div>

      </q-form>

    </q-card>

  </q-page>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";


// Referenca forme
const forma = ref(null);


// Objekt događaja
const dogadaj = ref({

  datum_dogadaja: "",
  vrijeme_dogadaja: "",
  lokacija_dogadaja: "",
  opis_dogadaja: ""

});


// Spremanje događaja
function spremiDogadaj() {

  forma.value.validate().then(async (valid) => {

    if (!valid) {

      Notify.create({
        type: "negative",
        message: "Molimo ispunite sva polja."
      });

      return;
    }

    try {

      console.log("ŠALJEM:", dogadaj.value);

      await axios.post(
        "http://localhost:3000/api/dogadaji",
        dogadaj.value
      );

      Notify.create({
        type: "positive",
        message: "Događaj je uspješno spremljen."
      });

      resetForme();

    } catch (error) {

      console.error("GREŠKA:", error);

      Notify.create({
        type: "negative",
        message: "Greška pri spremanju događaja."
      });

    }

  });

}


// Reset forme
function resetForme() {

  dogadaj.value = {

    datum_dogadaja: "",
    vrijeme_dogadaja: "",
    lokacija_dogadaja: "",
    opis_dogadaja: ""

  };

  forma.value.resetValidation();

}
</script>