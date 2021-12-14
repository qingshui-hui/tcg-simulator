import { createRouter, createWebHistory } from 'vue-router'
import index from '../pages/index.vue'
import room from '../pages/room.vue'

const routes = [
  { path: '', name: 'index', component: index },
  { path: '/room', name: 'room', component: room },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
