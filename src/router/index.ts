import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/home/home-view.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/projects',
    name: 'projects',
    children: [
      {
        path: 'todo',
        name: 'todo',
        component: () => import(/* webpackChunkName: "todo" */ '../views/todo/todo-view.vue'),
      },
      {
        path: 'shop',
        name: 'shop',
        component: () => import(/* webpackChunkName: "shop" */ '../views/shop/shop-view.vue'),
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import(/* webpackChunkName: "chat" */ '../views/chat/chat-view.vue'),
      },
    ],
    component: () => import(/* webpackChunkName: "projects" */ '../views/projects/projects-view.vue'),
  },
  {
    path: '/contacts',
    name: 'contacts',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "contacts" */ '../views/contacts/contacts-view.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
