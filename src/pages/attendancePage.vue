<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-8">
        <q-card bordered flat class="full-height border-radius-lg">
          <div class="row full-height">
            <div
              class="col-12 col-sm-5 q-pa-xl column justify-center"
              style="border-right: 1px solid #f0f0f0"
            >
              <div
                class="text-h2 text-weight-bolder text-dark q-mb-sm"
                style="letter-spacing: -1.5px"
              >
                {{ date.formatDate(now, 'HH:mm:ss') }}
              </div>
              <q-btn
                :color="isClockedIn ? 'negative' : 'primary'"
                :icon-right="isClockedIn ? 'login' : 'logout'"
                :label="isClockedOutToday ? '已下班' : isClockedIn ? '下班打卡' : '上班打卡'"
                size="lg"
                class="full-width rounded-borders text-weight-bold shadow-2"
                no-caps
                @click="isClockedIn ? clockOut() : clockIn()"
                :loading="loading"
                :disable="isClockedOutToday"
              />
            </div>

            <div class="col-12 col-sm-7 q-pa-xl column justify-center">
              <div class="row items-center justify-between q-mb-lg">
                <div class="q-gutter-x-sm">
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="add_circle"
                    label="請假"
                    class="text-weight-bold"
                    @click="openLeaveDialog"
                  />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <div class="row items-center q-mb-lg">
                    <q-avatar
                      color="green-1"
                      text-color="positive"
                      icon="schedule"
                      rounded
                      class="q-mr-md"
                    />
                    <div>
                      <div class="text-caption text-grey-7 text-uppercase text-weight-bold">
                        上班
                      </div>
                      <div class="text-body1 text-weight-bold">
                        {{ user.work?.workStartTime || '09:00' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="row items-center q-mb-lg">
                    <q-avatar
                      color="green-1"
                      text-color="positive"
                      icon="schedule"
                      rounded
                      class="q-mr-md"
                    />
                    <div>
                      <div class="text-caption text-grey-7 text-uppercase text-weight-bold">
                        下班
                      </div>
                      <div class="text-body1 text-weight-bold">
                        {{ user.work?.workEndTime || '18:00' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator class="q-mb-lg" flat style="background: #f0f0f0" />

              <div class="row items-center justify-between q-mb-lg">
                <div class="q-gutter-x-sm">
                  <q-btn
                    v-if="user.isAdmin"
                    flat
                    dense
                    color="grey-7"
                    icon="edit"
                    label="編輯"
                    class="text-weight-bold"
                    @click="openQuotaDialog"
                  />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-6" v-for="(val, key) in quotaDisplay" :key="key">
                  <div class="row items-center q-mb-sm">
                    <q-avatar
                      :color="val.color + '-1'"
                      :text-color="val.color"
                      :icon="val.icon"
                      rounded
                      size="32px"
                      class="q-mr-sm"
                    />
                    <div>
                      <div
                        class="text-caption text-grey-6 text-weight-bold"
                        style="font-size: 10px"
                      >
                        {{ val.label }}
                      </div>
                      <div class="text-body2 text-weight-bold">{{ val.value }} 小時</div>
                      <div class="text-grey-5" style="font-size: 10px">{{ val.hint }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card bordered flat class="full-height border-radius-lg q-pa-lg">
          <div class="row justify-between items-center q-mb-lg">
            <div class="text-h6 text-weight-bold">{{ date.formatDate(calendarDate, 'MMM') }}</div>
            <q-badge color="grey-2" text-color="grey-8" class="text-weight-bold q-px-sm py-xs">
              {{ date.formatDate(calendarDate, 'YYYY') }}
            </q-badge>
          </div>

          <div class="row text-center text-grey-5 text-caption text-weight-bold q-mb-sm">
            <div class="col text-orange-4">日</div>
            <div class="col">一</div>
            <div class="col">二</div>
            <div class="col">三</div>
            <div class="col">四</div>
            <div class="col">五</div>
            <div class="col text-orange-4">六</div>
          </div>

          <div
            class="q-mb-md"
            style="
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 4px;
              text-align: center;
            "
          >
            <div v-for="(day, index) in calendar" :key="index">
              <q-avatar
                v-if="day.date"
                :color="day.color"
                :text-color="day.textColor"
                size="36px"
                class="text-weight-bold shadow-1-hover cursor-pointer"
                :class="{
                  'opacity-50': day.disabled,
                  'today-border': day.isToday,
                }"
              >
                {{ day.date }}
              </q-avatar>
              <div v-else style="height: 36px"></div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-body2">
            <div class="row items-center q-mb-sm">
              <q-badge
                rounded
                color="positive"
                class="q-mr-sm"
                size="xs"
                style="width: 8px; height: 8px"
              />
              <span class="text-grey-8">正常打卡</span>
            </div>
            <div class="row items-center q-mb-sm">
              <q-badge
                rounded
                color="orange"
                class="q-mr-sm"
                size="xs"
                style="width: 8px; height: 8px"
              />
              <span class="text-grey-8">遲到 / 早退</span>
            </div>
            <div class="row items-center q-mb-sm">
              <q-badge
                rounded
                color="negative"
                class="q-mr-sm"
                size="xs"
                style="width: 8px; height: 8px"
              />
              <span class="text-grey-8">曠職 / 缺勤</span>
            </div>
            <div class="row items-center">
              <q-badge
                rounded
                color="grey-2"
                class="q-mr-sm"
                size="xs"
                style="width: 8px; height: 8px"
              />
              <span class="text-grey-8">休假 / 週末</span>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-3" v-for="(stat, index) in stats" :key="index">
        <q-card bordered flat class="border-radius-lg q-pa-lg full-height">
          <div
            class="text-caption text-grey-7 text-uppercase text-weight-bold tracking-wide q-mb-sm"
          >
            {{ stat.title }}
          </div>
          <div class="text-h4 text-weight-bold q-mb-md">{{ stat.value }}</div>

          <template v-if="stat.type === 'progress'">
            <q-linear-progress
              :value="stat.progress"
              color="primary"
              size="6px"
              class="rounded-borders q-mb-sm"
            />
            <div class="text-caption text-grey-6">{{ stat.subtext }}</div>
          </template>

          <template v-else>
            <div
              class="text-caption row items-center text-weight-medium"
              :class="stat.subtextColor"
            >
              <q-icon :name="stat.icon" class="q-mr-xs" size="14px" v-if="stat.icon" />
              {{ stat.subtext }}
            </div>
          </template>
        </q-card>
      </div>
    </div>

    <q-card bordered flat class="border-radius-lg">
      <div class="row items-center justify-between q-pa-lg border-bottom">
        <div class="text-h6 text-weight-bold">打卡紀錄</div>
      </div>

      <q-table
        :rows="logs"
        :columns="columns"
        row-key="date"
        flat
        class="header-transparent text-body1"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-grey-6 text-weight-bold text-uppercase"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="
                props.row.status === '正常'
                  ? 'green-1'
                  : props.row.status === '曠職 / 缺勤'
                    ? 'red-1'
                    : 'orange-1'
              "
              :text-color="
                props.row.status === '正常'
                  ? 'positive'
                  : props.row.status === '曠職 / 缺勤'
                    ? 'negative'
                    : 'orange'
              "
              class="q-px-sm py-xs text-weight-bold"
            >
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-duration="props">
          <q-td :props="props" class="text-weight-bold">
            {{ props.row.duration }}
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="leaveDialog.show" persistent>
      <q-card style="min-width: 400px" class="q-pa-md border-radius-lg">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">請假</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitLeave" class="q-gutter-md">
            <q-select
              outlined
              v-model="leaveTypeVal"
              :options="['特休', '病假', '事假', '補休']"
              label="假別"
              :error="!!leaveTypeError"
              :error-message="leaveTypeError"
            />
            <q-input
              outlined
              v-model="dateVal"
              label="日期"
              type="date"
              :error="!!dateError"
              :error-message="dateError"
            />
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  outlined
                  v-model="startTimeVal"
                  label="開始時間"
                  type="time"
                  :error="!!startTimeError"
                  :error-message="startTimeError"
                  @update:model-value="calculateHours"
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  v-model="endTimeVal"
                  label="結束時間"
                  type="time"
                  :error="!!endTimeError"
                  :error-message="endTimeError"
                  @update:model-value="calculateHours"
                />
              </div>
            </div>
            <q-input
              outlined
              v-model="totalHoursVal"
              label="總時數"
              type="number"
              suffix="小時"
              readonly
              hint="根據起迄時間自動計算"
              :error="!!totalHoursError"
              :error-message="totalHoursError"
            />
            <q-input
              outlined
              v-model="commentVal"
              label="備註 / 原因"
              type="textarea"
              :error="!!commentError"
              :error-message="commentError"
            />

            <q-file
              outlined
              v-model="attachmentVal"
              label="上傳附件 (圖片或文件)"
              accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
              :error="!!attachmentError"
              :error-message="attachmentError"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <div class="row justify-end q-mt-lg">
              <q-btn flat label="取消" v-close-popup class="q-mr-sm" />
              <q-btn
                unelevated
                color="primary"
                label="申請"
                type="submit"
                :loading="isSubmitting"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="quotaDialog.show" persistent>
      <q-card style="min-width: 400px" class="q-pa-md border-radius-lg">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">編輯補休</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitQuota" class="q-gutter-md">
            <div class="text-caption text-grey-7 q-mb-sm">
              * 目前到職日：{{
                user.onboardDate ? date.formatDate(user.onboardDate, 'YYYY-MM-DD') : '未設定'
              }}<br />
              * 特休 (年資計算)、病假 (30天)、事假 (14天)。
            </div>

            <q-input
              v-model="compLeaveVal"
              label="補休天數"
              outlined
              suffix="天"
              hint="調整員工的補休總額"
              type="number"
              :error="!!compLeaveError"
              :error-message="compLeaveError"
            />

            <div class="row justify-end q-mt-lg">
              <q-btn flat label="取消" v-close-popup class="q-mr-sm" />
              <q-btn
                unelevated
                color="primary"
                label="儲存"
                type="submit"
                :loading="isQuotaSubmitting"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useQuasar, date } from 'quasar'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUserStore } from 'src/stores/user'
import serviceAttendance from 'src/services/attendance'
import serviceLeaveRequest from 'src/services/leaveRequest'
import serviceUser from 'src/services/user'
import axios from 'axios'
import { useLeaveCalculator } from 'src/composables/useLeaveCalculator'

const $q = useQuasar()
const user = useUserStore()
// 引入特休計算邏輯
const { calculateLegalAnnualLeave } = useLeaveCalculator()

const loading = ref(false)
const logs = ref([])
const isClockedIn = ref(false)
const isClockedOutToday = ref(false)
const holidays = ref([])
const now = ref(Date.now())
const calendarDate = ref(Date.now())
const myLeaveRequests = ref([])
let timer = null
const leaveDialog = ref({
  show: false,
})
const quotaDialog = ref({
  show: false,
})

const clockIn = async () => {
  try {
    loading.value = true
    await serviceAttendance.checkIn()
    $q.notify({ message: '上班打卡成功', color: 'positive', icon: 'check_circle' })
    await getAttendance()
  } catch (error) {
    const message = error?.response?.data?.message || '打卡失敗'
    $q.notify({ message, color: 'negative', icon: 'error' })
  } finally {
    loading.value = false
  }
}

const clockOut = async () => {
  try {
    loading.value = true
    await serviceAttendance.checkOut()
    $q.notify({ message: '下班打卡成功', color: 'positive', icon: 'check_circle' })
    await getAttendance()
  } catch (error) {
    const message = error?.response?.data?.message || '下班打卡失敗'
    $q.notify({ message, color: 'negative', icon: 'error' })
  } finally {
    loading.value = false
  }
}

const leaveSchema = yup.object({
  leaveType: yup.string().required('請選擇假別'),
  date: yup.string().required('請選擇日期'),
  startTime: yup.string().required('請輸入開始時間'),
  endTime: yup.string().required('請輸入結束時間'),
  totalHours: yup
    .number()
    .transform((v) => (isNaN(v) ? 0 : v))
    .positive('必須大於0')
    .required('請輸入有效時數'),
  comment: yup.string(),
  attachment: yup
    .mixed()
    .test('fileSize', '檔案太大 (限制 5MB)', (value) => {
      if (!value) return true
      return value.size <= 5242880
    })
    .test('fileType', '檔案格式不符', (value) => {
      if (!value) return true
      return [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(value.type)
    }),
})

// 建立表單
const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: leaveSchema,
  initialValues: {
    leaveType: '',
    date: '',
    startTime: '',
    endTime: '',
    totalHours: 0,
    comment: '',
    attachment: null,
  },
})

// 建立表單欄位
const { value: leaveTypeVal, errorMessage: leaveTypeError } = useField('leaveType')
const { value: dateVal, errorMessage: dateError } = useField('date')
const { value: startTimeVal, errorMessage: startTimeError } = useField('startTime')
const { value: endTimeVal, errorMessage: endTimeError } = useField('endTime')
const { value: totalHoursVal, errorMessage: totalHoursError } = useField('totalHours')
const { value: commentVal, errorMessage: commentError } = useField('comment')
const { value: attachmentVal, errorMessage: attachmentError } = useField('attachment')

const quotaSchema = yup.object({
  compLeave: yup
    .number()
    .transform((v) => (isNaN(v) ? 0 : v))
    .min(0, '不能小於0')
    .required('請輸入補休天數'),
})

const {
  handleSubmit: handleQuotaSubmit,
  resetForm: resetQuotaForm,
  isSubmitting: isQuotaSubmitting,
} = useForm({
  validationSchema: quotaSchema,
  initialValues: { compLeave: 0 },
})

const { value: compLeaveVal, errorMessage: compLeaveError } = useField('compLeave')

// 請假額度顯示轉換
const quotaDisplay = computed(() => {
  const currentYear = new Date().getFullYear()
  const q = user.leaveQuota || {}

  // 定義法定總額度 (小時)
  const totalAnnualHours = calculateLegalAnnualLeave(user.onboardDate) * 8
  const totalSickHours = 30 * 8
  const totalPersonalHours = 14 * 8
  const totalCompHours = (q.compLeave || 0) * 8

  // 計算當年度已請假時數
  const getUsedHours = () => {
    return myLeaveRequests.value
      .filter((req) => req.status === '已同意' && new Date(req.date).getFullYear() === currentYear)
      .reduce((sum, req) => sum + (req.totalHours || 0), 0)
  }

  return [
    {
      label: '剩餘特休',
      value: Math.max(totalAnnualHours - getUsedHours('特休'), 0),
      color: 'blue',
      icon: 'beach_access',
      hint: `法定總額: ${totalAnnualHours / 8} 天/年`,
    },
    {
      label: '剩餘病假',
      value: Math.max(totalSickHours - getUsedHours('病假'), 0),
      color: 'red',
      icon: 'medical_services',
      hint: '法規上限: 30 天/年',
    },
    {
      label: '剩餘事假',
      value: Math.max(totalPersonalHours - getUsedHours('事假'), 0),
      color: 'purple',
      icon: 'person',
      hint: '法規上限: 14 天/年',
    },
    {
      label: '累積補休',
      value: Math.max(totalCompHours, 0),
      color: 'orange',
      icon: 'history',
      hint: '公司規定',
    },
  ]
})

// 獲取個人請假紀錄以計算餘額
const fetchMyLeaves = async () => {
  try {
    const { data } = await serviceLeaveRequest.getMyLeaveRequest()
    myLeaveRequests.value = data.result
  } catch (error) {
    console.error('獲取請假紀錄失敗:', error)
  }
}

const calculateHours = () => {
  const startTime = startTimeVal.value
  const endTime = endTimeVal.value
  if (!startTime || !endTime) return

  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)

  const startTotal = startH * 60 + startM
  const endTotal = endH * 60 + endM

  let diff = endTotal - startTotal
  if (diff < 0) diff = 0

  totalHoursVal.value = Math.ceil(diff / 30) * 0.5
}

