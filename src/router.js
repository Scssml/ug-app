import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }

  const userGroup = store.getters.getAuthUserGroup;
  if (userGroup.code === 'admin' || userGroup.code === 'manager') {
    next('/');
    return;
  }
  next('/deliveries/');
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/login');
};

const ifManager = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    const userGroup = store.getters.getAuthUserGroup;
    if (userGroup.code === 'admin' || userGroup.code === 'manager') {
      next();
      return;
    }
    if (userGroup.code === 'courier') {
      next('/deliveries/');
      return;
    }
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
      beforeEnter: ifManager,
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
      beforeEnter: ifManager,
    },
    {
      path: '/florists/',
      name: 'florists',
      component: () => import('./views/Florists/List.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/couriers/',
      name: 'couriers',
      component: () => import('./views/Couriers/List.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/users/',
      name: 'users',
      component: () => import('./views/Users/List.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/users-groups/',
      name: 'users-groups',
      component: () => import('./views/UsersGroups/List.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/bouquets/',
      name: 'bouquets',
      component: () => import('./views/Bouquets/List.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/pays/',
      name: 'pays',
      component: () => import('./views/Pays/List.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/orders/',
      name: 'orders',
      component: () => import('./views/Orders/List.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/deliveries/',
      name: 'deliveries',
      component: () => import('./views/Deliveries/List.vue'),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/goods/',
      name: 'goods',
      component: () => import('./views/Goods/List.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/goods/history/',
      name: 'history',
      component: () => import('./views/Goods/History.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/goods/history/:id/',
      name: 'historyView',
      component: () => import('./views/Goods/HistoryView.vue'),
      beforeEnter: ifManager,
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
      path: '/print/orders/florist/:ids/',
      name: 'ordersFlorist',
      component: () => import('./views/Print/ordersFlorist.vue'),
      // beforeEnter: ifAuthenticated,
      meta: {
        pagePrint: true,
      },
    },
    {
      path: '/print/bouquet/receipt/:id/',
      name: 'bouquet​Receipt',
      component: () => import('./views/Print/bouquet​Receipt.vue'),
      // beforeEnter: ifAuthenticated,
      meta: {
        pagePrint: true,
      },
    },
    {
      path: '/print/order/day-orders/:date/',
      name: 'ordersOfDay',
      component: () => import('./views/Print/orderDeliveryDay.vue'),
      // beforeEnter: ifAuthenticated,
      meta: {
        pagePrint: true,
      },
    },
    {
      path: '/reports/',
      name: 'repprts',
      component: () => import('./views/Reports/created.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/reports/graphQL/',
      name: 'repprtsGrapgQL',
      component: () => import('./views/Reports/graphQL.vue'),
      beforeEnter: ifManager,
    },
    {
      path: '/reviews/',
      name: 'reviews',
      component: () => import('./views/Reviews/List.vue'),
      beforeEnter: ifManager,
    },
  ],
});
