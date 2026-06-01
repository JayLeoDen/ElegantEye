<template>
  <q-page class="ee-page">
    <div class="mock-title">4. Pregled detalja usluge i recenzija</div>
    <section class="mock-window">
      <div class="mock-bar"><span class="mock-dot"/><span class="mock-dot"/><span class="mock-dot"/> <span class="q-ml-md">Detalji usluge</span></div>
      <div class="mock-content">
        <div class="hero-box q-mb-md">
          <h1>{{ fotograf?.ime || 'Fotograf' }} {{ fotograf?.prezime || '' }} – Premium paket</h1>
          <p>Cijena: 850 € · Trajanje: 8 sati · Dostupnost: slobodan termin</p>
          <q-btn color="primary" label="Rezerviraj" :to="`/korisnik/rezervacija?fotograf=${id}`" />
        </div>
        <h6 class="q-my-sm">Portfolio</h6>
        <div class="ee-grid">
          <q-card v-for="p in portfolio" :key="p.portfolio_id || p.naziv_rada" flat bordered>
            <q-img :src="p.medij" ratio="16/9" />
            <q-card-section><b>{{ p.naziv_rada }}</b><p class="subtle q-mb-none">{{ p.opis_rada }}</p></q-card-section>
          </q-card>
        </div>
        <h6 class="q-my-md">Recenzije korisnika</h6>
        <div class="card-line">★★★★★ Odlična usluga, profesionalan pristup i prekrasne fotografije.</div>
      </div>
    </section>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
const route = useRoute(); const id = route.params.id; const fotograf = ref(null); const portfolio = ref([])
onMounted(async () => {
  try {
    const fs = (await api.get('/fotografi')).data
    fotograf.value = fs.find(x => String(x.fotograf_snimatelj_id) === String(id)) || fs[0]
  } catch (err) {
    console.error('Greška kod dohvaćanja fotografa:', err)
  }
  try {
    portfolio.value = (
      await api.get('/portfolio', {
        params: { fotograf_id: id }
      })
    ).data
  } catch (err) {
    console.error('Greška kod dohvaćanja portfolija:', err)
  }
  if (!portfolio.value.length) portfolio.value = [{ naziv_rada:'Vjenčanje Ana', opis_rada:'Ceremonija i portreti', medij:'https://images.unsplash.com/photo-1519741497674-611481863552?w=900' }, { naziv_rada:'Event', opis_rada:'Profesionalno snimanje događaja', medij:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900' }]
})
</script>
