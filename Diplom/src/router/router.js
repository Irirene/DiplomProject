import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
        name: 'Auth', 
        path: '/auth', 
        component: () => import('@/pages/Home.vue'), alias : '/'
        }, {
        name: 'Expeditor', 
        path: '/expeditor', 
        component: () => import('@/pages/Main.vue')
    },
]
})