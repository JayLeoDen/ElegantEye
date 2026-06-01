<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Kreiranje rezervacije</h1><p class="subtle">Odaberi uslugu, fotografa/snimatelja i termin događaja.</p>
    <section class="mock-window"><div class="mock-bar"><span class="mock-dot"/><span class="mock-dot"/><span class="mock-dot"/> <span class="q-ml-md">Nova rezervacija</span></div>
      <div class="mock-content">
        <q-form @submit="save" class="q-gutter-md">
          <q-select outlined v-model="form.usluga_id" :options="usluge" option-label="naziv" option-value="usluga_id" emit-value map-options label="Usluga" />
          <q-select outlined v-model="form.fotograf_snimatelj_id" :options="fotografi" option-label="full" option-value="fotograf_snimatelj_id" emit-value map-options label="Fotograf/Snimatelj" />
          <div class="row q-col-gutter-md"><div class="col-12 col-md-6"><q-input outlined type="date" v-model="form.datum_nove_rezervacije" label="Datum" /></div><div class="col-12 col-md-6"><q-input outlined type="time" v-model="form.vrijeme_nove_rezervacije" label="Vrijeme" /></div></div>
          <q-input outlined v-model="form.lokacija_dogadaja" label="Lokacija događaja" />
          <q-input outlined type="textarea" v-model="form.napomena_rezervacije" label="Dodatne napomene" />
          <q-btn color="primary" label="Potvrdi rezervaciju" type="submit" :loading="loading" />
        </q-form>
      </div></section>
  </q-page>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'
const $q = useQuasar(); const route = useRoute(); const router = useRouter(); const loading = ref(false)
const user = getUser(); const usluge = ref([]); const fotografi = ref([])
const form = reactive({ korisnik_id: user?.id, usluga_id: null, fotograf_snimatelj_id: route.query.fotograf ? Number(route.query.fotograf) : null, datum_nove_rezervacije: '', vrijeme_nove_rezervacije: '', lokacija_dogadaja: '', napomena_rezervacije: '' })
onMounted(async () => { usluge.value = (await api.get('/usluge')).data; fotografi.value = (await api.get('/fotografi')).data.map(f => ({ ...f, full: `${f.ime} ${f.prezime}` })) })
async function save () { loading.value = true; try { await api.post('/rezervacije', form); $q.notify({ type:'positive', message:'Rezervacija spremljena' }); router.push('/korisnik/rezervacije') } catch (e) { $q.notify({ type:'negative', message:e.response?.data?.error || 'Greška' }) } finally { loading.value = false } }
</script>
