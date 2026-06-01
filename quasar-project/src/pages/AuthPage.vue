<template>
  <q-page class="ee-page">
    <div class="mock-title">2. Prozor za prijavu i registraciju</div>
    <section class="mock-window">
      <div class="mock-bar"><span class="mock-dot"/><span class="mock-dot"/><span class="mock-dot"/> <span class="q-ml-md">Prijava / Registracija</span></div>
      <div class="mock-content">
        <q-card flat bordered class="q-pa-md q-mb-md">
          <div class="text-weight-bold q-mb-sm">Prijava</div>
          <q-form @submit="login">
            <q-input outlined dense v-model="loginForm.email" label="E-mail adresa" class="q-mb-sm" />
            <q-input outlined dense v-model="loginForm.lozinka" type="password" label="Lozinka" class="q-mb-sm" />
            <q-btn color="primary" outline label="Prijavi se" type="submit" :loading="loading" />
          </q-form>
        </q-card>
        <q-card flat bordered class="q-pa-md">
          <div class="text-weight-bold q-mb-sm">Registracija</div>
          <q-form @submit="register">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6"><q-input outlined dense v-model="reg.ime" label="Ime" /></div>
              <div class="col-12 col-md-6"><q-input outlined dense v-model="reg.prezime" label="Prezime" /></div>
              <div class="col-12"><q-input outlined dense v-model="reg.email" label="E-mail adresa" /></div>
              <div class="col-12"><q-input outlined dense type="password" v-model="reg.lozinka" label="Lozinka" /></div>
              <div class="col-12"><q-select outlined dense v-model="reg.uloga" :options="roles" label="Uloga: klijent / fotograf / snimatelj" /></div>
              <div class="col-12" v-if="reg.uloga === 'fotograf'"><q-input outlined dense v-model="reg.opis_rada" label="Opis rada" /></div>
            </div>
            <q-btn color="green" outline label="Registriraj se" type="submit" class="q-mt-md" :loading="loading" />
          </q-form>
        </q-card>
      </div>
    </section>
  </q-page>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { homeForRole, setUser } from 'src/services/auth'
const $q = useQuasar(); const router = useRouter(); const loading = ref(false)
const loginForm = reactive({ email: '', lozinka: '' })
const reg = reactive({ ime: '', prezime: '', email: '', lozinka: '', uloga: 'korisnik', opis_rada: '' })
const roles = [{ label: 'Klijent', value: 'korisnik' }, { label: 'Fotograf / snimatelj', value: 'fotograf' }]
async function login () {
  loading.value = true
  try { const { data } = await api.post('/auth/login', loginForm); setUser(data); router.push(homeForRole(data.user.uloga)) }
  catch (e) { $q.notify({ type: 'negative', message: e.response?.data?.error || e.response?.data?.message || 'Greška kod prijave' }) }
  finally { loading.value = false }
}
async function register () {
  loading.value = true
  try { await api.post('/auth/register', { ...reg, uloga: reg.uloga?.value || reg.uloga }); $q.notify({ type: 'positive', message: 'Registracija uspješna. Sada se prijavi.' }) }
  catch (e) { $q.notify({ type: 'negative', message: e.response?.data?.error || 'Greška kod registracije' }) }
  finally { loading.value = false }
}
</script>
