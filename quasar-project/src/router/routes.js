const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LandingPage.vue') },
      { path: 'auth', component: () => import('pages/AuthPage.vue') },
      { path: 'usluge', component: () => import('pages/ServicesPage.vue') },
      { path: 'usluge/:id', component: () => import('pages/ServiceDetailsPage.vue') }
    ]
  },
  {
    path: '/korisnik',
    component: () => import('layouts/AppLayout.vue'),
    meta: { requiresAuth: true, role: 'korisnik' },
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'usluge', component: () => import('pages/ServicesPage.vue') },
      { path: 'rezervacija', component: () => import('pages/user/ReservationPage.vue') },
      { path: 'rezervacije', component: () => import('pages/user/MyReservationsPage.vue') },
      { path: 'profil', component: () => import('pages/user/ProfilePage.vue') },
      { path: 'pomoc', component: () => import('pages/HelpPage.vue') }
    ]
  },
  {
    path: '/fotograf',
    component: () => import('layouts/AppLayout.vue'),
    meta: { requiresAuth: true, role: 'fotograf' },
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'portfolio', component: () => import('pages/photographer/PortfolioPage.vue') },
      { path: 'rezervacije', component: () => import('pages/photographer/PhotographerReservationsPage.vue') },
      { path: 'dostupnost', component: () => import('pages/photographer/AvailabilityPage.vue') },
      { path: 'profil', component: () => import('pages/photographer/ProfilePage.vue') },
      { path: 'pomoc', component: () => import('pages/HelpPage.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AppLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', component: () => import('pages/admin/DashboardPage.vue') },
      { path: 'korisnici', component: () => import('pages/admin/CrudPage.vue'), meta: { crudType: 'korisnici' } },
      { path: 'fotografi', component: () => import('pages/admin/CrudPage.vue'), meta: { crudType: 'fotografi' } },
      { path: 'usluge', component: () => import('pages/admin/CrudPage.vue'), meta: { crudType: 'usluge' } },
      { path: 'rezervacije', component: () => import('pages/admin/ReservationsAdminPage.vue') },
      { path: 'izvjestaji', component: () => import('pages/admin/ReportsPage.vue') },
      { path: 'upravljanje', component: () => import('pages/admin/ManagementPage.vue') },
      { path: 'specijalne-funkcije', component: () => import('pages/admin/SpecialFunctionsPage.vue') },
      { path: 'pomoc', component: () => import('pages/HelpPage.vue') }
    ]
  },
  {path: '/pomoc',component: () => import('pages/HelpPage.vue')},
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
]

export default routes
