import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/');
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/login');
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/login/',
      name: 'login',
      component: () => import('./views/Login.vue'),
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/clients/',
      name: 'clients',
      component: () => import('./views/Clients/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/florists/',
      name: 'florists',
      component: () => import('./views/Florists/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/couriers/',
      name: 'couriers',
      component: () => import('./views/Couriers/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/users/',
      name: 'users',
      component: () => import('./views/Users/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/users-groups/',
      name: 'users-groups',
      component: () => import('./views/UsersGroups/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/bouquets/',
      name: 'bouquets',
      component: () => import('./views/Bouquets/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/pays/',
      name: 'pays',
      component: () => import('./views/Pays/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/orders/',
      name: 'orders',
      component: () => import('./views/Orders/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/goods/',
      name: 'goods',
      component: () => import('./views/Goods/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/goods/history/',
      name: 'history',
      component: () => import('./views/Goods/History.vue'),
    },
    {
      path: '/goods/history/:id/',
      name: 'historyView',
      component: () => import('./views/Goods/HistoryView.vue'),
    },
    {
      path: '/print/order/delivery/:id/',
      name: 'orderDelivery',
      component: () => import('./views/Print/orderDelivery.vue'),
      // beforeEnter: ifAuthenticated,
      meta: {
        pagePrint: true,
      },
    },
    {
      path: '/print/orders/delivery/:ids/',
      name: 'ordersDelivery',
      component: () => import('./views/Print/ordersDelivery.vue'),
      // beforeEnter: ifAuthenticated,
      meta: {
        pagePrint: true,
      },
    },
    {
      path: '/print/order/florist/:id/',
      name: 'orderFlorist',
      component: () => import('./views/Print/orderFlorist.vue'),
      // beforeEnter: ifAuthenticated,
      meta: {
        pagePrint: true,
      },
    },
    {
      path: '/print/order/day-orders/:date/',
      name: 'orderFlorist',
      component: () => import('./views/Print/orderDeliveryDay.vue'),
      // beforeEnter: ifAuthenticated,
      meta: {
        pagePrint: true,
      },
    },
  ],
});
