<template>

  <h1><b>Popis usluga</b></h1>

  <div class="q-pa-md q-gutter-sm">
    <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      <template v-slot:avatar>
        <img
          src="https://st2.depositphotos.com/1697659/10645/i/950/depositphotos_106450052-stock-photo-girl-and-guy-holding-bouquet.jpg"
          style="width: 20rem; height: 15rem"
        >
      </template>

      <h2>Vjenčanja</h2>
      <template v-slot:action>
        <q-btn flat label="Više detalja" to="/vjencanja" />
      </template>
    </q-banner>
  </div>
    <div class="q-pa-md q-gutter-sm">
    <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      <template v-slot:avatar>
        <img
          src="https://st4.depositphotos.com/16285388/41761/i/600/depositphotos_417615038-stock-photo-corporate-people-having-fun-with.jpg"
          style="width: 20rem; height: 15rem"
        >
      </template>

      <h2>Rođendani</h2>
      <template v-slot:action>
        <q-btn flat label="Više detalja" to="/rodendani"/>
      </template>
    </q-banner>
  </div>
    <div class="q-pa-md q-gutter-sm">
    <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      <template v-slot:avatar>
        <img
          src="https://st.depositphotos.com/1010710/3381/i/600/depositphotos_33810321-stock-photo-well-dressed-teenage-couple.jpg"
          style="width: 20rem; height: 15rem"
        >
      </template>

      <h2>Maturalne zabave</h2>
      <template v-slot:action>
        <q-btn flat label="Više detalja" to="/maturalne"/>
      </template>
    </q-banner>
  </div>
    <div class="q-pa-md q-gutter-sm">
    <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      <template v-slot:avatar>
        <img
          src="https://st5.depositphotos.com/76875576/75703/i/600/depositphotos_757033290-stock-photo-valmiera-latvia-october-2024-conference.jpg"
          style="width: 20rem; height: 15rem"
        >
      </template>

      <h2>Ostali događaji</h2>
      <template v-slot:action>
        <q-btn flat label="Više detalja" to="/dogadaji"/>
      </template>
    </q-banner>
  </div>
</template>

<script setup>
//
</script>
