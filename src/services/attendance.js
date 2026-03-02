import { apiAuth } from 'boot/axios'

export default {
  checkIn: () => {
    return apiAuth.post('/attendance/checkIn')
  },
  getAttendance: () => {
    return apiAuth.get('/attendance/attendance')
  },
  checkOut: () => {
    return apiAuth.patch('/attendance/checkOut')
  },
}
