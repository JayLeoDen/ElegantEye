<template>
  <q-page padding>

    <!-- Naslov -->
    <q-banner class="bg-primary text-white q-mb-lg rounded-borders">
      <div class="text-h5">
        Popis svih događaja
      </div>

      <div class="text-subtitle2">
        Pregled svih evidentiranih događaja
      </div>
    </q-banner>


    <!-- Ako nema događaja -->
    <div
      v-if="dogadaji.length === 0"
      class="text-center text-grey q-mt-xl"
    >
      Nema događaja za prikaz.
    </div>


    <!-- Kartice događaja -->
    <div class="row q-col-gutter-lg">

      <div
        v-for="dogadaj in dogadaji"
        :key="dogadaj.dogadaj_id"
        class="col-12 col-md-4"
      >

        <q-card bordered class="full-height">

          <q-card-section>

            <!-- Naslov -->
            <div class="row items-center q-mb-sm">
              <q-icon
                name="event"
                size="md"
                color="primary"
                class="q-mr-sm"
              />

              <div class="text-h6">
                Događaj #{{ dogadaj.dogadaj_id }}
              </div>
            </div>

            <q-separator class="q-my-sm" />


            <!-- Datum -->
            <div class="text-caption text-grey-7">
              Datum događaja
            </div>

            <q-chip
              icon="schedule"
              color="primary"
              text-color="white"
              class="q-mb-sm"
            >
              {{ formatDatum(
                dogadaj.datum_dogadaja,
                dogadaj.vrijeme_dogadaja
              ) }}
            </q-chip>


            <!-- Lokacija -->
            <div class="row items-center q-mt-sm">
              <q-icon
                name="place"
                color="grey-7"
                class="q-mr-sm"
              />

              <span>
                {{ dogadaj.lokacija_dogadaja || "Bez lokacije" }}
              </span>
            </div>


            <!-- Opis -->
            <div
              v-if="dogadaj.opis_dogadaja"
              class="q-mt-sm text-body2 text-grey-8"
            >
              {{ dogadaj.opis_dogadaja }}
            </div>

          </q-card-section>

        </q-card>

      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const dogadaji = ref([]);


// Formatiranje datuma i vremena
function formatDatum(datum, vrijeme) {

  if (!datum) {
    return "Bez datuma";
  }

  const d = new Date(datum);

  const datumFormatiran = d.toLocaleDateString("hr-HR");

  return `${datumFormatiran} ${vrijeme || ""}`;
}


// Dohvaćanje događaja
onMounted(async () => {

  try {

    const response = await axios.get(
      "http://localhost:3000/api/dogadaji"
    );

    console.log("DOGAĐAJI:", response.data);

    dogadaji.value = response.data;

  } catch (error) {

    console.error("GREŠKA:", error);

  }

});
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>