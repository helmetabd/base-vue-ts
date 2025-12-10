import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/errors/NotFound.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFound.vue')
  },
  {
    path: '/admin-dashboard',
    name: 'admin-dashboard',
    meta: {
      title: 'Admin Dashboard',
      authRequired: true,
      permissionRequired: 'user'
    },
    component: () => import('@/views/pages/dashboard/AdminDashboard.vue')
  },
  {
    path: '/user-dashboard',
    name: 'user-dashboard',
    meta: {
      title: 'Test Dashboard',
      authRequired: true,
      permissionRequired: 'user'
    },
    component: () => import('@/views/pages/dashboard/SimpleDashboard.vue')
  },
  {
    path: '/',
    name: 'index',
    redirect: { name: 'auth.login' }
  },

  // Auth Routes
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'auth.login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: {
          title: 'Login'
        }
      },
      {
        path: 'register',
        name: 'auth.register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: {
          title: 'Register'
        }
      },
      {
        path: 'logout',
        name: 'auth.logout',
        component: () => import('@/views/auth/LogoutView.vue'),
        meta: {
          title: 'Logout'
        }
      }
    ]
  },

  // Dashboard Routes
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: 'Dashboard',
      authRequired: true
    },
    component: () => import('@/views/pages/dashboard/DashboardView.vue')
  },

  // Settings Routes
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/pages/systems/SettingsView.vue'),
    meta: {
      title: 'Dashboard',
      authRequired: true
    }
  },

  // User Routes
  {
    path: '/user',
    children: [
      {
        path: 'privilege-template',
        name: 'user.privilege-template',
        meta: {
          title: 'Privilege Template',
          authRequired: true,
          permissionRequired: 'user.users'
        },
        component: () => import('@/views/pages/users/PrivilegeTemplate.vue')
      },
      {
        path: 'logs',
        name: 'user.logs',
        meta: {
          title: 'Logs',
          authRequired: true,
          permissionRequired: 'user.logs'
        },
        component: () => import('@/views/pages/users/PrivilegeTemplate.vue')
      },
      {
        path: '',
        name: 'user.index',
        meta: {
          title: 'User List',
          authRequired: true,
          permissionRequired: 'user'
        },
        component: () => import('@/views/pages/users/UserIndex.vue')
      },
      {
        path: ':id',
        name: 'user.detail',
        meta: {
          title: 'User Detail',
          authRequired: true,
          permissionRequired: 'user.users'
        },
        component: () => import('@/views/pages/users/UserDetail.vue')
      },
      {
        path: ':id/privileges',
        name: 'user.privileges',
        meta: {
          title: 'User Privileges',
          authRequired: true,
          permissionRequired: 'user.users'
        },
        component: () => import('@/views/pages/users/UserPrivilege.vue')
      }
    ]
  },

  //Maintenace Routes
  {
    path: '/maintenance',
    name: 'maintenance',
    meta: {
      title: 'Under Construction',
      authRequired: false
    },
    component: () => import('@/views/pages/UnderMaintenance.vue')
  }
]

export default routes
