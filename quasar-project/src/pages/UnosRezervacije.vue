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
        />

        <q-select
          v-model="dogadaj_id"
          label="Odaberi događaj"
          :options="dogadaji"
          emit-value
          map-options
        />

        <q-select
          v-model="usluga_id"
          label="Odaberi uslugu"
          :options="usluge"
          emit-value
          map-options
        />

        <q-select
          v-model="fotograf_snimatelj_id"
          label="Odaberi fotografa"
          :options="fotografi"
          emit-value
          map-options
        />

        <q-input
          v-model="datum_nove_rezervacije"
          label="Datum"
          type="date"
          :min="danas"
        />

        <q-input
          v-model="vrijeme_nove_rezervacije"
          label="Vrijeme"
          type="time"
          :min="danas"
        />

        <q-input
          v-model="napomena_rezervacije"
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
      fotograf_snimatelj_id: null,

      datum_nove_rezervacije: "",
      vrijeme_nove_rezervacije: "",
      napomena_rezervacije: "",
      
      danas: new Date().toISOString().split("T")[0],

      klijenti: [],
      dogadaji: [],
      usluge: [],
      fotografi: []
    };
  },

  mounted() {
    this.ucitajDropdownove();
  },

  methods: {
    async ucitajDropdownove() {
      try {
        const [
          klijentiRes,
          dogadajiRes,
          uslugeRes,
          fotografiRes
        ] = await Promise.all([
          axios.get("http://localhost:3000/api/klijenti2"),
          axios.get("http://localhost:3000/api/dogadaji2"),
          axios.get("http://localhost:3000/api/usluge2"),
          axios.get("http://localhost:3000/api/fotografi")
        ]);

        this.klijenti = klijentiRes.data.map(k => ({
          label: `${k.ime_korisnika} ${k.prezime_korisnika}`,
          value: k.korisnik_id
        }));

        this.dogadaji = dogadajiRes.data.map(d => ({
          label: d.opis_dogadaja,
          value: d.dogadaj_id
        }));

        this.usluge = uslugeRes.data.map(u => ({
          label: u.naziv_nove_usluge,
          value: u.usluga_id
        }));

        this.fotografi = fotografiRes.data.map(f => ({
          label: `${f.ime_fotografa_snimatelja} ${f.prezime_fotografa_snimatelja}`,
          value: f.fotograf_snimatelj_id
        }));

      } catch (err) {
        console.error(err);
        this.$q.notify({
          type: "negative",
          message: "Greška pri učitavanju dropdownova"
        });
      }
    },

    async dodajRezervaciju() {
      if (
        !this.korisnik_id ||
        !this.dogadaj_id ||
        !this.usluga_id ||
        !this.fotograf_snimatelj_id ||
        !this.datum_nove_rezervacije ||
        !this.vrijeme_nove_rezervacije
      ) {
        this.$q.notify({
          type: "negative",
          message: "Popunite sva obavezna polja!"
        });
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:3000/api/rezervacije",
          {
            korisnik_id: this.korisnik_id,
            dogadaj_id: this.dogadaj_id,
            usluga_id: this.usluga_id,
            fotograf_snimatelj_id: this.fotograf_snimatelj_id,
            datum_nove_rezervacije: this.datum_nove_rezervacije,
            vrijeme_nove_rezervacije: this.vrijeme_nove_rezervacije,
            napomena_rezervacije: this.napomena_rezervacije
          }
        );

        this.$q.notify({
          type: "positive",
          message: `Rezervacija dodana! ID: ${res.data.id}`
        });

        this.korisnik_id = null;
        this.dogadaj_id = null;
        this.usluga_id = null;
        this.fotograf_snimatelj_id = null;
        this.datum_nove_rezervacije = "";
        this.vrijeme_nove_rezervacije = "";
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