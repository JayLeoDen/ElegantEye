const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
               { path: '/registracija', component: () => import('src/pages/RegistracijaPage.vue') },
               { path: '/login', component: () => import('pages/LoginPage.vue') },
               { path: '/unosfoto', component: () => import('pages/UnosFotografa.vue') }
    ],
  },

  
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