const openLeaveDialog = () => {
  resetForm()
  leaveDialog.value.show = true
}

const submitLeave = handleSubmit(async (values) => {
  try {
    const { date, startTime, endTime, attachment, ...data } = values

    const fd = new FormData()
    fd.append('leaveType', data.leaveType)
    fd.append('date', new Date(date).toISOString())
    fd.append('startTime', new Date(`${date}T${startTime}`).toISOString())
    fd.append('endTime', new Date(`${date}T${endTime}`).toISOString())
    fd.append('totalHours', data.totalHours)
    fd.append('comment', data.comment)

    if (attachment) {
      fd.append('attachment', attachment)
    }

    await serviceLeaveRequest.create(fd)
    $q.notify({ message: '請假申請已送出', color: 'positive', icon: 'check_circle' })
    leaveDialog.value.show = false
    fetchMyLeaves()
  } catch (error) {
    const message = error?.response?.data?.message || '申請失敗'
    $q.notify({ message, color: 'negative', icon: 'error' })
  }
})

const openQuotaDialog = () => {
  resetQuotaForm({
    values: {
      compLeave: user.leaveQuota?.compLeave || 0,
    },
  })
  quotaDialog.value.show = true
}

const submitQuota = handleQuotaSubmit(async (values) => {
  try {
    const { data } = await serviceUser.updateUser(user._id, {
      leaveQuota: {
        compLeave: values.compLeave,
      },
    })
    user.leaveQuota = data.result.leaveQuota
    $q.notify({ message: '更新成功', color: 'positive', icon: 'check_circle' })
    quotaDialog.value.show = false
  } catch (error) {
    const message = error?.response?.data?.message || '更新失敗'
    $q.notify({ message, color: 'negative', icon: 'error' })
  }
})

