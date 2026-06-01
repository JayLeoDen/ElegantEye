import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHashHistory, createWebHistory } from 'vue-router'
import routes from './routes'
import { getUser, homeForRole } from 'src/services/auth'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to) => {
    const user = getUser()
    if (to.meta.requiresAuth && !user) return '/auth'
    if (to.meta.role && user?.uloga !== to.meta.role) return homeForRole(user?.uloga)
  })

  return Router
})
