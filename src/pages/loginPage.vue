<template>
  <q-page class="row justify-center items-center">
    <div class="col-12 col-md-6 col-lg-4 q-pa-md">
      <q-separator class="q-my-md" />

      <q-form @submit="submit" class="q-gutter-y-md">
        <q-input
          v-model="accountValue"
          label="帳號"
          hint="長度 4 ~ 20 的英數字"
          counter
          maxlength="20"
          :error="!!accountError"
          :error-message="accountError"
          outlined
          dense
        />

        <q-input
          v-model="passwordValue"
          label="密碼"
          hint="長度 4 ~ 20 的英數字、特殊符號"
          :type="isPwdVisible ? 'text' : 'password'"
          counter
          maxlength="20"
          :error="!!passwordError"
          :error-message="passwordError"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon
              :name="isPwdVisible ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="isPwdVisible = !isPwdVisible"
            />
          </template>
        </q-input>

        <div class="row justify-end">
          <q-btn label="登入" flat type="submit" color="primary" :loading="isSubmitting" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import validator from 'validator'
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import * as yup from 'yup'
import serviceUser from 'src/services/user'
import { useUserStore } from 'stores/user'

const $q = useQuasar()
const router = useRouter()
const user = useUserStore()
// 控制密碼顯示/隱藏的狀態
const isPwdVisible = ref(false)
const schema = yup.object({
  account: yup
    .string()
    .required('帳號必填')
    .min(4, '最少4個字')
    .max(20, '最多20個字')
    .test('isAlphanumeric', '帳號只能是英、數字', (value) =>
      value ? validator.isAlphanumeric(value) : true,
    ),
  password: yup
    .string()
    .required('密碼必填')
    .min(4, '密碼最少8個字')
    .max(20, '密碼最多20個字')
    .test('isAscii', '密碼只能是英、數字、特殊符號', (value) =>
      value ? validator.isAscii(value) : true,
    ),
})

// 建立表單
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    account: '',
    password: '',
  },
})

// 建立表單欄位
const { value: accountValue, errorMessage: accountError } = useField('account')
const { value: passwordValue, errorMessage: passwordError } = useField('password')

const submit = handleSubmit(async (values) => {
  try {
    const { data } = await serviceUser.login(values)
    user.login(data.result)

    $q.notify({
      message: '登入成功',
      color: 'positive',
      icon: 'check_circle',
      position: 'bottom',
    })

    router.push('/attendance')
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤'

    $q.notify({
      message: text,
      color: 'negative',
      icon: 'error',
      position: 'bottom',
    })
  }
})
</script>
