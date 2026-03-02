import { apiAuth } from 'boot/axios'

export default {
  create: (form) => {
    return apiAuth.post('/leaveRequest', form)
  },
  getAllLeaveRequest: () => {
    return apiAuth.get('/leaveRequest/all')
  },
  getMyLeaveRequest: () => {
    return apiAuth.get('/leaveRequest/my')
  },
  updateStatus: (id, status, comment) => {
    return apiAuth.patch(`/leaveRequest/${id}`, { status, comment })
  },
}
