<template>
  <q-page padding>
    <h2>Admin panel – registrirani korisnici</h2>

    <q-table
      title="Registrirani korisnici (čekaju odobrenje)"
      :rows="registracija"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:body-cell-akcije="props">
        <q-td class="text-right">
            <q-btn
        label="Korisnik"
        color="primary"
        size="sm"
        class="q-mr-sm"
        @click="promijeniUlogu(props.row.id, 'korisnik')"
        />
        <q-btn
        label="Admin"
        color="secondary"
        size="sm"
        @click="promijeniUlogu(props.row.id, 'admin')"
        />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const backendURL = "http://localhost:3000/api/registracija"

const registracija = ref([])

const columns = [
  { name: "id", label: "ID", field: "id" },
  { name: "ime", label: "Ime", field: "ime" },
  { name: "prezime", label: "Prezime", field: "prezime" },
  { name: "korime", label: "Korisničko ime", field: "korime" },
  { name: "email", label: "Email", field: "email" },
  { name: "uloga", label: "Uloga", field: "uloga" },  
  { name: "akcije", label: "Akcije", field: "akcije" }
]

async function ucitajKorisnike() {
  try {
    const res = await axios.get(backendURL)
    registracija.value = res.data
  } catch (err) {
    console.error(err)
  }
}

async function promijeniUlogu(id, novaUloga) {
  try {
    await axios.post(`${backendURL}/${id}/odobri`, { uloga: novaUloga })
    await ucitajKorisnike()
  } catch (err) {
  console.error(err.response || err)
  alert(err.response?.data?.error || "Greška na serveru")
}
}

onMounted(() => {
  ucitajKorisnike()
})
</script>