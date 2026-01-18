<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Unos nove rezervacije</div>
      </q-card-section>

      <q-card-section>
        <q-select
          v-model="Sifra_klijenta"
          label="Odaberi klijenta"
          :options="klijenti"
          emit-value
          map-options
          :rules="[val => !!val || 'Klijent je obavezan']"
        />

        <q-select
          v-model="Sifra_dogadaja"
          label="Odaberi događaj"
          :options="dogadaji"
          emit-value
          map-options
          :rules="[val => !!val || 'Događaj je obavezan']"
        />

        <q-select
          v-model="Usluga_ID"
          label="Odaberi uslugu"
          :options="usluge"
          emit-value
          map-options
          :rules="[val => !!val || 'Usluga je obavezna']"
        />

        <q-input
          v-model="Napomena"
          label="Napomena"
          type="text"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Spremi" color="primary" @click="dodajRezervaciju" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  name: "UnosRezervacije",
  data() {
    return {
      Sifra_klijenta: null,
      Sifra_dogadaja: null,
      Usluga_ID: null,
      Napomena: "",
      klijenti: [],
      dogadaji: [],
      usluge: []
    };
  },
  mounted() {
    this.ucitajDropdownove();
  },
  methods: {
    async ucitajDropdownove() {
      try {
        const [klijentiRes, dogadajiRes, uslugeRes] = await Promise.all([
          axios.get("http://localhost:3000/api/klijenti2"),
          axios.get("http://localhost:3000/api/dogadaji2"),
          axios.get("http://localhost:3000/api/usluge2")
        ]);

        this.klijenti = klijentiRes.data.map(v => ({ label: v, value: v }));
        this.dogadaji = dogadajiRes.data.map(v => ({ label: v, value: v }));
        this.usluge = uslugeRes.data.map(v => ({ label: v, value: v }));
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Greška pri učitavanju dropdownova" });
      }
    },

    async dodajRezervaciju() {
      if (!this.Sifra_klijenta || !this.Sifra_dogadaja || !this.Usluga_ID) {
        this.$q.notify({ type: "negative", message: "Popunite obavezna polja!" });
        return;
      }

      try {
        const res = await axios.post("http://localhost:3000/api/rezervacije", {
          Sifra_klijenta: this.Sifra_klijenta,
          Sifra_dogadaja: this.Sifra_dogadaja,
          Usluga_ID: this.Usluga_ID,
          Napomena: this.Napomena
        });

        this.$q.notify({
          type: "positive",
          message: `Rezervacija dodana! ID: ${res.data.id}`
        });

        this.Sifra_klijenta = null;
        this.Sifra_dogadaja = null;
        this.Usluga_ID = null;
        this.Napomena = "";
      } catch (err) {
        console.error(err);
        this.$q.notify({
          type: "negative",
          message: "Greška pri unosu rezervacije"
        });
      }
    }
  }
};
</script>