const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
               { path: '/unosrez', component: () => import('pages/UnosRezervacije.vue') },
               { path: '/popisrez', component: () => import('pages/PopisRezervacija.vue') }
    ],
  },

  
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
