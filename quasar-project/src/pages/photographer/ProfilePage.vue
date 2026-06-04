<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Profil fotografa/snimatelja</h1>

    <q-card flat bordered class="mockup-card">
      <div class="mockup-topbar">
        <div class="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <b>Profil pružatelja usluge</b>
      </div>

      <q-card-section>
        <q-card flat bordered class="info-box q-mb-md">
          <div class="text-weight-bold q-mb-sm">Osnovni podaci</div>

          <div>Ime: {{ profile.ime }} {{ profile.prezime }}</div>
          <div>Vrsta usluge: Fotograf</div>
          <div>Ocjena: 4.9</div>

          <div class="q-mt-sm">
            <q-chip dense color="primary" outline label="Vjenčanja" />
            <q-chip dense color="primary" outline label="Portreti" />
            <q-chip dense color="primary" outline label="Eventi" />
          </div>
        </q-card>

        <q-card flat bordered class="info-box q-mb-md">
          <div class="text-weight-bold q-mb-sm">Opis i dostupnost</div>

          <div>
            {{ profile.opis_rada || 'Profesionalni fotograf specijaliziran za vjenčanja i proslave.' }}
          </div>

          <q-input
            outlined
            dense
            readonly
            model-value="Dostupni termini i cijene"
            class="q-mt-md"
          />
        </q-card>

        <div class="row q-gutter-sm">
          <q-btn
            outline
            color="primary"
            label="Uredi profil"
            @click="showEdit = true"
          />

          <q-btn
            outline
            color="positive"
            label="Upravljaj portfoliom"
            to="/fotograf/portfolio"
          />

          <q-btn
            outline
            color="dark"
            label="Pregledaj rezervacije"
            to="/fotograf/rezervacije"
          />

          <q-btn
            outline
            color="secondary"
            label="Dostupnost"
            to="/fotograf/dostupnost"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showEdit">
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Uredi profil</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined dense v-model="profile.ime" label="Ime" class="q-mb-md" />
          <q-input outlined dense v-model="profile.prezime" label="Prezime" class="q-mb-md" />
          <q-input outlined dense v-model="profile.email" label="Email" class="q-mb-md" />

          <q-input
            outlined
            type="textarea"
            v-model="profile.opis_rada"
            label="Opis rada"
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />

          <q-btn
            color="primary"
            label="Spremi profil"
            @click="save"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { getUser, setUser } from 'src/services/auth'

const $q = useQuasar()
const user = getUser() || {}

const showEdit = ref(false)

const profile = reactive({
  ime: user.ime || 'Ivan',
  prezime: user.prezime || 'Horvat',
  email: user.email || '',
  opis_rada: user.opis_rada || 'Profesionalni fotograf specijaliziran za vjenčanja i proslave.'
})

function save () {
  setUser({
    user: {
      ...user,
      ...profile
    },
    token: localStorage.getItem('ee_token')
  })

  showEdit.value = false

  $q.notify({
    type: 'positive',
    message: 'Profil je spremljen lokalno.'
  })
}
</script>

<style scoped>
.ee-page {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100vh;
}

.page-heading {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 20px;
  color: #17213a;
}

.mockup-card {
  max-width: 1100px;
  margin: 0 auto;
  border-radius: 14px;
  background: #f8fbff;
  border: 1px solid #cfd9e8;
}

.mockup-topbar {
  height: 42px;
  background: #e8eef6;
  border-bottom: 1px solid #cfd9e8;
  border-radius: 14px 14px 0 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  color: #2e3b55;
}

.dots {
  display: flex;
  gap: 7px;
}

.dots span {
  width: 10px;
  height: 10px;
  background: #9aabc1;
  border-radius: 50%;
}

.info-box {
  border-radius: 12px;
  padding: 18px;
  background: white;
  border: 1px solid #d7e2ef;
}

.q-chip {
  font-size: 12px;
}
</style>