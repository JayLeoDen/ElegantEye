<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Unos nove rezervacije</div>
      </q-card-section>

      <q-card-section>
        <q-select
          v-model="korisnik_id"
          label="Odaberi korisnika"
          :options="klijenti"
          emit-value
          map-options
          :rules="[val => !!val || 'Korisnik je obavezan']"
        />

        <q-select
          v-model="dogadaj_id"
          label="Odaberi događaj"
          :options="dogadaji"
          emit-value
          map-options
          :rules="[val => !!val || 'Događaj je obavezan']"
        />

        <q-select
          v-model="usluga_id"
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
      korisnik_id: null,
      dogadaj_id: null,
      usluga_id: null,
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

        this.klijenti = klijentiRes.data.map(v => ({ label: v, value: v }));
        this.dogadaji = dogadajiRes.data.map(v => ({ label: v, value: v }));
        this.usluge = uslugeRes.data.map(v => ({ label: v, value: v }));
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Greška pri učitavanju dropdownova" });
      }
    },

    async dodajRezervaciju() {
      if (!this.korisnik_id || !this.dogadaj_id || !this.usluga_id) {
        this.$q.notify({ type: "negative", message: "Popunite obavezna polja!" });
        return;
      }

      try {
        const res = await axios.post("http://localhost:3000/api/rezervacije", {
          korisnik_id: this.korisnik_id,
          dogadaj_id: this.dogadaj_id,
          usluga_id: this.usluga_id,
          napomena_rezervacije: this.napomena_rezervacije
        });

        this.$q.notify({
          type: "positive",
          message: `Rezervacija dodana! ID: ${res.data.id}`
        });

        this.korisnik_id = null;
        this.dogadaj_id = null;
        this.usluga_id = null;
        this.napomena_rezervacije = "";
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
