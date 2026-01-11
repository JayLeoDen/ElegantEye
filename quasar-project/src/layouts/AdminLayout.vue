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

// reactive login state
const isLoggedIn = ref(false)

// inicijalno provjeri token
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

// logout funkcija
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
    title: 'Popis fotografa',
    caption: 'Popis fotografa - ElegantEye',
    icon: 'list',
    link: '/admin/popisfoto'
  },
  {
    title: 'Unos fotografa',
    caption: 'Unos fotografa - ElegantEye',
    icon: 'library_add',
    link: '/admin/unosfoto'
  }
]
</script>
