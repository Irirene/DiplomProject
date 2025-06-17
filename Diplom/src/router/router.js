import { createRouter, createWebHistory } from 'vue-router'

const routes = [
        {
        name: 'Auth', 
        path: '/auth', 
        component: () => import('@/pages/Home.vue'), alias : '/'
        }, 
        {
        name: 'Expeditor', 
        path: '/expeditor', 
        component: () => import('@/pages/Main.vue'),
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('session');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Auth' });
  } else {
    next();
  }
});

export default router;
