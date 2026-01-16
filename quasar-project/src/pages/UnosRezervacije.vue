<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Unos nove rezervacije</div>
      </q-card-section>

      <q-card-section>
        <!-- Dropdown klijent -->
        <q-select
          v-model="Sifra_klijenta"
          label="Odaberi klijenta"
          :options="klijenti"
          emit-value
          map-options
          :rules="[val => !!val || 'Klijent je obavezan']"
        />

        <!-- Dropdown događaj -->
        <q-select
          v-model="Sifra_dogadaja"
          label="Odaberi događaj"
          :options="dogadaji"
          emit-value
          map-options
          :rules="[val => !!val || 'Događaj je obavezan']"
        />

        <!-- Dropdown usluga -->
        <q-select
          v-model="Usluga_ID"
          label="Odaberi uslugu"
          :options="usluge"
          emit-value
          map-options
          :rules="[val => !!val || 'Usluga je obavezna']"
        />

        <!-- Napomena -->
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
          axios.get("http://localhost:3000/api/klijenti"),
          axios.get("http://localhost:3000/api/dogadaji"),
          axios.get("http://localhost:3000/api/usluge")
        ]);

        // Dropdown opcije su sada samo brojevi
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

        // reset polja
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
