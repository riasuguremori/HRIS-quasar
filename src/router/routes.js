const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/loginPage.vue'),
        meta: {
          title: '登入',
          login: 'no-login-only',
        },
      },
      {
        path: 'attendance',
        component: () => import('pages/attendancePage.vue'),
        meta: {
          title: '打卡紀錄',
          login: 'login-only',
        },
      },
      {
        path: 'leaveRequest',
        component: () => import('pages/leaveRequestPage.vue'),
        meta: {
          title: '請假申請',
          login: 'login-only',
        },
      },
      {
        path: 'register',
        component: () => import('pages/registerPage.vue'),
        meta: {
          title: '註冊',
          login: 'login-only',
          admin: true,
        },
      },
      {
        path: 'member',
        component: () => import('pages/memberPage.vue'),
        meta: {
          title: '人事管理',
          login: 'login-only',
          admin: true,
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
