<template>
  <q-page class="ee-page">
    <h1 class="page-heading">Pregled rezervacija</h1>
    <q-table flat bordered :rows="rows" :columns="columns" row-key="rezervacija_id" :loading="loading">
      <template #body-cell-status_rezervacije="p"><q-td :props="p"><q-select dense outlined :model-value="p.row.status_rezervacije || 'na cekanju'" :options="statuses" @update:model-value="v => updateStatus(p.row, v)" /></q-td></template>
      <template #body-cell-actions="p"><q-td :props="p"><q-btn dense flat icon="delete" color="negative" @click="remove(p.row)" /></q-td></template>
    </q-table>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
const $q = useQuasar(); const loading = ref(false); const rows = ref([]); const statuses = ['na cekanju','potvrdjena','odbijena','otkazana']
const columns = [{name:'rezervacija_id',label:'ID',field:'rezervacija_id'},{name:'datum',label:'Datum',field:'datum_nove_rezervacije'},{name:'vrijeme',label:'Vrijeme',field:'vrijeme_nove_rezervacije'},{name:'korisnik',label:'Korisnik',field:r=>`${r.ime_korisnika||''} ${r.prezime_korisnika||''}`},{name:'fotograf',label:'Fotograf',field:r=>`${r.ime_fotografa_snimatelja||''} ${r.prezime_fotografa_snimatelja||''}`},{name:'usluga',label:'Usluga',field:'naziv_usluge'},{name:'status_rezervacije',label:'Status',field:'status_rezervacije'},{name:'actions',label:'',field:'actions'}]
async function load(){ loading.value=true; try{ rows.value=(await api.get('/rezervacije')).data } finally{ loading.value=false } }
async function updateStatus(row,status){ try{ await api.put(`/rezervacije/${row.rezervacija_id}/status`,{status}); row.status_rezervacije=status } catch(e){ $q.notify({type:'negative',message:e.response?.data?.error||'Greška'}) } }
async function remove(row){ try{ await api.delete(`/rezervacije/${row.rezervacija_id}`); load() } catch(e){ $q.notify({type:'negative',message:e.response?.data?.error||'Greška'}) } }
onMounted(load)
</script>
