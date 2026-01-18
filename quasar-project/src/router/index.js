import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes
  })

  Router.beforeEach((to, from, next) => {
    const tokenStr = localStorage.getItem('token')
    const token = tokenStr ? JSON.parse(tokenStr) : null

    if (to.meta.requiresAuth) {
      if (!token) {
        return next('/login')
      }

      if (to.meta.role && token.uloga !== to.meta.role) {
        if (token.uloga === 'admin') return next('/admin')
        if (token.uloga === 'korisnik') return next('/user')
        return next('/login')
      }
    }

    next()
  })

  return Router
})