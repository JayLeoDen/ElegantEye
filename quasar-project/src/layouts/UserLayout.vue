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
          ElegantEye (Korisničko sučelje)
        </q-toolbar-title>

        <q-space />

        <div class="q-mr-md">
          Korisnik: <strong>{{ ime_korisnika }}</strong>
        </div>

        <q-btn
          flat
          icon="logout"
          label="Odjava"
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
        <q-item-label header> Korisnički izbornik </q-item-label>

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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

const router = useRouter()
const leftDrawerOpen = ref(true)
const ime_korisnika = ref('')

onMounted(() => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')
    return
  }

  const korisnik = JSON.parse(token)

  if (korisnik.uloga === 'admin') {
    router.push('/admin')
    return
  }

  if (korisnik.uloga !== 'korisnik') {
    router.push('/')
    return
  }

  ime_korisnika.value = korisnik.korime
})

function logout () {
  localStorage.removeItem('token')
  router.push('/login')
}

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const linksList = [
  {
    title: 'Korisnička početna',
    caption: 'Početna stranica korisnika',
    icon: 'home',
    link: '/user'
  },
  {
    title: 'Popis fotografa',
    caption: 'Popis fotografa - ElegantEye',
    icon: 'list',
    link: '/user/popisfoto'
  }

]
</script>
