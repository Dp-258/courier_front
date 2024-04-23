import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '',
        name: 'login',
        component: () => import('@/views/LoginView.vue')
    },
    {
        path: '/loginEmployee',
        name: 'employees',
        component: () => import('@/views/LoginEmployeeView.vue')
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('@/views/SignUpView.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        children: [
            {
                path: '', 
                redirect: { name: 'userPrealerts' } 
            },
            {
                path: '/adminPackages',
                name: 'adminPackages',
                component: () => import('@/components/admin/adminPackages.vue'),
                props: true
            },
            {
                path: '/userPrealerts',
                name: 'userPrealerts',
                component: () => import('@/components/user/userPrealerts.vue'),
                props: true
            },
            {
                path: '/userDashboard',
                name: 'userDashboard',
                component: () => import('@/components/user/userDashboard.vue'),
                props: true
            }
        ]
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(),
})

export default router