// 獲取指定年份的節假日
const loadHolidays = async (year) => {
  try {
    const { data } = await axios.get(
      `https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${year}.json`,
    )

    holidays.value = data
      .filter((day) => day.isHoliday)
      .map((day) => {
        const y = day.date.substring(0, 4)
        const m = day.date.substring(4, 6)
        const d = day.date.substring(6, 8)
        return `${y}-${m}-${d}`
      })
  } catch (error) {
    console.error('無法取得台灣節假日資料', error)
  }
}

const getDuration = (start, end) => {
  if (!start || !end) return '-'

  const startDate = new Date(start)
  const endDate = new Date(end)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '-'

  const diff = endDate - startDate
  if (diff < 0) return '-'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

const getAttendance = async () => {
  try {
    const { data } = await serviceAttendance.getAttendance()

    const todayStr = date.formatDate(Date.now(), 'YYYY-MM-DD')

    const todayLog = data.result.find((log) => {
      return date.formatDate(log.date, 'YYYY-MM-DD') === todayStr
    })

    if (todayLog) {
      isClockedIn.value = !!todayLog.checkIn && !todayLog.checkOut
      isClockedOutToday.value = !!todayLog.checkOut
    } else {
      isClockedIn.value = false
      isClockedOutToday.value = false
    }

    logs.value = data.result.map((log) => {
      const logDateStr = date.formatDate(log.date, 'YYYY-MM-DD')

      // 找出同日期且已同意的請假
      const leave = myLeaveRequests.value.find(
        (l) => l.status === '已同意' && date.formatDate(l.date, 'YYYY-MM-DD') === logDateStr,
      )

      return {
        ...log,
        date: logDateStr,
        checkIn: date?.formatDate(log.checkIn, 'HH:mm'),
        checkOut: date?.formatDate(log.checkOut, 'HH:mm'),
        duration: getDuration(log.checkIn, log.checkOut),
        status: log.status || '未定義',
        leave: leave?.leaveType,
      }
    })
  } catch (error) {
    console.log(error)
    $q.notify({ message: '無法取得打卡紀錄', color: 'negative', icon: 'error' })
  }
}

const calendar = computed(() => {
  const current = new Date(calendarDate.value)
  const year = current.getFullYear()
  const month = current.getMonth()
  const daysInMonth = date.daysInMonth(current)

  const days = []

  const firstDay = new Date(year, month, 1)
  const startPadding = firstDay.getDay()

  for (let i = 0; i < startPadding; i++) {
    days.push({ date: '', color: 'transparent', disabled: true })
  }

  const today = new Date(calendarDate.value)
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    const dateStr = date.formatDate(d, 'YYYY-MM-DD')
    const dayOfWeek = d.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isHoliday = holidays.value.includes(dateStr)
    const isToday = i === todayDate && month === todayMonth && year === todayYear

    let color = 'transparent'
    let textColor = 'dark'
    let disabled = false

    const log = logs.value.find((l) => l.date === dateStr)

    if (log) {
      textColor = 'white'
      if (log.status === '正常') color = 'positive'
      else if (log.status === '遲到' || log.status === '早退') color = 'orange'
      else color = 'negative'
    } else if (isWeekend || isHoliday) {
      color = 'grey-2'
      textColor = 'grey-5'
      disabled = true
    }

    days.push({
      date: i.toString(),
      color,
      textColor,
      disabled,
      isToday,
    })
  }

  return days
})

