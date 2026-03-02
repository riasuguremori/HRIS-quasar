<template>
  <q-page class="q-pa-xl bg-grey-1 text-dark" style="max-width: 1400px; margin: 0 auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none q-mb-xs">人員管理</h1>
        <div class="text-grey-6 text-body1">管理與編輯系統內所有人員資料</div>
      </div>
    </div>

    <q-card flat bordered class="rounded-xl q-mb-xl bg-white">
      <div class="row items-center justify-between q-pa-md border-bottom bg-white rounded-top-xl">
        <q-input
          v-model="filter"
          dense
          outlined
          debounce="500"
          placeholder="搜尋姓名、信箱或部門..."
          class="col-12 col-md-5 bg-grey-1 search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" size="sm" class="text-grey-5" />
          </template>
        </q-input>
      </div>

      <q-table
        :rows="users"
        :columns="columns"
        row-key="_id"
        flat
        :filter="filter"
        class="header-transparent text-body1"
        :loading="loading"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-grey-8 text-weight-bold q-py-md"
              :class="`text-${col.align}`"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center">
              <span class="text-weight-bold">{{ props.row.name }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-department="props">
          <q-td :props="props" class="text-grey-8">
            <q-badge
              color="grey-2"
              text-color="grey-8"
              class="q-px-sm py-xs text-weight-medium rounded-borders"
            >
              {{ props.row.department || '未指派' }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="primary"
              class="hover-bg"
              @click="openDialog(props.row)"
            >
              <q-tooltip>編輯</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialog.open" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 600px; max-width: 90vw" class="rounded-xl q-pa-sm">
        <q-form @submit.prevent="submit">
          <q-card-section class="row items-center justify-between border-bottom q-pb-md">
            <div class="text-h6 text-weight-bold">
              {{ '編輯資料' }}
            </div>
            <q-btn icon="close" flat round dense v-close-popup class="text-grey-7" />
          </q-card-section>

          <q-card-section class="q-gutter-y-md q-pt-lg">
            <q-input
              outlined
              v-model="form.name"
              label="姓名"
              :rules="[(val) => !!val || '請輸入姓名']"
            />
            <q-input
              outlined
              v-model="form.email"
              label="信箱"
              :rules="[(val) => !!val || '請輸入信箱']"
            />
            <q-input
              outlined
              v-model="form.department"
              label="部門"
              :rules="[(val) => !!val || '請輸入部門']"
            />
            <q-input
              outlined
              v-model="form.onboardDate"
              label="到職日"
              :rules="[(val) => !!val || '請選擇到職日期']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer text-primary">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.onboardDate" mask="YYYY-MM-DD" color="primary">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="確定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-select
              outlined
              v-model="form.role"
              :options="['employee', 'manager']"
              label="身份"
              emit-value
              map-options
              :rules="[(val) => !!val || '請選擇身份']"
            />

            <div class="row q-col-gutter-x-md">
              <q-input
                outlined
                v-model="form.work.workStartTime"
                label="上班時間"
                mask="time"
                :rules="['time']"
                class="col-6"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer text-primary">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.work.workStartTime" color="primary">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="確定" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                outlined
                v-model="form.work.workEndTime"
                label="下班時間"
                mask="time"
                :rules="['time']"
                class="col-6"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer text-primary">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.work.workEndTime" color="primary">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="確定" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md border-top">
            <q-btn
              flat
              label="取消"
              color="grey-8"
              @click="closeDialog"
              :disable="loading"
              class="rounded-borders q-px-md"
            />
            <q-btn
              type="submit"
              label="儲存"
              color="primary"
              class="rounded-borders q-px-md text-weight-bold"
              :loading="loading"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar, date } from 'quasar'
import serviceUser from 'src/services/user'

const $q = useQuasar()
const users = ref([])
const filter = ref('')
const loading = ref(false)

const dialog = ref({
  open: false,
  id: '',
})

const getEmptyForm = () => ({
  name: '',
  email: '',
  department: '',
  onboardDate: '',
  role: '',
  work: {
    workStartTime: '09:00',
    workEndTime: '18:00',
  },
})

const form = ref(getEmptyForm())

const columns = [
  { name: 'name', label: '姓名', field: 'name', align: 'left', sortable: true },
  {
    name: 'email',
    label: '信箱',
    field: 'email',
    align: 'left',
    sortable: true,
    classes: 'text-grey-7',
  },
  { name: 'department', label: '部門', field: 'department', align: 'left', sortable: true },
  {
    name: 'onboardDate',
    label: '到職日',
    field: 'onboardDate',
    format: (val) => date.formatDate(val, 'YYYY-MM-DD'),
    align: 'left',
    sortable: true,
    classes: 'text-grey-7',
  },
  { name: 'role', label: '身份', field: 'role', align: 'left', sortable: true },
  { name: 'actions', label: '操作', align: 'left' },
]

const getUsers = async () => {
  try {
    loading.value = true
    const { data } = await serviceUser.getUser()
    users.value = data.result
  } catch {
    $q.notify({ message: '取得人員失敗', color: 'negative' })
  } finally {
    loading.value = false
  }
}
getUsers()

const openDialog = (user) => {
  dialog.value.open = true
  if (user) {
    dialog.value.id = user._id

    const tempForm = JSON.parse(JSON.stringify(user))
    if (tempForm.onboardDate) {
      tempForm.onboardDate = date.formatDate(tempForm.onboardDate, 'YYYY-MM-DD')
    }

    form.value = {
      ...tempForm,
      work: tempForm.work || { workStartTime: '09:00', workEndTime: '18:00' },
    }
  } else {
    dialog.value.id = ''
    form.value = getEmptyForm()
  }
}

const closeDialog = () => {
  dialog.value.open = false
}

const submit = async () => {
  try {
    loading.value = true
    if (dialog.value.id) {
      await serviceUser.updateUser(dialog.value.id, form.value)
      $q.notify({ message: '更新成功', color: 'positive', icon: 'check_circle' })
    }
    closeDialog()
    getUsers()
  } catch (error) {
    console.log(error)
    const message = error?.response?.data?.message || '發生錯誤'
    $q.notify({ message, color: 'negative', icon: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 圓角與邊框 */
.rounded-xl {
  border-radius: 16px;
}
.rounded-top-xl {
  border-radius: 16px 16px 0 0;
}
.border-bottom {
  border-bottom: 1px solid #f0f0f0;
}
.border-top {
  border-top: 1px solid #f0f0f0;
}

/* 搜尋框去邊框設計 */
:deep(.search-input .q-field__control:before) {
  border-color: transparent !important;
}
:deep(.search-input .q-field__control) {
  background: #f4f5f7;
  border-radius: 8px;
}

:deep(.header-transparent thead tr th) {
  background: transparent !important;
  border-bottom: 1px solid #f0f0f0;
}
:deep(.q-table tbody td) {
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f8f8f8;
}

.hover-bg:hover {
  background: #f0f4ff;
}
</style>
