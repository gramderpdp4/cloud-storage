import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../scripts/firebase'

const auth = getAuth(app)

const authState = (to, from, next) => {
  onAuthStateChanged(auth, (state) => {
    if (state) {
      if (to.name != 'panel') {
        next({ name: 'panel', replace: true })
      } else {
        next()
      }
    } else {
      if (to.name != 'panel') {
        next()
      } else {
        next({ name: 'home', replace: true })
      }
    }
  })
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/home.vue'),
    beforeEnter: authState,
    children: [
      {
        path: 'signup',
        name: 'signup',
        component: () => import('../pages/sign-up.vue')
      },
      {
        path: 'signin',
        name: 'signin',
        component: () => import('../pages/sign-in.vue')
      }
    ]
  },
  {
    path: '/panel',
    name: 'panel',
    beforeEnter: authState,
    meta: { cleanRoute: true },
    component: () => import('../pages/panel.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.url.BASE_URL),
  routes
})

export default router;