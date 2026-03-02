import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const _id = ref('')
    const account = ref('')
    const role = ref('employee')
    const name = ref('')
    const token = ref('')
    const department = ref('')
    const email = ref('')
    const onboardDate = ref(null)
    const work = ref({})
    const leaveQuota = ref({
      annual: 0,
      sick: 0,
      personal: 0,
      compLeave: 0,
    })
    const isLoggedIn = computed(() => token.value.length > 0)
    const isAdmin = computed(() => role.value === 'admin')

    const login = (data) => {
      _id.value = data._id
      account.value = data.account
      role.value = data.role
      name.value = data.name
      department.value = data.department
      email.value = data.email
      onboardDate.value = data.onboardDate
      work.value = data.work
      leaveQuota.value = data.leaveQuota || {
        annual: 0,
        sick: 0,
        personal: 0,
        compLeave: 0,
      }

      if (data.token) {
        token.value = data.token
      }
    }

    const logout = () => {
      _id.value = ''
      account.value = ''
      role.value = 'employee'
      token.value = ''
      name.value = ''
      department.value = ''
      email.value = ''
      onboardDate.value = null
      work.value = {}
      leaveQuota.value = {
        annual: 0,
        sick: 0,
        personal: 0,
        compLeave: 0,
      }
    }

    return {
      _id,
      account,
      role,
      name,
      token,
      department,
      email,
      onboardDate,
      work,
      leaveQuota,
      isLoggedIn,
      isAdmin,
      login,
      logout,
    }
  },
  {
    persist: {
      key: 'user',
      pick: ['token'],
    },
  },
)
