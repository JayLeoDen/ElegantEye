<template>
  <div class="ee-page">
    <div class="mock-title">Pomoć i FAQ</div>

    <section class="mock-window">
      <div class="mock-bar">
        <span class="mock-dot" />
        <span class="mock-dot" />
        <span class="mock-dot" />
        <span class="mock-bar-label">Korisnički priručnik — ElegantEye</span>
      </div>

      <div class="mock-content">

        <div class="top-actions q-mb-lg">
          <q-btn
            label="Preuzmi PDF priručnik"
            icon="picture_as_pdf"
            color="primary"
            outline
            no-caps
            class="action-btn"
            @click="downloadPdf"
          />
          <q-btn
            label="Otvori u pregledniku"
            icon="open_in_new"
            color="teal"
            outline
            no-caps
            class="action-btn"
            @click="openPdf"
          />
        </div>

        <div class="pdf-wrapper q-mb-xl">
          <iframe
            :src="pdfSrc"
            class="pdf-frame"
            title="ElegantEye korisnički priručnik"
          />
        </div>

        <div class="faq-header q-mb-md">
          <q-icon name="quiz" color="primary" size="22px" class="q-mr-sm" />
          <span>Često postavljena pitanja</span>
        </div>

        <div
          v-for="section in faqSections"
          :key="section.title"
          class="q-mb-md"
        >
          <div class="faq-section-title q-mb-sm">{{ section.title }}</div>

          <q-expansion-item
            v-for="item in section.items"
            :key="item.q"
            :label="item.q"
            dense
            expand-separator
            class="faq-item q-mb-xs"
            header-class="faq-question"
          >
            <q-card flat>
              <q-card-section class="faq-answer">
                {{ item.a }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>

        <div class="contact-box q-mt-xl">
          <q-icon name="support_agent" color="teal" size="20px" class="q-mr-sm" />
          <span>
            Niste pronašli odgovor?
            <span v-if="isAdmin">
              Koristite
              <router-link to="/admin/specijalne-funkcije" class="contact-link">
                Slanje obavijesti
              </router-link>
              za kontakt s timom podrške.
            </span>
            <span v-else>
              Kontaktirajte administratora sustava.
            </span>
          </span>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getUser } from 'src/services/auth'

const PDF_PATH = '/help/ElegantEye_Pomoc.pdf'

const pdfSrc = computed(() => PDF_PATH + '#toolbar=1&navpanes=0&scrollbar=1')

const user   = getUser()
const isAdmin = computed(() => user?.uloga === 'admin')

function downloadPdf () {
  const a = document.createElement('a')
  a.href = PDF_PATH
  a.download = 'ElegantEye_Pomoc.pdf'
  a.click()
}

function openPdf () {
  window.open(PDF_PATH, '_blank')
}

const faqSections = [
  {
    title: 'Registracija i prijava',
    items: [
      {
        q: 'Zaboravio/la sam lozinku. Što da radim?',
        a: 'Kontaktirajte administratora sustava koji vam može resetirati lozinku.'
      },
      {
        q: 'Mogu li imati isti e-mail za klijentski i fotografski račun?',
        a: 'Ne. Svaki e-mail može biti vezan uz samo jedan korisnički račun u sustavu.'
      },
      {
        q: 'Kako mogu promijeniti svoje podatke?',
        a: 'Administrator sustava može promijeniti vaše podatke putem administratorskog panela.'
      }
    ]
  },
  {
    title: 'Rezervacije',
    items: [
      {
        q: 'Kako mogu otkazati rezervaciju?',
        a: 'Otvorite "Moje rezervacije", odaberite rezervaciju i kontaktirajte fotografa ili administratora za otkazivanje.'
      },
      {
        q: 'Što znači status "na čekanju"?',
        a: 'Vaša rezervacija je uspješno kreirana i čeka potvrdu fotografa/snimatelja.'
      },
      {
        q: 'Što se događa ako fotograf odbije moju rezervaciju?',
        a: 'Status rezervacije bit će promijenjen u "odbijena". Možete kreirati novu rezervaciju s drugim fotografom ili terminom.'
      },
      {
        q: 'Mogu li promijeniti datum ili lokaciju rezervacije?',
        a: 'Za izmjenu već kreirane rezervacije kontaktirajte administratora sustava ili fotografa putem napomena uz rezervaciju.'
      }
    ]
  },
  {
    title: 'Usluge i portfolio',
    items: [
      {
        q: 'Kako mogu vidjeti primjere radova fotografa?',
        a: 'Na profilnoj stranici fotografa dostupan je cijeli portfolio s primjerima radova.'
      },
      {
        q: 'Mogu li ostaviti recenziju nakon obavljene usluge?',
        a: 'Da. Nakon što je rezervacija označena kao završena, pojavit će se mogućnost ostavljanja ocjene i recenzije.'
      }
    ]
  },
  {
    title: 'Za fotografe i snimatelje',
    items: [
      {
        q: 'Kako označiti da nisam dostupan određenog datuma?',
        a: 'U svom korisničkom sučelju idite na Dostupnost i unesite datume kad niste slobodni.'
      },
      {
        q: 'Kako upravljati portfoliom?',
        a: 'U sekciji Portfolio možete dodavati, uređivati i brisati radove. Preporučujemo redovito ažuriranje.'
      }
    ]
  },
  {
    title: 'Tehnička pitanja',
    items: [
      {
        q: 'Koji preglednici su podržani?',
        a: 'Aplikacija radi na svim modernim preglednicima: Chrome, Firefox, Edge i Safari.'
      },
      {
        q: 'Je li aplikacija dostupna na mobitelu?',
        a: 'Da, aplikacija je prilagođena za korištenje na mobilnim uređajima i tabletima.'
      },
      {
        q: 'Što da radim ako se stranica ne učitava ispravno?',
        a: 'Pokušajte osvježiti stranicu (F5). Ako problem ostaje, očistite predmemoriju preglednika ili kontaktirajte administratora.'
      }
    ]
  }
]
</script>

<style scoped>
.mock-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.mock-window {
  max-width: 860px;
  margin: 0 auto;
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
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
  flex-shrink: 0;
}

.mock-bar-label {
  margin-left: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #555;
}

.mock-content {
  padding: 24px 22px 32px;
}

.top-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  border-radius: 20px;
}

.pdf-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.pdf-frame {
  width: 100%;
  height: 640px;
  border: none;
  display: block;
}

.faq-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.faq-section-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #fff;
  background: #00897B;
  padding: 5px 12px;
  border-radius: 4px;
  display: inline-block;
}

.faq-item {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}

.faq-item :deep(.faq-question) {
  background: #E3F0FC;
  font-weight: 600;
  font-size: 14px;
  color: #1565C0;
  min-height: 44px;
}

.faq-answer {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  background: #fafafa;
  padding: 12px 16px;
}

.contact-box {
  display: flex;
  align-items: center;
  background: #F0FDF4;
  border: 1px solid #A7F3D0;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
}

.contact-link {
  color: #00897B;
  font-weight: 600;
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
}
</style>