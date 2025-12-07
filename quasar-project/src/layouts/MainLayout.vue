<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Početna Stranica',
    caption: 'Početna Stranica - ElegantEye',
    icon: 'home',
    link: 'https://quasar.dev',
  },
  {
    title: 'Unos Rezervacije',
    caption: 'Unos Rezervacije - ElegantEye',
    icon: 'add',
    link: 'http://localhost:9000/#/unosrez',
  },
  {
    title: 'Popis Rezervacija',
    caption: 'Popis Rezervacija - ElegantEye',
    icon: 'list_alt',
    link: 'http://localhost:9000/#/popisrez',
  },
  {
    title: 'Github',
    caption: 'Github Repozitorij - ElegantEye',
    icon: 'code',
    link: 'https://github.com/JayLeoDen/ElegantEye',
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
