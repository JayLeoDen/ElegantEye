<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Unos nove rezervacije</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model.number="Sifra_rezervacije"
          label="Šifra rezervacije"
          type="number"
          :rules="[val => !!val || 'Šifra rezervacije je obavezna']"
        />
        <q-input
          v-model.number="Sifra_klijenta"
          label="Šifra klijenta"
          type="number"
          :rules="[val => !!val || 'Šifra klijenta je obavezna']"
        />
        <q-input
          v-model.number="Sifra_dogadaja"
          label="Šifra događaja"
          type="number"
          :rules="[val => !!val || 'Šifra događaja je obavezna']"
        />
        <q-input
          v-model.number="Usluga_ID"
          label="Usluga_ID"
          type="number"
          :rules="[val => !!val || 'Usluga_ID je obavezna']"
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
      Sifra_rezervacije: null,
      Sifra_klijenta: null,
      Sifra_dogadaja: null,
      Usluga_ID: null,
      Napomena: ""
    };
  },
  methods: {
    async dodajRezervaciju() {
      if (
        this.Sifra_rezervacije == null ||
        this.Sifra_klijenta == null ||
        this.Sifra_dogadaja == null ||
        this.Usluga_ID == null
      ) {
        this.$q.notify({
          type: "negative",
          message: "Obavezna polja: šifra rezervacije, klijenta, događaja i usluga"
        });
        return;
      }

      try {
        const res = await axios.post("http://localhost:3000/api/rezervacije", {
          Sifra_rezervacije: Number(this.Sifra_rezervacije),
          Sifra_klijenta: Number(this.Sifra_klijenta),
          Sifra_dogadaja: Number(this.Sifra_dogadaja),
          Usluga_ID: Number(this.Usluga_ID),
          Napomena: this.Napomena
        });

        this.$q.notify({
          type: "positive",
          message: "Rezervacija dodana! ID: " + res.data.id
        });

        this.Sifra_rezervacije = null;
        this.Sifra_klijenta = null;
        this.Sifra_dogadaja = null;
        this.Usluga_ID = null;
        this.Napomena = "";
      } catch (err) {
        console.error(err);
        this.$q.notify({
          type: "negative",
          message: "Greška pri unosu rezervacije: " + (err.response?.data?.error || err.message)
        });
      }
    }
  }
};
</script>
