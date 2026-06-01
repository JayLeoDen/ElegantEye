<template>
  <q-page class="ee-page"><h1 class="page-heading">Dostupnost fotografa/snimatelja</h1><q-card flat bordered class="q-pa-md q-mb-md"><q-form @submit="save" class="row q-col-gutter-md"><div class="col-12 col-md-4"><q-input outlined v-model="form.datum_dostupnosti" type="date" label="Datum dostupnosti"/></div><div class="col-12 col-md-4"><q-input outlined v-model="form.vrijeme_dostupnosti" type="time" label="Vrijeme dostupnosti"/></div><div class="col-12 col-md-3"><q-select outlined v-model="form.status_dostupnosti" :options="['slobodan','zauzet']" label="Status"/></div><div class="col-12 col-md-1 flex items-end"><q-btn color="primary" icon="add" type="submit"/></div></q-form></q-card><q-table flat bordered :rows="rows" :columns="columns" row-key="dostupnost_id"/></q-page>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'
const user=getUser(); const rows=ref([]); const form=reactive({fotograf_snimatelj_id:user?.id,datum_dostupnosti:'',vrijeme_dostupnosti:'',status_dostupnosti:'slobodan'})
const columns=[{name:'datum',label:'Datum',field:'datum_dostupnosti'},{name:'vrijeme',label:'Vrijeme',field:'vrijeme_dostupnosti'},{name:'status',label:'Status',field:'status_dostupnosti'}]
async function load(){ rows.value=(await api.get('/dostupnost',{params:{fotograf_snimatelj_id:user?.id}})).data }
async function save(){ await api.post('/dostupnost',form); load() }
onMounted(load)
</script>
