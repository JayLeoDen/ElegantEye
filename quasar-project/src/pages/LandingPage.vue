<template>
  <q-page class="ee-page">
    <div class="mock-title">1. Početni prozor</div>
    <section class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot"/><span class="mock-dot"/><span class="mock-dot"/>
        <span class="q-ml-md">Početna</span>
      </div>
      <div class="mock-content">

        <!-- Hero box — gumbi funkcionalni -->
        <div class="hero-box">
          <h1>Rezerviraj fotografa ili snimatelja</h1>
          <p>Jednostavno pretraživanje, pregled portfolija i rezervacija termina.</p>
          <q-btn color="primary" outline label="Prijava"
            to="/auth" class="q-mr-sm" />
          <q-btn color="primary" outline label="Registracija"
            to="/auth?tab=register" class="q-mr-sm" />
          <q-btn color="green" outline label="Pregled usluga"
            to="/usluge" />
        </div>

        <!-- Navigacijske kartice — klikabilne -->
        <div
          class="card-line cursor-pointer"
          @click="$router.push('/usluge?filter=fotograf')"
          style="user-select:none"
        >
          <b>Fotografi</b><br>Portreti, vjenčanja, eventi
        </div>

        <div
          class="card-line cursor-pointer"
          @click="$router.push('/usluge?filter=snimatelj')"
          style="user-select:none"
        >
          <b>Snimatelji</b><br>Video produkcija i eventi
        </div>

        <div
          class="card-line cursor-pointer"
          @click="$router.push('/usluge')"
          style="user-select:none"
        >
          <b>Najbolje ocjene</b><br>Pregled top pružatelja usluga
        </div>

      </div>
    </section>
  </q-page>
</template>

<script setup>
// Navigacija riješena inline @click-om — nema potrebe za dodatnom logikom
</script>
