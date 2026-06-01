<template>
  <q-page class="ee-page">
    <div class="mock-title">9. Pregled i obrada rezervacija fotografa/snimatelja</div>
    <section class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot"/><span class="mock-dot"/><span class="mock-dot"/>
        <span class="q-ml-md">Rezervacije pružatelja usluge</span>
      </div>
      <div class="mock-content">

        <q-table
          flat bordered
          :rows="rows"
          :columns="columns"
          row-key="rezervacija_id"
          :loading="ucitavanje"
          no-data-label="Nema rezervacija"
        >

          <!-- Status badge — Mockup 9 -->
          <template #body-cell-status="p">
            <q-td :props="p">
              <q-badge
                :color="statusBoja(p.row.status_rezervacije)"
                :label="statusLabel(p.row.status_rezervacije)"
              />
            </q-td>
          </template>

          <!-- Akcijski gumbi — Mockup 9 -->
          <template #body-cell-actions="p">
            <q-td :props="p" class="q-gutter-xs">
              <q-btn
                v-if="!p.row.status_rezervacije || p.row.status_rezervacije === 'nova' || p.row.status_rezervacije === 'na_cekanju'"
                rounded dense
                color="green"
                label="Potvrdi rezervaciju"
                size="sm"
                @click="promijeniStatus(p.row, 'potvrdjena')"
              />
              <q-btn
                v-if="!p.row.status_rezervacije || p.row.status_rezervacije === 'nova' || p.row.status_rezervacije === 'na_cekanju'"
                rounded dense
                color="red-4"
                label="Odbij rezervaciju"
                size="sm"
                @click="promijeniStatus(p.row, 'odbijena')"
              />
              <q-btn
                rounded dense
                outline
                label="Pregled detalja"
                size="sm"
                :to="p.row.usluga_id ? `/usluge/${p.row.fotograf_snimatelj_id}` : '#'"
              />
            </q-td>
          </template>

        </q-table>

      </div>
    </section>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getUser } from 'src/services/auth'

const $q = useQuasar()
const user = getUser()
const rows = ref([])
const ucitavanje = ref(false)

const columns = [
  {
    name: 'klijent',
    label: 'Klijent',
    field: r => `${r.ime_korisnika || ''} ${r.prezime_korisnika || ''}`.trim() || `Korisnik #${r.korisnik_id}`,
    align: 'left'
  },
  {
    name: 'datum',
    label: 'Datum',
    field: r => r.datum_nove_rezervacije
      ? new Date(r.datum_nove_rezervacije).toLocaleDateString('hr-HR')
      : '—',
    align: 'left'
  },
  {
    name: 'usluga',
    label: 'Usluga',
    field: r => r.naziv_usluge || r.naziv_dostupne_usluge || `Usluga #${r.usluga_id}`,
    align: 'left'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status_rezervacije',
    align: 'left'
  },
  {
    name: 'actions',
    label: 'Akcije',
    field: 'actions',
    align: 'left'
  }
]

function statusLabel(s) {
  const m = {
    nova: 'Na čekanju',
    na_cekanju: 'Na čekanju',
    potvrdjena: 'Potvrđena',
    odbijena: 'Odbijena'
  }
  return m[s] ?? 'Na čekanju'
}

function statusBoja(s) {
  const m = {
    nova: 'orange',
    na_cekanju: 'orange',
    potvrdjena: 'green',
    odbijena: 'red'
  }
  return m[s] ?? 'orange'
}

async function load() {
  ucitavanje.value = true
  try {
    rows.value = (
      await api.get('/rezervacije', {
        params: { fotograf_snimatelj_id: user?.id }
      })
    ).data
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Greška pri dohvaćanju rezervacija' })
  } finally {
    ucitavanje.value = false
  }
}

async function promijeniStatus(row, s) {
  try {
    await api.put(`/rezervacije/${row.rezervacija_id}/status`, { status: s })
    $q.notify({
      type: 'positive',
      message: s === 'potvrdjena' ? 'Rezervacija potvrđena!' : 'Rezervacija odbijena.'
    })
    load()
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Greška pri promjeni statusa' })
  }
}

onMounted(load)
</script>
