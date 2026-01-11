const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'registracija', component: () => import('pages/RegistracijaPage.vue') },
      { path: 'popisfoto', component: () => import('pages/PopisFotografa.vue') }
    ]
  },

  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    meta: { requiresAuth: true, role: 'korisnik' },
    children: [
      { path: 'popisfoto', component: () => import('pages/PopisFotografa.vue') }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'popisfoto', component: () => import('pages/PopisFotografa.vue') },
      { path: 'unosfoto', component: () => import('pages/UnosFotografa.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
