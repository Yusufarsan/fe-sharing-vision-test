import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/add-new',
      name: 'add-new',
      component: () => import('../views/AddNewView.vue'),
    },
    {
      path: '/edit/:id',
      name: 'edit-article',
      component: () => import('../views/EditArticleView.vue'),
      props: true,
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('../views/PreviewView.vue'),
    },
  ],
})

export default router
