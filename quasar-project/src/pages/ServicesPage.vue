<template>
  <q-page class="ee-page">
    <div class="mock-title">3. Pregled usluga i profila fotografa/snimatelja</div>
    <section class="mock-window">
      <div class="mock-bar"><span class="mock-dot"/><span class="mock-dot"/><span class="mock-dot"/> <span class="q-ml-md">Usluge i profili</span></div>
      <div class="mock-content">
        <q-input outlined dense v-model="search" label="Pretraga po imenu, lokaciji ili vrsti usluge" class="q-mb-md" clearable />
        <q-select outlined dense v-model="filter" :options="['sve', 'fotograf', 'snimatelj', 'ocjena', 'cijena']" label="Filter: fotograf / snimatelj / ocjena / cijena" class="q-mb-md" />
        <div v-for="f in filtered" :key="f.fotograf_snimatelj_id" class="card-line cursor-pointer" @click="openDetails(f)">
          <b>{{ f.ime }} {{ f.prezime }}</b><br>
          {{ f.opis_rada || 'Fotograf/snimatelj za evente' }} · Ocjena {{ f.ocjena || '4.8' }} · Gumb: Detalji
        </div>
      </div>
    </section>
  </q-page>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
const router = useRouter(); const search = ref(''); const filter = ref('sve'); const fotografi = ref([])
const filtered = computed(() => fotografi.value.filter(f => `${f.ime} ${f.prezime} ${f.opis_rada}`.toLowerCase().includes((search.value || '').toLowerCase())))
function openDetails (f) { router.push(`/usluge/${f.fotograf_snimatelj_id}`) }
onMounted(async () => { try { fotografi.value = (await api.get('/fotografi')).data } catch { fotografi.value = [{ fotograf_snimatelj_id:1, ime:'Ivan', prezime:'Horvat', opis_rada:'Fotograf vjenčanja', ocjena:4.9 }, { fotograf_snimatelj_id:2, ime:'Ana', prezime:'Marić', opis_rada:'Snimatelj evenata', ocjena:4.8 }, { fotograf_snimatelj_id:3, ime:'Marko', prezime:'Kovač', opis_rada:'Portreti i poslovna fotografija', ocjena:4.7 }] } })
</script>
