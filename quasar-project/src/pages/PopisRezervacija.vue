<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Popis rezervacija</div>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="rezervacije"
          :columns="columns"
          row-key="rezervacija_id"
          flat
          bordered
        >
          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn
                flat
                icon="delete"
                color="negative"
                @click="obrisiRezervaciju(props.row.rezervacija_id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  name: "PopisRezervacija",
  data() {
    return {
      rezervacije: [],
      columns: [
        { name: "rezervacija_id", label: "ID rezervacije", field: "rezervacija_id", align: "left" },
        { name: "korisnik_id", label: "ID klijenta", field: "korisnik_id", align: "left" },
        { name: "dogadaj_id", label: "ID događaja", field: "dogadaj_id", align: "left" },
        { name: "usluga_id", label: "ID usluge", field: "usluga_id", align: "left" },
        { name: "napomena_rezervacije", label: "Napomena", field: "napomena_rezervacije", align: "left" },
        { name: "actions", label: "Akcije", field: "actions", align: "center" }
      ]
    };
  },
  methods: {
    async loadRezervacije() {
      try {
        const res = await axios.get("http://localhost:3000/api/rezervacije");
        this.rezervacije = res.data;
      } catch (err) {
        console.error("Load ERROR:", err);
        this.$q.notify({ type: "negative", message: "Greška pri dohvaćanju rezervacija" });
      }
    },

    async obrisiRezervaciju(id) {
      if (!id) return;
      try {
        await axios.delete(`http://localhost:3000/api/rezervacije/${Number(id)}`);
        this.$q.notify({ type: "positive", message: "Rezervacija obrisana" });
        this.loadRezervacije();
      } catch (err) {
        console.error("Delete ERROR:", err);
        this.$q.notify({ type: "negative", message: "Greška pri brisanju rezervacije" });
      }
    }
  },
  mounted() {
    this.loadRezervacije();
  }
};
</script>
