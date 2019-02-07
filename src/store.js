import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const usersGroupsListResponse = [
  {
    id: 1,
    name: 'Админинистраторы',
  },
  {
    id: 2,
    name: 'Менеджеры',
  },
];

const usersListResponse = [
  {
    name: 'Админ',
    id: 1,
    active: true,
    groups: [1],
  },
  {
    name: 'Менеджер 1',
    id: 2,
    active: true,
    groups: [2],
  },
  {
    name: 'Менеджер 2',
    id: 3,
    active: true,
    groups: [2],
  },
];

export default new Vuex.Store({
  state: {
    authUser: 2,
    apiSrc: 'http://ug-app.cq58583.tmweb.ru/api/',
    apiUrl: '/',
    authToken: '',
    authStatus: '',
  },
  getters: {
    isAuthenticated: state => !!state.authToken,
    authStatus: state => state.authStatus,
  },
  mutations: {
    authRequest: (state) => {
      state.authStatus = 'loading';
    },
    authSuccess: (state, token) => {
      state.authStatus = 'success';
      state.authToken = token;
    },
    authError: (state) => {
      state.authStatus = 'error';
    },
  },
  actions: {
    login({ state, commit }, user) {
      return new Promise((resolve, rejected) => {
        commit('authRequest');
        axios.post(
          `${state.apiUrl}login`,
          user,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ).then((response) => {
          const token = response.data;
          localStorage.setItem('user-token', token);
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          commit('authSuccess', token);
          // dispatch('userRequest');
          resolve(response);
        }).catch((error) => {
          commit('authError', error);
          localStorage.removeItem('user-token');
          rejected(error);
        });
      });
    },
    getUsersList() {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        // let usersList = JSON.parse(localStorage.getItem('users'));
        // usersList = (usersList !== null) ? usersList : [];

        const usersList = usersListResponse;
        const errorData = {
          text: 'Ошибка получения пользователей!',
        };
        const successData = {
          text: 'Пользователи получены!',
        };

        const error = false;
        if (error) {
          rejected(errorData);
        } else {
          resolve({ usersList, successData });
        }
        // }, 1000);
      });
    },
    getUsersGroupsList() {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        const usersGroupsList = usersGroupsListResponse;
        const errorData = {
          text: 'Ошибка получения групп пользователей!',
        };
        const successData = {
          text: 'Группы пользователей получены!',
        };

        const error = false;
        if (error) {
          rejected(errorData);
        } else {
          resolve({ usersGroupsList, successData });
        }
        // }, 1500);
      });
    },
    getBouquetsList(store) {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        // let bouquetsList = JSON.parse(localStorage.getItem('bouquets'));

        // const bouquetsList = bouquetsListResponse;
        const errorData = {
          text: 'Ошибка получения букетов!',
        };
        const successData = {
          text: 'Букеты получены!',
        };

        axios.get(`${store.state.apiUrl}bouquets`).then((response) => {
          let bouquetsList = response.data;
          bouquetsList = (bouquetsList !== null && bouquetsList !== '') ? bouquetsList : [];

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ bouquetsList, successData });
          }
        });
        // }, 1500);
      });
    },
    getClientsList(store) {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        // let clientsList = JSON.parse(localStorage.getItem('clients'));

        // const clientsList = clientsListResponse;
        const errorData = {
          text: 'Ошибка получения клиентов!',
        };
        const successData = {
          text: 'Клиенты получены!',
        };

        axios.get(`${store.state.apiUrl}clients`).then((response) => {
          let clientsList = response.data;
          clientsList = (clientsList !== null && clientsList !== '') ? clientsList : [];
          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ clientsList, successData });
          }
        });
        // }, 1000);
      });
    },
    getFloristsList(store) {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        // let floristsList = JSON.parse(localStorage.getItem('florists'));

        // const floristsList = floristsListResponse;
        const errorData = {
          text: 'Ошибка получения флористов!',
        };
        const successData = {
          text: 'Флористы получены!',
        };

        axios.get(`${store.state.apiUrl}florists`).then((response) => {
          let floristsList = response.data;
          floristsList = (floristsList !== null && floristsList !== '') ? floristsList : [];

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ floristsList, successData });
          }
        });
        // }, 1500);
      });
    },
    getCouriersList(store) {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        // let couriersList = JSON.parse(localStorage.getItem('couriers'));

        // const couriersList = couriersListResponse;
        const errorData = {
          text: 'Ошибка получения флористов!',
        };
        const successData = {
          text: 'Флористы получены!',
        };

        axios.get(`${store.state.apiUrl}couriers`).then((response) => {
          let couriersList = response.data;
          couriersList = (couriersList !== null && couriersList !== '') ? couriersList : [];

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ couriersList, successData });
          }
        });
        // }, 1500);
      });
    },
    getOrdersList(store) {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        // let ordersList = JSON.parse(localStorage.getItem('orders'));

        // const ordersList = ordersListResponse;
        const errorData = {
          text: 'Ошибка получения заказов!',
        };
        const successData = {
          text: 'Заказы получены!',
        };

        axios.get(`${store.state.apiUrl}orders`).then((response) => {
          let ordersList = response.data;
          ordersList = (ordersList !== null && ordersList !== '') ? ordersList : [];

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ ordersList, successData });
          }
        });
        // }, 2000);
      });
    },
    getOrdersWorksList(store) {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        // let ordersList = JSON.parse(localStorage.getItem('orders'));

        // const ordersList = ordersListResponse;
        const errorData = {
          text: 'Ошибка получения заказов!',
        };
        const successData = {
          text: 'Заказы получены!',
        };

        axios.get(`${store.state.apiUrl}orders`).then((response) => {
          let ordersList = response.data;
          ordersList = (ordersList !== null && ordersList !== '') ? ordersList : [];
          ordersList = ordersList.filter(item => item.status === 1);

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ ordersList, successData });
          }
        });
        // }, 2000);
      });
    },
    getGoodsList(store) {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        // let goodsList = JSON.parse(localStorage.getItem('goods'));

        // const goodsList = goodsListResponse;
        const errorData = {
          text: 'Ошибка получения товаров!',
        };
        const successData = {
          text: 'Товары получены!',
        };

        axios.get(`${store.state.apiUrl}goods`).then((response) => {
          let goodsList = response.data;
          goodsList = (goodsList !== null && goodsList !== '') ? goodsList : [];

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ goodsList, successData });
          }
          // }, 2500);
        });
      });
    },
    getPurchaseList(store) {
      return new Promise((resolve, rejected) => {
        // setTimeout(() => {
        // let purchaseList = JSON.parse(localStorage.getItem('purchase'));

        const errorData = {
          text: 'Ошибка получения закупок!',
        };
        const successData = {
          text: 'Закупки получены!',
        };

        axios.get(`${store.state.apiSrc}purchase/list.php`).then((response) => {
          let purchaseList = response.data;
          purchaseList = (purchaseList !== null && purchaseList !== '') ? purchaseList : [];

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ purchaseList, successData });
          }
        });
        // }, 2500);
      });
    },
  },
});
