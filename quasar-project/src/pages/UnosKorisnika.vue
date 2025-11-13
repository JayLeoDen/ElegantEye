<template>
  <q-page padding>
    <div>
      <q-input filled v-model="app.name" label="Ime:" />
      <q-input filled v-model="app.surname" label="Prezime:" />
      <q-input filled v-model="app.email" label="Email adresa:" />
      <q-input filled v-model="app.number" label="Broj mobitela:" />
      <q-select
        filled
        v-model="app.status"
        :options="['Novi korisnik', 'Stari korisnik']"
        label="Status korisnika"
      />

      <div class="q-mt-md">
        <q-btn label="Spremi" color="green" @click="spremi" />
        <q-btn label="Odustani" color="red" @click="odustani" />
      </div>
    </div>

    <q-toolbar class="bg-primary text-white q-mt-lg">
      <q-btn flat round dense>
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
        KORISNICI
      </q-toolbar-title>
      <q-btn flat round dense>
        <q-icon name="more_vert" />
      </q-btn>
    </q-toolbar>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card
        v-for="k in apps"
        :key="k.id"
        class="my-card"
      >
        <q-card-section>
          <div class="text-h6">{{ k.name }}</div>
          <div class="text-subtitle2">{{ k.surname }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ k.email }}
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ k.number }}
        </q-card-section>

        <q-card-section>
          <q-chip
            :color="k.status === 'Novi korisnik' ? 'green' : 'red'"
            text-color="white"
          >
            {{ k.status }}
          </q-chip>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const apps = ref([]);
const nextId = ref(1);

const app = ref({
  name: '',
  surname: '',
  email: '',
  number: '',
  status: 'Novi korisnik'
});

function spremi() {
  apps.value.push({
    id: nextId.value,
    name: app.value.name,
    surname: app.value.surname,
    email: app.value.email,
    number: app.value.number,
    status: app.value.status
  });

  nextId.value++;
  odustani();
}

function odustani() {
  app.value = {
    name: '',
    surname: '',
    email: '',
    number: '',
    status: 'Novi korisnik'
  };
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
