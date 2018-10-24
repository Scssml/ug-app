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
