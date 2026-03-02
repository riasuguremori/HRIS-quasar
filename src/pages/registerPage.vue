<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="text-h3 text-center q-mb-md">註冊</h1>

        <q-separator class="q-mb-md" />

        <q-form @submit="submit" class="q-gutter-y-md">
          <q-input
            v-model="account.value.value"
            :error="!!account.errorMessage.value"
            :error-message="account.errorMessage.value"
            label="帳號"
            hint="長度 4 ~ 20 的英數字"
            maxlength="20"
            counter
            outlined
            :disable="form.isSubmitting.value"
          />

          <q-input
            v-model="password.value.value"
            :error="!!password.errorMessage.value"
            :error-message="password.errorMessage.value"
            label="密碼"
            hint="長度 4 ~ 20 的英數字、特殊符號"
            type="password"
            maxlength="20"
            counter
            outlined
            :disable="form.isSubmitting.value"
          />

          <q-input
            v-model="confirmPassword.value.value"
            :error="!!confirmPassword.errorMessage.value"
            :error-message="confirmPassword.errorMessage.value"
            label="確認密碼"
            hint="長度 4 ~ 20 的英數字、特殊符號"
            type="password"
            maxlength="20"
            counter
            outlined
            :disable="form.isSubmitting.value"
          />

          <div class="row justify-center q-gutter-md">
            <q-btn type="button" flat label="取消" color="primary" @click="router.push('/')" />
            <q-btn
              type="submit"
              flat
              color="primary"
              :loading="form.isSubmitting.value"
              label="註冊"
            />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import validator from 'validator'
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import serviceUser from 'src/services/user'

// Quasar 的工具
const $q = useQuasar()
const router = useRouter()

// 驗證規則 Schema (邏輯保持不變)
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
    .min(4, '密碼最少4個字')
    .max(20, '密碼最多20個字')
    .test('isAscii', '密碼只能是英、數字、特殊符號', (value) =>
      value ? validator.isAscii(value) : true,
    ),
  confirmPassword: yup
    .string()
    .required('密碼必填')
    .min(4, '密碼最少4個字')
    .max(20, '密碼最多20個字')
    .test('isAscii', '密碼只能是英、數字、特殊符號', (value) =>
      value ? validator.isAscii(value) : true,
    )
    .oneOf([yup.ref('password')], '密碼不一致'),
})

// 建立表單
const form = useForm({
  validationSchema: schema,
  initialValues: {
    account: '',
    password: '',
    confirmPassword: '',
  },
})

// 建立表單欄位
const account = useField('account')
const password = useField('password')
const confirmPassword = useField('confirmPassword')

const submit = form.handleSubmit(async (values) => {
  try {
    console.log('success')
    await serviceUser.create(values)

    $q.notify({
      color: 'positive',
      message: '註冊成功',
      icon: 'check',
      position: 'bottom',
    })

    router.push('/')
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤'

    $q.notify({
      color: 'negative',
      message: text,
      icon: 'report_problem',
      position: 'bottom',
    })
  }
})
</script>
