<template>
  <q-page padding>
    <q-banner class="bg-primary text-white q-mb-lg rounded-borders">
      <div class="text-h5"> Popis svih događaja</div>
      <div class="text-subtitle2">Pregled svih evidentiranih događaja</div>
    </q-banner>

    <div class="row q-col-gutter-lg">
      <q-card
        v-for="dogadaj in dogadaji"
        :key="dogadaj.Sifra_dogadaja"
        bordered
        class="col-12 col-md-4 q-hoverable"
      >
        <q-card-section>
          <div class="row items-center q-mb-sm">
            <q-icon name="event" size="md" color="primary" class="q-mr-sm" />
            <div class="text-h6">
              {{ dogadaj.Tip_dogadaja || 'Nepoznat tip' }}
            </div>
          </div>

          <q-separator class="q-my-sm" />

          <div class="text-caption text-grey-7">
            Šifra događaja
          </div>
          <div class="text-subtitle2 q-mb-sm">
            {{ dogadaj.Sifra_dogadaja }}
          </div>

          <q-chip
            icon="schedule"
            color="primary"
            text-color="white"
            class="q-mb-sm"
          >
            {{ formatDatum(dogadaj.Datum_i_vrijeme_dogadaja) }}
          </q-chip>

          <div class="row items-center q-mt-sm">
            <q-icon name="place" color="grey-7" class="q-mr-sm" />
            <span>{{ dogadaj.Lokacija_dogadaja || 'Bez lokacije' }}</span>
          </div>

          <div
            v-if="dogadaj.Opis_dogadaja"
            class="q-mt-sm text-body2 text-grey-8"
          >
            {{ dogadaj.Opis_dogadaja }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const dogadaji = ref([]);

function formatDatum(datum) {
  if (!datum) return "Bez datuma";
  return new Date(datum).toLocaleString("hr-HR");
}

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/dogadaji");
    dogadaji.value = res.data;
  } catch (err) {
    console.error(err);
  }
});
</script>
