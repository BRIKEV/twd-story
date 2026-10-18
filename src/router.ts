import { createRouter, createWebHistory } from 'vue-router'
import HeroView from './views/HeroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'hero', component: HeroView },
    {
      path: '/first-test',
      name: 'first-test',
      component: () => import('./views/FirstTestView.vue'),
    },
    { path: '/speed', name: 'speed', component: () => import('./views/SpeedView.vue') },
    { path: '/automate', name: 'automate', component: () => import('./views/AutomateView.vue') },
    { path: '/mocking', name: 'mocking', component: () => import('./views/MockingView.vue') },
    { path: '/real-app', name: 'real-app', component: () => import('./views/RealAppView.vue') },
    // The app chapter 5 tests: a site of its own, outside the tutorial's chrome
    {
      path: '/shop',
      name: 'shop',
      component: () => import('./views/ShopView.vue'),
      meta: { standalone: true },
    },
    { path: '/ship', name: 'ship', component: () => import('./views/ShipView.vue') },
    // Also catches the throwaway route twd.visit() passes through to remount a page
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('./views/NotFoundView.vue'),
    },
  ],
})

export default router
