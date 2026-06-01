<template>
  <q-page class="ee-page">
    <h1 class="page-heading">{{ title }}</h1>
    <p class="subtle">Pregled glavnih funkcionalnosti sustava Elegant Eye.</p>
    <div class="ee-grid q-mt-lg">
      <q-card v-for="c in cards" :key="c.label" flat bordered class="q-pa-md cursor-pointer" @click="$router.push(c.to)">
        <q-icon :name="c.icon" size="42px" color="primary" />
        <h6 class="q-my-sm">{{ c.label }}</h6>
        <p class="subtle q-mb-none">{{ c.text }}</p>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { computed } from 'vue'
import { getUser } from 'src/services/auth'
const user = getUser(); const role = user?.uloga || 'korisnik'
const title = computed(() => role === 'admin' ? 'Administratorski prozor' : role === 'fotograf' ? 'Profil fotografa ili snimatelja' : 'Klijentsko sučelje')
const cards = computed(() => role === 'admin' ? [
  { label:'Korisnici', icon:'people', to:'/admin/korisnici', text:'Pregled i upravljanje korisnicima.' },
  { label:'Usluge', icon:'design_services', to:'/admin/usluge', text:'Dodavanje, ažuriranje i brisanje usluga.' },
  { label:'Rezervacije', icon:'event', to:'/admin/rezervacije', text:'Pregled svih rezervacija u sustavu.' },
  { label:'Izvještaji', icon:'bar_chart', to:'/admin/izvjestaji', text:'Statistika rezervacija, korisnika i ocjena.' }
] : role === 'fotograf' ? [
  { label:'Portfolio', icon:'collections', to:'/fotograf/portfolio', text:'Dodavanje i uređivanje radova.' },
  { label:'Rezervacije', icon:'event_available', to:'/fotograf/rezervacije', text:'Potvrda ili odbijanje rezervacija.' },
  { label:'Dostupnost', icon:'schedule', to:'/fotograf/dostupnost', text:'Označavanje slobodnih i zauzetih termina.' }
] : [
  { label:'Pregled usluga', icon:'search', to:'/korisnik/usluge', text:'Pregled profila fotografa i snimatelja.' },
  { label:'Nova rezervacija', icon:'add_circle', to:'/korisnik/rezervacija', text:'Kreiranje rezervacije termina.' },
  { label:'Moje rezervacije', icon:'event_note', to:'/korisnik/rezervacije', text:'Pregled statusa i slanje recenzija.' }
])
</script>
