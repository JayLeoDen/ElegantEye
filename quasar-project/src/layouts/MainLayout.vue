<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          ElegantEye
        </q-toolbar-title>

        <q-space />

        <template v-if="!isLoggedIn">
          <q-btn
            flat
            label="Registracija"
            icon="person_add"
            to="/registracija"
          />
          <q-btn
            flat
            label="Login"
            icon="login"
            to="/login"
          />
        </template>

        <template v-else>
          <q-btn
            flat
            label="Odjava"
            icon="logout"
            @click="logout"
          />
        </template>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Navigacija </q-item-label>

        <EssentialLink
          v-for="link in filteredLinks"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

const router = useRouter()
const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token')
})

const userRole = computed(() => {
  const token = localStorage.getItem('token')
  return token ? JSON.parse(token).uloga : null
})

function logout () {
  localStorage.removeItem('token')
  router.push('/login')
}

const linksList = [
  {
    title: 'Početna Stranica',
    caption: 'Početna Stranica - ElegantEye',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Popis Fotografa/Snimatelja',
    caption: 'Popis Fotografa/Snimatelja - ElegantEye',
    icon: 'list_alt',
    link: '/popisfoto'
  },
  {
    title: 'Unos Fotografa/Snimatelja',
    caption: 'Unos Fotografa/Snimatelja - ElegantEye',
    icon: 'add',
    link: '/admin/unosfoto',
    role: 'admin'
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
    icon: 'add',
    link: '/admin/Unosdogadaja',
    role: 'admin'
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
    icon: 'add',
    link: '/admin/unosrez',
    role: 'admin'
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
    icon: 'add',
    link: '/admin/unosusluga',
    role: 'admin'
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
    icon: 'add',
    link: '/admin/unoskorisnika',
    role: 'admin'
  },
]

const filteredLinks = computed(() => {
  return linksList.filter(link => {
    if (!link.role) return true
    return userRole.value === link.role
  })
})
</script>