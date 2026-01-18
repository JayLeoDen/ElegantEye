const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'registracija', component: () => import('pages/RegistracijaPage.vue') },
      { path: 'popisfoto', component: () => import('pages/PopisFotografa.vue') },
      { path: 'Popisdogadaja', component: () => import('pages/DogadajList.vue') },
      { path: 'popisrez', component: () => import('pages/PopisRezervacija.vue') },
      { path: 'popisusluga', component: () => import('pages/PopisUsluga.vue') },
      { path: 'prikazkorisnika', component: () => import('pages/PrikazKorisnika.vue') }
    ]
  },

  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    meta: { requiresAuth: true, role: 'korisnik' },
    children: [
      { path: 'popisfoto', component: () => import('pages/PopisFotografa.vue') },
      { path: 'Popisdogadaja', component: () => import('pages/DogadajList.vue') },
      { path: 'popisrez', component: () => import('pages/PopisRezervacija.vue') },
      { path: 'popisusluga', component: () => import('pages/PopisUsluga.vue') },
      { path: 'prikazkorisnika', component: () => import('pages/PrikazKorisnika.vue') }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'popisfoto', component: () => import('pages/PopisFotografa.vue') },
      { path: 'unosfoto', component: () => import('pages/UnosFotografa.vue') },
      { path: 'potvrda', component: () => import('pages/PotvrdaRegistracije.vue')},
      { path: 'Popisdogadaja', component: () => import('pages/DogadajList.vue') },
      { path: 'Unosdogadaja', component: () => import('pages/DogadajUnos.vue') },
      { path: 'popisrez', component: () => import('pages/PopisRezervacija.vue') },
      { path: 'unosrez', component: () => import('pages/UnosRezervacije.vue') },
      { path: 'popisusluga', component: () => import('pages/PopisUsluga.vue') },
      { path: 'unosusluga', component: () => import('pages/UnosUsluge.vue') },
      { path: 'prikazkorisnika', component: () => import('pages/PrikazKorisnika.vue') },
      { path: 'unoskorisnika', component: () => import('pages/UnosKorisnika.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes