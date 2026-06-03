<template>
  <div class="ee-page">
    <div class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-bar-title">Administratorski panel</span>
      </div>

      <div class="mock-content">

        <div class="nav-box q-mb-lg">
          <q-item
            v-for="item in navItems"
            :key="item.label"
            clickable
            v-ripple
            class="nav-item"
            :to="item.route"
          >
            <q-item-section class="nav-label">{{ item.label }}</q-item-section>
          </q-item>
        </div>

        <div class="stats-box q-mb-xs">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-row"
          >
            <template v-if="loading">
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-value text-grey-5">...</div>
            </template>
            <template v-else>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-value">{{ stat.value }}</div>
            </template>
          </div>
        </div>

        <div class="stat-row brze-radnje-row">
          <div class="stat-label q-mb-sm">Brze radnje</div>
          <div class="row q-gutter-sm">
            <q-btn
              label="Upravljanje podacima"
              outline
              color="primary"
              size="sm"
              no-caps
              class="brze-btn"
              to="/admin/upravljanje"
            />
            <q-btn
              label="Izvještaji"
              outline
              color="teal"
              size="sm"
              no-caps
              class="brze-btn"
              to="/admin/izvjestaji"
            />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

const loading = ref(true)

const navItems = [
  { label: 'Korisnici',           route: '/admin/korisnici' },
  { label: 'Usluge',              route: '/admin/usluge' },
  { label: 'Rezervacije',         route: '/admin/rezervacije' },
  { label: 'Fotografi',          route: '/admin/fotografi' },
  { label: 'Specijalne funkcije', route: '/admin/specijalne-funkcije' }
]

const stats = ref([
  { label: 'Ukupno korisnika',    value: '-' },
  { label: 'Aktivne rezervacije', value: '-' },
  { label: 'Aktivne usluge',      value: '-' }
])

onMounted(async () => {
  try {
    const { data } = await api.get('/reports/summary')
    stats.value = [
      { label: 'Ukupno korisnika',    value: data.korisnici   ?? '-' },
      { label: 'Aktivne rezervacije', value: data.rezervacije ?? '-' },
      { label: 'Aktivne usluge',      value: data.usluge      ?? '-' }
    ]
  } catch (err) {
    console.error('Greška pri dohvatu statistike:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.ee-page {
  padding: 32px 24px;
  max-width: 660px;
  margin: 0 auto;
}

.mock-window {
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.mock-bar {
  background: #f2f2f2;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mock-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cacaca;
  display: inline-block;
}

.mock-bar-title {
  margin-left: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #555;
}

.mock-content {
  padding: 20px 18px 24px;
}

.nav-box {
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  overflow: hidden;
}

.nav-item {
  border-bottom: 1px solid #ececec;
  min-height: 42px;
  padding: 8px 14px;
  transition: background 0.15s;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-item:hover {
  background: #f7f7f7;
}

.nav-label {
  font-size: 14px;
  color: #2c2c2c;
}

.stats-box {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.stat-row {
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 6px;
  background: #fdfdfd;
}

.stat-label {
  font-weight: 600;
  font-size: 13.5px;
  color: #1a1a1a;
  margin-bottom: 3px;
}

.stat-value {
  font-size: 15px;
  color: #444;
  font-weight: 400;
}

.brze-radnje-row {
  margin-bottom: 0;
}

.brze-btn {
  border-radius: 20px;
  padding: 4px 16px;
  font-size: 13px;
}
</style>