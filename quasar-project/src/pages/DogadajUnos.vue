<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg" style="width: 100%; max-width: 500px">
      <q-card-section>
        <div class="text-h6">Unos novog događaja</div>
      </q-card-section>

      <q-form ref="forma">
        <q-input
          filled
          v-model="dogadaj.tip"
          label="Tip događaja"
          :rules="[val => !!val || 'Tip događaja je obavezan']"
        />

        <q-input
          filled
          type="datetime-local"
          v-model="dogadaj.datumVrijeme"
          label="Datum i vrijeme"
          :rules="[val => !!val || 'Datum i vrijeme su obavezni']"
        />

        <q-input
          filled
          v-model="dogadaj.lokacija"
          label="Lokacija"
          :rules="[val => !!val || 'Lokacija je obavezna']"
        />

        <q-input
          filled
          type="textarea"
          v-model="dogadaj.opis"
          label="Opis događaja"
          :rules="[val => !!val || 'Opis je obavezan']"
        />

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
import { ref } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const forma = ref(null)

const dogadaj = ref({
  tip: '',
  datumVrijeme: '',
  lokacija: '',
  opis: ''
})

function spremiDogadaj () {
  forma.value.validate().then(valid => {
    if (!valid) {
      Notify.create({
        type: 'negative',
        message: 'Molimo ispunite sva polja prije spremanja.'
      })
      return
    }

    axios.post('http://localhost:3000/api/dogadaji', {
      Tip_dogadaja: dogadaj.value.tip,
      Datum_vrijeme: dogadaj.value.datumVrijeme,
      Lokacija: dogadaj.value.lokacija,
      Opis: dogadaj.value.opis
    }).then(() => {
      Notify.create({
        type: 'positive',
        message: 'Događaj je uspješno spremljen.'
      })
      resetForme()
    }).catch(() => {
      Notify.create({
        type: 'negative',
        message: 'Došlo je do greške prilikom spremanja.'
      })
    })
  })
}

function resetForme () {
  dogadaj.value = {
    tip: '',
    datumVrijeme: '',
    lokacija: '',
    opis: ''
  }
  forma.value.resetValidation()
}
</script>
