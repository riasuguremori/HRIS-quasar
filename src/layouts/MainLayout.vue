<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-lg">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md q-mr-sm"
          color="white"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawer" side="left" bordered :width="240">
      <div class="column full-height">
        <div class="q-pa-md q-gutter-md col">
          <div class="row items-center q-gutter-sm q-mb-xl">
            <q-avatar color="primary" text-color="white" icon="business" rounded />
            <div class="text-weight-bold">出勤管理系統</div>
          </div>

          <q-list transparent class="q-px-sm">
            <template v-for="nav in navs" :key="nav.to">
              <q-item
                v-if="nav.show"
                clickable
                v-ripple
                :to="nav.to"
                exact
                active-class="text-primary bg-blue-1 rounded-borders"
              >
                <q-item-section avatar>
                  <q-icon :name="nav.icon" />
                </q-item-section>

                <q-item-section>
                  {{ nav.title }}
                </q-item-section>
              </q-item>
            </template>
            <q-item v-if="user.isLoggedIn" clickable v-ripple @click="logout" class="text-red">
              <q-item-section avatar>
                <q-icon name="mdi-logout" />
              </q-item-section>
              <q-item-section>登出</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div>
          <div
            v-if="user.isLoggedIn"
            class="q-pa-md border-top cursor-pointer hover-bg"
            v-ripple
            @click="profileDialog = true"
          >
            <div class="row items-center">
              <q-avatar size="40px" class="q-mr-md">
                <img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.account}`" />
              </q-avatar>
              <div>
                <div class="text-weight-bold text-body2">{{ user.name }}</div>
              </div>
            </div>
          </div>

          <q-dialog v-model="profileDialog" transition-show="scale" transition-hide="scale">
            <q-card style="width: 1000px; max-width: 95vw" class="rounded-xl q-pa-md">
              <div class="row justify-end q-pb-sm z-top">
                <q-btn
                  icon="close"
                  flat
                  round
                  dense
                  v-close-popup
                  class="bg-white text-grey-8 shadow-1"
                />
              </div>

              <div class="bg-white rounded-xl q-pa-lg">
                <div
                  class="text-subtitle1 text-weight-bold row items-center q-mb-lg justify-between"
                >
                  <div class="row items-center">
                    <q-icon name="person" color="primary" size="sm" class="q-mr-sm" />
                    個人資料
                  </div>
                </div>

                <div class="row q-col-gutter-y-lg q-col-gutter-x-md">
                  <div class="col-12 col-sm-6">
                    <div
                      class="text-caption text-grey-5 text-uppercase text-weight-bold tracking-wide q-mb-xs"
                    >
                      姓名
                    </div>
                    <div class="text-body1 text-weight-medium">
                      {{ user.name || '未填寫' }}
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div
                      class="text-caption text-grey-5 text-uppercase text-weight-bold tracking-wide q-mb-xs"
                    >
                      信箱
                    </div>
                    <div class="text-body1 text-weight-medium">
                      {{ user.email || '未填寫' }}
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div
                      class="text-caption text-grey-5 text-uppercase text-weight-bold tracking-wide q-mb-xs"
                    >
                      部門
                    </div>
                    <div class="text-body1 text-weight-medium">
                      {{ user.department || '未填寫' }}
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div
                      class="text-caption text-grey-5 text-uppercase text-weight-bold tracking-wide q-mb-xs"
                    >
                      到職日
                    </div>
                    <div class="text-body1 text-weight-medium">
                      {{ formattedOnboardDate }}
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from 'src/stores/user'
import serviceUser from 'src/services/user'
import { useRouter } from 'vue-router'
import { date } from 'quasar'

const router = useRouter()
const user = useUserStore()
const leftDrawer = ref(false)
const profileDialog = ref(false)

const formattedOnboardDate = computed(() => {
  return user.onboardDate ? date.formatDate(user.onboardDate, 'YYYY-MM-DD') : '未填寫'
})

const toggleLeftDrawer = () => {
  leftDrawer.value = !leftDrawer.value
}

const navs = computed(() => [
  { title: '出勤狀態', to: '/attendance', icon: 'event_available', show: true },
  { title: '請假申請', to: '/leaveRequest', icon: 'assignment_late', show: true },
  { title: '人員管理', to: '/member', icon: 'manage_accounts', show: user.isAdmin },
  { title: '註冊', to: '/register', icon: 'person_add', show: user.isAdmin },
])

const logout = async () => {
  try {
    await serviceUser.logout()
  } catch (error) {
    console.log(error)
  }
  user.logout()
  router.push('/')
}
</script>

<style scoped>
.border-top {
  border-top: 1px solid #f0f0f0;
}
.hover-bg:hover {
  background: #f5f5f5;
  transition: background 0.3s;
}
.rounded-xl {
  border-radius: 16px;
}
.tracking-wide {
  letter-spacing: 0.5px;
}
.z-top {
  z-index: 10;
}
</style>
