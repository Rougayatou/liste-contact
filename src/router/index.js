import { createRouter, createWebHistory } from 'vue-router'
import ListeContacts from '../views/ListeContacts.vue'
import DetailContact from '../views/DetailContact.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ListeContacts,
    },
    {
      path: '/contact/:id',
      name: 'detail-contact',
      component: DetailContact,
    },
  ],
})

export default router
