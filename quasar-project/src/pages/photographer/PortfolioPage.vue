<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Upravljanje portfoliom</h1>

    <q-card flat bordered class="mockup-card">
      <div class="mockup-topbar">
        <div class="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <b>Portfolio</b>
      </div>

      <q-card-section>
        <div class="row q-gutter-sm q-mb-md">
          <q-btn outline color="positive" label="Dodaj fotografiju" @click="openForm('fotografija')" />
          <q-btn outline color="positive" label="Dodaj video" @click="openForm('video')" />
        </div>

        <q-form v-if="showForm" @submit.prevent="save" class="form-box q-mb-md">
          <q-input outlined dense v-model="form.naziv_rada" label="Naziv rada" />

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
            :label="form.tip === 'video' ? 'Link videa' : 'Link slike'"
          />

          <div class="row q-gutter-sm">
            <q-btn color="primary" label="Spremi" type="submit" />
            <q-btn flat color="dark" label="Odustani" @click="closeForm" />
          </div>
        </q-form>

        <div class="portfolio-grid">
          <div
            v-for="item in portfolio"
            :key="item.portfolio_id"
            class="portfolio-box"
            :class="{ selected: selectedId === item.portfolio_id }"
            @click="selectedId = item.portfolio_id"
          >
            <video
              v-if="isVideo(item.medij)"
              :src="item.medij"
              controls
              class="portfolio-media"
            ></video>

            <q-img
              v-else-if="item.medij"
              :src="item.medij"
              ratio="16/9"
              class="portfolio-img"
              spinner-color="primary"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3 text-grey-8">
                  Slika nije dostupna
                </div>
              </template>
            </q-img>

            <div class="q-mt-sm text-weight-bold">
              {{ item.naziv_rada }}
            </div>

            <div class="text-grey-7 text-caption">
              {{ item.opis_rada }}
            </div>
          </div>
        </div>

        <div class="row q-gutter-sm q-mt-md">
          <q-btn
            outline
            color="orange"
            label="Uredi odabrano"
            :disable="!selectedItem"
            @click="editSelected"
          />

          <q-btn
            outline
            color="negative"
            label="Obriši odabrano"
            :disable="!selectedItem"
            @click="removeSelected"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'

const $q = useQuasar()
const user = getUser() || {}

const portfolio = ref([])
const showForm = ref(false)
const selectedId = ref(null)
const editId = ref(null)

const form = reactive({
  fotograf_snimatelj_id: user.id || '',
  ime_fotografa_snimatelja: user.ime || '',
  prezime_fotografa_snimatelja: user.prezime || '',
  naziv_rada: '',
  opis_rada: '',
  medij: '',
  tip: 'fotografija'
})

const selectedItem = computed(() => {
  return portfolio.value.find(item => item.portfolio_id === selectedId.value)
})

function openForm (tip) {
  editId.value = null
  showForm.value = true
  form.tip = tip
  form.naziv_rada = ''
  form.opis_rada = ''
  form.medij = ''
}

function closeForm () {
  showForm.value = false
  editId.value = null
  form.naziv_rada = ''
  form.opis_rada = ''
  form.medij = ''
}

function isVideo (url) {
  if (!url) return false

  const cleanUrl = String(url).split('?')[0].toLowerCase()

  return cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.ogg') ||
    url.includes('youtube.com') ||
    url.includes('youtu.be')
}

async function load () {
  try {
    const res = await api.get('/portfolio', {
      params: {
        fotograf_id: form.fotograf_snimatelj_id
      }
    })

    console.log(res.data)

    portfolio.value = res.data
  } catch (error) {
    console.error(error)
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
    const data = {
      fotograf_snimatelj_id: form.fotograf_snimatelj_id,
      naziv_rada: form.naziv_rada,
      opis_rada: form.opis_rada,
      medij: form.medij,
      ime_fotografa_snimatelja: form.ime_fotografa_snimatelja,
      prezime_fotografa_snimatelja: form.prezime_fotografa_snimatelja
    }

    if (editId.value) {
      await api.put(`/portfolio/${editId.value}`, data)
      $q.notify({ type: 'positive', message: 'Portfolio je ažuriran.' })
    } else {
      await api.post('/portfolio', data)
      $q.notify({ type: 'positive', message: 'Rad je spremljen u portfolio.' })
    }

    closeForm()
    await load()
  } catch (error) {
    console.error(error.response?.data || error)

    $q.notify({
      type: 'negative',
      message: error.response?.data?.error || 'Greška kod spremanja portfolija.'
    })
  }
}

function editSelected () {
  if (!selectedItem.value) return

  editId.value = selectedItem.value.portfolio_id
  showForm.value = true

  form.naziv_rada = selectedItem.value.naziv_rada || ''
  form.opis_rada = selectedItem.value.opis_rada || ''
  form.medij = selectedItem.value.medij || ''
  form.tip = isVideo(selectedItem.value.medij) ? 'video' : 'fotografija'
}

async function removeSelected () {
  if (!selectedItem.value) return

  try {
    await api.delete(`/portfolio/${selectedItem.value.portfolio_id}`)

    $q.notify({
      type: 'positive',
      message: 'Odabrani rad je obrisan.'
    })

    selectedId.value = null
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

.form-box {
  padding: 16px;
  border: 1px dashed #9fb2ca;
  border-radius: 12px;
  background: white;
  display: grid;
  gap: 12px;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.portfolio-box {
  min-height: 120px;
  border: 1px dashed #9fb2ca;
  border-radius: 12px;
  background: white;
  padding: 10px;
  cursor: pointer;
  color: #52657d;
}

.portfolio-img {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
}

.portfolio-box.selected {
  border: 2px solid #1976d2;
  background: #eef6ff;
}

.portfolio-img {
  border-radius: 8px;
}

.portfolio-media {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  object-fit: cover;
  background: black;
}

@media (max-width: 700px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
}
</style>