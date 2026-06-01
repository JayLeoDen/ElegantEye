<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Upravljanje portfolijom</h1>
    <p class="subtle q-mb-lg">Dodavanje fotografija ili videozapisa, uređivanje postojećih sadržaja i brisanje sadržaja.</p>

    <q-card flat bordered class="q-pa-md q-mb-md">
      <q-form @submit="save" class="row q-col-gutter-md">
        <div class="col-12 col-md-3"><q-input outlined dense v-model="form.naziv_rada" label="Naziv rada" /></div>
        <div class="col-12 col-md-4"><q-input outlined dense v-model="form.opis_rada" label="Opis rada" /></div>
        <div class="col-12 col-md-4"><q-input outlined dense v-model="form.medij" label="URL slike/videozapisa" /></div>
        <div class="col-12 col-md-1 flex items-end"><q-btn color="primary" :icon="editing ? 'save' : 'add'" type="submit" /></div>
        <div class="col-12" v-if="editing"><q-btn flat color="grey-8" label="Odustani od uređivanja" @click="reset" /></div>
      </q-form>
    </q-card>

    <div class="ee-grid">
      <q-card v-for="p in rows" :key="p.portfolio_id" flat bordered>
        <q-img :src="p.medij" ratio="16/9">
          <template #error><div class="absolute-full flex flex-center bg-grey-3 text-grey-7">Medij nije dostupan</div></template>
        </q-img>
        <q-card-section>
          <b>{{ p.naziv_rada }}</b>
          <p class="subtle">{{ p.opis_rada }}</p>
          <q-btn dense outline color="primary" label="Uredi" @click="edit(p)" class="q-mr-sm" />
          <q-btn dense outline color="negative" label="Obriši" @click="remove(p)" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'

const user = getUser()
const $q = useQuasar()
const rows = ref([])
const editing = ref(null)
const form = reactive({ fotograf_snimatelj_id: user?.id, naziv_rada: '', opis_rada: '', medij: '' })

function reset () { editing.value = null; form.naziv_rada = ''; form.opis_rada = ''; form.medij = ''; form.fotograf_snimatelj_id = user?.id }
async function load () { rows.value = (await api.get('/portfolio', { params: { fotograf_id: user?.id } })).data }
function edit (p) { editing.value = p; form.naziv_rada = p.naziv_rada || ''; form.opis_rada = p.opis_rada || ''; form.medij = p.medij || '' }
async function save () {
  try {
    if (editing.value) await api.put(`/portfolio/${editing.value.portfolio_id}`, form)
    else await api.post('/portfolio', form)
    $q.notify({ type: 'positive', message: editing.value ? 'Portfolio ažuriran' : 'Portfolio spremljen' })
    reset(); load()
  } catch (e) { $q.notify({ type: 'negative', message: e.response?.data?.error || 'Greška' }) }
}
async function remove (p) { await api.delete(`/portfolio/${p.portfolio_id}`); load() }
onMounted(load)
</script>
