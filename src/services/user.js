import { api, apiAuth } from 'boot/axios'

export default {
  create: (data) => {
    return apiAuth.post('/user', data)
  },
  login: (data) => {
    return api.post('/user/login', data)
  },
  profile: () => {
    return apiAuth.get('/user/profile')
  },
  getUser: () => {
    return apiAuth.get('/user/getUser')
  },
  refresh: () => {
    return apiAuth.patch('/user/refresh')
  },
  updateUser: (id, data) => {
    return apiAuth.patch(`/user/updateUser/${id}`, data)
  },
  logout: () => {
    return apiAuth.delete('/user/logout')
  },
}
