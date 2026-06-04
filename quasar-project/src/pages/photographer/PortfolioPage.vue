<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Upravljanje portfoliom</h1>

    <q-card flat bordered class="q-pa-md q-mb-md">
      <q-form @submit.prevent="save" class="q-gutter-md">
        <q-input
          outlined
          dense
          v-model="form.naziv_rada"
          label="Naziv rada"
        />

        <q-input
          outlined
          dense
          type="textarea"
          v-model="form.opis_rada"
          label="Opis rada"
        />

        <q-input
          outlined
          dense
          v-model="form.medij"
          label="Link slike ili videa"
        />

        <q-btn
          color="primary"
          label="Spremi u portfolio"
          type="submit"
        />
      </q-form>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Moji radovi</div>
      </q-card-section>

      <q-card-section>
        <div class="ee-grid">
          <q-card
            v-for="item in portfolio"
            :key="item.portfolio_id"
            flat
            bordered
          >
            <q-img
              v-if="item.medij"
              :src="item.medij"
              ratio="16/9"
              spinner-color="primary"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3 text-grey-8">
                  Slika nije dostupna
                </div>
              </template>
            </q-img>

            <q-card-section>
              <div class="text-weight-bold text-h6">
                {{ item.naziv_rada }}
              </div>

              <p class="text-grey-7 q-mt-sm">
                {{ item.opis_rada }}
              </p>

              <div class="row q-gutter-sm q-mt-md">
                <q-btn
                  flat
                  dense
                  color="primary"
                  icon="open_in_new"
                  label="Otvori sliku"
                  :href="item.medij"
                  target="_blank"
                />

                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="delete"
                  label="Obriši"
                  @click="remove(item.portfolio_id)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'

const $q = useQuasar()
const user = getUser() || {}

const portfolio = ref([])

const form = reactive({
  fotograf_snimatelj_id: user.id || '',
  ime_fotografa_snimatelja: user.ime || '',
  prezime_fotografa_snimatelja: user.prezime || '',
  naziv_rada: '',
  opis_rada: '',
  medij: ''
})

async function load () {
  try {
    const res = await api.get('/portfolio', {
      params: {
        fotograf_id: form.fotograf_snimatelj_id
      }
    })

    portfolio.value = res.data
  } catch (error) {
    console.error(error)
    portfolio.value = []

    $q.notify({
      type: 'negative',
      message: 'Greška kod učitavanja portfolija.'
    })
  }
}

async function save () {
  if (!form.fotograf_snimatelj_id) {
    $q.notify({
      type: 'negative',
      message: 'Nije pronađen ID fotografa. Prijavi se ponovno.'
    })
    return
  }

  if (!form.naziv_rada || !form.medij) {
    $q.notify({
      type: 'warning',
      message: 'Unesi naziv rada i link slike ili videa.'
    })
    return
  }

  try {
    await api.post('/portfolio', {
      fotograf_snimatelj_id: form.fotograf_snimatelj_id,
      naziv_rada: form.naziv_rada,
      opis_rada: form.opis_rada,
      medij: form.medij,
      ime_fotografa_snimatelja: form.ime_fotografa_snimatelja,
      prezime_fotografa_snimatelja: form.prezime_fotografa_snimatelja
    })

    $q.notify({
      type: 'positive',
      message: 'Rad je spremljen u portfolio.'
    })

    form.naziv_rada = ''
    form.opis_rada = ''
    form.medij = ''

    await load()
  } catch (error) {
    console.error(error.response?.data || error)

    $q.notify({
      type: 'negative',
      message: error.response?.data?.error || 'Greška kod spremanja portfolija.'
    })
  }
}

async function remove (id) {
  try {
    await api.delete(`/portfolio/${id}`)

    $q.notify({
      type: 'positive',
      message: 'Rad je obrisan.'
    })

    await load()
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: 'Greška kod brisanja rada.'
    })
  }
}

onMounted(load)
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

.ee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
</style>