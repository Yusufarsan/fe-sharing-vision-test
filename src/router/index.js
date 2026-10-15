import { createRouter, createWebHistory } from 'vue-router';

// Lazy loading komponen untuk performa lebih baik
const Dashboard = () => import('../views/Dashboard.vue');
const AddArticle = () => import('../views/AddArticle.vue');
const EditArticle = () => import('../views/EditArticle.vue');
const Preview = () => import('../views/Preview.vue');

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/add', name: 'AddArticle', component: AddArticle },
  { path: '/edit/:id', name: 'EditArticle', component: EditArticle },
  { path: '/preview', name: 'Preview', component: Preview },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;