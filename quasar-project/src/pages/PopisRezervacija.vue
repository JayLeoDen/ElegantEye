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
          row-key="Sifra_rezervacije"
          flat
          bordered
        >
          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn
                flat
                icon="delete"
                color="negative"
                @click="obrisiRezervaciju(props.row.Sifra_rezervacije)"
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
        { name: "Sifra_rezervacije", label: "Šifra rezervacije", field: "Sifra_rezervacije", align: "left" },
        { name: "Sifra_klijenta", label: "Šifra klijenta", field: "Sifra_klijenta", align: "left" },
        { name: "Sifra_dogadaja", label: "Šifra događaja", field: "Sifra_dogadaja", align: "left" },
        { name: "Usluga_ID", label: "Usluga ID", field: "Usluga_ID", align: "left" },
        { name: "Napomena", label: "Napomena", field: "Napomena", align: "left" },
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
