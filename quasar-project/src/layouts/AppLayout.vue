<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>Elegant Eye</q-toolbar-title>
        <div class="q-mr-md">{{ user?.ime || user?.email }} · {{ label }}</div>
        <q-btn flat icon="logout" label="Odjava" @click="doLogout" />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawer" show-if-above bordered>
      <q-list padding>
        <q-item-label header>{{ label }}</q-item-label>
        <q-item v-for="link in links" :key="link.to" clickable v-ripple :to="link.to">
          <q-item-section avatar><q-icon :name="link.icon" /></q-item-section>
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container><router-view /></q-page-container>
  </q-layout>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logout } from 'src/services/auth'
const drawer = ref(false)
const router = useRouter()
const user = getUser()
const role = user?.uloga || 'korisnik'
const label = computed(() => role === 'admin' ? 'Administrator' : role === 'fotograf' ? 'Fotograf/Snimatelj' : 'Korisnik')
const links = computed(() => {
  if (role === 'admin') return [
    { label: 'Dashboard', icon: 'dashboard', to: '/admin' },
    { label: 'Korisnici', icon: 'people', to: '/admin/korisnici' },
    { label: 'Fotografi', icon: 'photo_camera', to: '/admin/fotografi' },
    { label: 'Usluge', icon: 'design_services', to: '/admin/usluge' },
    { label: 'Rezervacije', icon: 'event', to: '/admin/rezervacije' },
    { label: 'Izvještaji', icon: 'bar_chart', to: '/admin/izvjestaji' },
    { label: 'Upravljanje', icon: 'admin_panel_settings', to: '/admin/upravljanje' },
    { label: 'Specijalne funkcije', icon: 'settings_suggest', to: '/admin/specijalne-funkcije' },
    { label: 'Pomoć i FAQ', icon: 'help_outline', to: '/admin/pomoc' }
  ]
  if (role === 'fotograf') return [
    { label: 'Dashboard', icon: 'dashboard', to: '/fotograf' },
    { label: 'Portfolio', icon: 'collections', to: '/fotograf/portfolio' },
    { label: 'Rezervacije', icon: 'event_available', to: '/fotograf/rezervacije' },
    { label: 'Dostupnost', icon: 'schedule', to: '/fotograf/dostupnost' },
    { label: 'Profil', icon: 'person', to: '/fotograf/profil' },
    { label: 'Pomoć i FAQ', icon: 'help_outline', to: '/fotograf/pomoc' }
  ]
  return [
    { label: 'Usluge', icon: 'search', to: '/korisnik/usluge' },
    { label: 'Nova rezervacija', icon: 'add_circle', to: '/korisnik/rezervacija' },
    { label: 'Moje rezervacije', icon: 'event_note', to: '/korisnik/rezervacije' },
    { label: 'Profil', icon: 'person', to: '/korisnik/profil' },
    { label: 'Pomoć i FAQ', icon: 'help_outline', to: '/korisnik/pomoc' }
  ]
})
function doLogout () { logout(); router.push('/') }
</script>
