<template>
  <q-page class="ee-page"><h1 class="page-heading">Pregled i obrada rezervacija</h1><q-table flat bordered :rows="rows" :columns="columns" row-key="rezervacija_id"><template #body-cell-actions="p"><q-td :props="p"><q-btn dense color="positive" label="Potvrdi" @click="status(p.row,'potvrdjena')" class="q-mr-sm"/><q-btn dense color="negative" label="Odbij" @click="status(p.row,'odbijena')"/></q-td></template></q-table></q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'
const user=getUser(); const rows=ref([])
const columns=[{name:'rezervacija_id',label:'ID',field:'rezervacija_id'},{name:'datum',label:'Datum',field:'datum_nove_rezervacije'},{name:'vrijeme',label:'Vrijeme',field:'vrijeme_nove_rezervacije'},{name:'korisnik',label:'Klijent',field:r=>`${r.ime_korisnika||''} ${r.prezime_korisnika||''}`},{name:'lokacija',label:'Lokacija',field:'lokacija_dogadaja'},{name:'napomena',label:'Napomena',field:'napomena_rezervacije'},{name:'status',label:'Status',field:'status_rezervacije'},{name:'actions',label:'Akcije',field:'actions'}]
async function load(){ rows.value=(await api.get('/rezervacije',{params:{fotograf_snimatelj_id:user?.id}})).data }
async function status(row,s){ await api.put(`/rezervacije/${row.rezervacija_id}/status`,{status:s}); load() }
onMounted(load)
</script>
