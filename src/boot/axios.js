import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import serviceUser from 'src/services/user'
import { useUserStore } from 'src/stores/user'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

apiAuth.interceptors.request.use((config) => {
  const user = useUserStore()
  config.headers.Authorization = `Bearer ${user.token}`
  return config
})

apiAuth.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response && error.config.url !== '/user/refresh' && error.response.status === 401) {
      const user = useUserStore()
      try {
        const { data } = await serviceUser.refresh()
        user.token = data.result.token
        error.config.headers.Authorization = `Bearer ${user.token}`
        return apiAuth(error.config)
      } catch {
        user.logout()
      }
    }
    throw error
  },
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  app.config.globalProperties.$apiAuth = apiAuth
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, apiAuth }
