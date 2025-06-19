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

function getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
      }
      return null;
    }



router.beforeEach((to, from, next) => {
  const session = getCookie('session');
  const isAuthenticated = !!session;  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Auth' });
  } else {
    next();
  }
});

export default router;