const stats = computed(() => {
  const nowObj = new Date()
  const currentMonth = nowObj.getMonth()
  const currentYear = nowObj.getFullYear()

  // 計算本月應上班天數
  const daysInMonth = date.daysInMonth(nowObj)
  let workingDaysCount = 0
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentYear, currentMonth, i)
    const dateStr = date.formatDate(d, 'YYYY-MM-DD')
    const dayOfWeek = d.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isHoliday = holidays.value.includes(dateStr)

    if (!isWeekend && !isHoliday) {
      workingDaysCount++
    }
  }
  const targetHours = workingDaysCount * 8
  const targetTotalMinutes = targetHours * 60

  const monthLogs = logs.value.filter((log) => {
    const d = new Date(log.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  // 計算總工時
  let totalMinutes = 0
  monthLogs.forEach((log) => {
    if (log.duration && log.duration !== '-') {
      const match = log.duration.match(/(\d+)h (\d+)m/)
      if (match) {
        totalMinutes += parseInt(match[1]) * 60 + parseInt(match[2])
      }
    }
  })
  const totalHoursStr = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`

  // 計算平均上班時間
  let totalCheckInMinutes = 0
  let checkInCount = 0
  monthLogs.forEach((log) => {
    if (log.checkIn && log.checkIn !== '-') {
      const [hh, mm] = log.checkIn.split(':').map(Number)
      if (!isNaN(hh) && !isNaN(mm)) {
        totalCheckInMinutes += hh * 60 + mm
        checkInCount++
      }
    }
  })
  let avgCheckInStr = '-'
  if (checkInCount > 0) {
    const avgMins = Math.floor(totalCheckInMinutes / checkInCount)
    avgCheckInStr = `${Math.floor(avgMins / 60)
      .toString()
      .padStart(2, '0')}:${(avgMins % 60).toString().padStart(2, '0')}`
  }

  // 統計異常天數 (遲到、早退、曠職)
  const abnormalCount = monthLogs.filter((log) => log.status !== '正常').length

  // 計算加班 (超過下班時間)
  let overtimeMinutes = 0
  const workEndTime = user.work?.workEndTime || '18:00'
  const [targetHH, targetMM] = workEndTime.split(':').map(Number)
  const targetTotal = targetHH * 60 + targetMM

  monthLogs.forEach((log) => {
    if (log.checkOut && log.checkOut !== '-') {
      const [hh, mm] = log.checkOut.split(':').map(Number)
      if (!isNaN(hh) && !isNaN(mm)) {
        const actualTotal = hh * 60 + mm
        if (actualTotal > targetTotal) {
          overtimeMinutes += actualTotal - targetTotal
        }
      }
    }
  })
  const overtimeStr = `${Math.floor(overtimeMinutes / 60)}h ${overtimeMinutes % 60}m`

  return [
    {
      title: '本月累積工時',
      value: totalHoursStr,
      type: 'progress',
      progress: targetTotalMinutes > 0 ? Math.min(totalMinutes / targetTotalMinutes, 1) : 0,
      subtext: `本月目標: ${targetHours}h (${workingDaysCount}工作日)`,
    },
    {
      title: '平均上班時間',
      value: avgCheckInStr,
      type: 'text',
      icon: 'schedule',
      subtext: '本月平均出勤時間',
      subtextColor: 'text-grey-6',
    },
    {
      title: '異常天數 (本月)',
      value: `${abnormalCount} 天`,
      type: 'text',
      icon: abnormalCount > 0 ? 'warning' : 'check_circle',
      subtext: abnormalCount > 0 ? '請留意出勤規範' : '表現優異！',
      subtextColor: abnormalCount > 0 ? 'text-negative' : 'text-positive',
    },
    {
      title: '本月累積加班',
      value: overtimeStr,
      type: 'text',
      icon: 'trending_up',
      subtext: '辛苦了，適度休息',
      subtextColor: 'text-primary',
    },
  ]
})

const columns = [
  { name: 'date', label: '日期', field: 'date', align: 'left', classes: 'text-weight-medium' },
  {
    name: 'checkIn',
    label: '上班打卡時間',
    field: 'checkIn',
    align: 'left',
    classes: 'text-grey-8',
  },
  {
    name: 'checkOut',
    label: '下班打卡時間',
    field: 'checkOut',
    align: 'left',
    classes: 'text-grey-8',
  },
  { name: 'duration', label: '時長', field: 'duration', align: 'left' },
  { name: 'status', label: '狀態', field: 'status', align: 'left' },
  { name: 'leave', label: '請假', field: 'leave', align: 'left' },
]

onMounted(async () => {
  await fetchMyLeaves()
  await getAttendance()
  loadHolidays(new Date(calendarDate.value).getFullYear())
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.border-radius-lg {
  border-radius: 12px;
}
.tracking-wide {
  letter-spacing: 1px;
}
.border-all {
  border: 1px solid #e0e0e0;
}
.border-bottom {
  border-bottom: 1px solid #f0f0f0;
}
.border-top {
  border-top: 1px solid #f0f0f0;
}
.hover-grey:hover {
  background: #f5f5f5;
}
.opacity-50 {
  opacity: 0.5;
}
.today-border {
  box-shadow: 0 0 0 2px var(--q-primary) !important;
}

:deep(.borderless-input .q-field__control:before) {
  border: none !important;
}
:deep(.borderless-input .q-field__control) {
  background: #f5f6f8;
}

:deep(.header-transparent thead tr th) {
  background: transparent !important;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
}
:deep(.q-table tbody td) {
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
