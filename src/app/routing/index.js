import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { applyRouteSeo } from '@/app/composables/useSeo';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  }
});

router.afterEach((to) => {
  applyRouteSeo(to);
});


export default router