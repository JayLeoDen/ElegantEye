<template>
  <q-layout view="hHh Lpr fFf">

    <q-header elevated>
      <q-toolbar>

        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          ElegantEye (Administratorsko sučelje)
        </q-toolbar-title>

        <q-space />

        <div class="q-mr-md" v-if="isLoggedIn">
          Korisnik: <strong>{{ ime_korisnika }}</strong>
        </div>

        <q-btn
          flat
          icon="logout"
          label="Odjava"
          v-if="isLoggedIn"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item-label header> Admin izbornik </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

const router = useRouter()
const leftDrawerOpen = ref(true)
const ime_korisnika = ref('')

const isLoggedIn = ref(false)

const token = localStorage.getItem('token')
if (token) {
  const korisnik = JSON.parse(token)
  if (korisnik.uloga !== 'admin') {
    router.push('/popisfoto')
  } else {
    ime_korisnika.value = korisnik.korime
    isLoggedIn.value = true
  }
}

function logout() {
  localStorage.removeItem('token')
  ime_korisnika.value = ''
  isLoggedIn.value = false
  router.push('/login')
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const linksList = [
  {
    title: 'Admin početna',
    caption: 'Administratorska početna stranica',
    icon: 'home',
    link: '/admin'
  },
  {
    title: 'Popis fotografa/snimatelja',
    caption: 'Popis fotografa/snimatelja - ElegantEye',
    icon: 'list_alt',
    link: '/admin/popisfoto'
  },
  {
    title: 'Unos fotografa/snimatelja',
    caption: 'Unos fotografa/snimatelja - ElegantEye',
    icon: 'library_add',
    link: '/admin/unosfoto'
  },
  {
    title: 'Popis Događaja',
    caption: 'Popis Događaja - ElegantEye',
    icon: 'list_alt',
    link: '/Popisdogadaja' 
  },
  {
    title: 'Unos Događaja',
    caption: 'Unos Događaja - ElegantEye',
    icon: 'library_add',
    link: '/admin/Unosdogadaja' 
  },
  {
    title: 'Popis Rezervacija',
    caption: 'Popis Rezervacija - ElegantEye',
    icon: 'list_alt',
    link: '/popisrez'
  },
  {
    title: 'Unos Rezervacija',
    caption: 'Unos Rezervacija - ElegantEye',
    icon: 'library_add',
    link: '/admin/unosrez'
  },
  {
    title: 'Popis Usluga',
    caption: 'Popis Usluga - ElegantEye',
    icon: 'list_alt',
    link: '/popisusluga'
  },
  {
    title: 'Unos Usluga',
    caption: 'Unos Usluga - ElegantEye',
    icon: 'library_add',
    link: '/admin/unosusluga'
  },
  {
    title: 'Popis Korisnika',
    caption: 'Popis Korisnika - ElegantEye',
    icon: 'list_alt',
    link: '/prikazkorisnika'
  },
  {
    title: 'Unos Korisnika',
    caption: 'Unos Korisnika - ElegantEye',
    icon: 'library_add',
    link: '/admin/unoskorisnika'
  },
  {
    title: 'Potvrda Registracija',
    caption: 'Potvrda Registracija - ElegantEye',
    icon: 'incomplete_circle',
    link: '/admin/potvrda'
  }
]
</script>