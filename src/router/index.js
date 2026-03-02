import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import serviceUser from 'src/services/user'
import { useUserStore } from 'src/stores/user'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.BASE_URL),
  })
  Router.beforeEach(async (to) => {
    const user = useUserStore()

    if (user.isLoggedIn && user.account.length === 0) {
      try {
        const { data } = await serviceUser.profile()
        user.login(data.result)
      } catch (error) {
        console.log(error)
        user.logout()
      }
    }

    if (to.meta.login === 'no-login-only' && user.isLoggedIn) {
      return '/attendance'
    } else if (to.meta.login === 'login-only' && !user.isLoggedIn) {
      return '/'
    } else if (to.meta.admin && !user.isAdmin) {
      return '/'
    }
  })

  Router.afterEach((to) => {
    document.title = `出勤管理系統 | ${to.meta.title}`
  })

  return Router
})
