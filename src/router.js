import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/clients/',
      name: 'clients',
      component: () => import('./views/Clients/List.vue'),
    },
    {
      path: '/florists/',
      name: 'florists',
      component: () => import('./views/Florists/List.vue'),
    },
    {
      path: '/users/',
      name: 'users',
      component: () => import('./views/Users/List.vue'),
    },
    {
      path: '/bouquets/',
      name: 'bouquets',
      component: () => import('./views/Bouquets/List.vue'),
    },
    {
      path: '/pays/',
      name: 'pays',
      component: () => import('./views/Pays/List.vue'),
    },
    {
      path: '/requests/',
      name: 'requests',
      component: () => import('./views/Requests/index.vue'),
    },
    {
      path: '/requests/list/',
      name: 'requests-list',
      component: () => import('./views/Requests/List.vue'),
    },
    {
      path: '/requests/form/:id',
      name: 'requests-form',
      component: () => import('./views/Requests/Form.vue'),
    },
  ],
});
