<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Profil fotografa/snimatelja</h1>
    <p class="subtle q-mb-lg">Javni profil, opis rada, ocjene i portfolio.</p>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-5">
        <q-card flat bordered class="q-pa-lg">
          <div class="text-h6 q-mb-md">Podaci profila</div>
          <q-input outlined dense v-model="profile.ime" label="Ime" class="q-mb-md" />
          <q-input outlined dense v-model="profile.prezime" label="Prezime" class="q-mb-md" />
          <q-input outlined dense v-model="profile.email" label="Email" class="q-mb-md" />
          <q-input outlined type="textarea" v-model="profile.opis_rada" label="Opis rada" class="q-mb-md" />
          <q-btn color="primary" label="Spremi profil" @click="save" />
        </q-card>
      </div>

      <div class="col-12 col-md-7">
        <q-card flat bordered class="q-pa-lg q-mb-md">
          <div class="row items-center q-col-gutter-md">
            <div class="col-auto"><q-avatar size="72px" color="primary" text-color="white" icon="photo_camera" /></div>
            <div class="col">
              <div class="text-h5 text-weight-bold">{{ profile.ime }} {{ profile.prezime }}</div>
              <div class="subtle">{{ profile.opis_rada || 'Fotograf i snimatelj za događaje' }}</div>
              <q-rating v-model="rating" readonly color="amber" size="22px" class="q-mt-sm" />
            </div>
          </div>
        </q-card>

        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Portfolio</div>
          </q-card-section>
          <q-card-section>
            <div class="ee-grid">
              <q-card v-for="item in portfolio" :key="item.portfolio_id" flat bordered>
                <q-img :src="item.medij" ratio="16/9" />
                <q-card-section>
                  <b>{{ item.naziv_rada }}</b>
                  <p class="subtle q-mb-none">{{ item.opis_rada }}</p>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getUser, setUser } from 'src/services/auth'

const $q = useQuasar()
const user = getUser() || {}
const profile = reactive({ ime: user.ime || '', prezime: user.prezime || '', email: user.email || '', opis_rada: user.opis_rada || '' })
const portfolio = ref([])
const rating = ref(5)

async function load () {
  try { portfolio.value = (await api.get('/portfolio', { params: { fotograf_id: user.id } })).data } catch { portfolio.value = [] }
}

function save () {
  setUser({ user: { ...user, ...profile }, token: localStorage.getItem('ee_token') })
  $q.notify({ type: 'positive', message: 'Profil je spremljen lokalno.' })
}

onMounted(load)
</script>
