const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'maturalne', component: () => import('pages/MaturalneDetalji.vue') },
      { path: 'vjencanja', component: () => import('pages/VjencanjaDetalji.vue') },
      { path: 'rodendani', component: () => import('pages/RodendaniDetalji.vue') },
      { path: 'dogadaji', component: () => import('pages/DogadajiDetalji.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
