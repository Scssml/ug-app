import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router';

Vue.use(Vuex);

axios.interceptors.response.use(undefined, err =>
  new Promise((resolve) => {
    if (err.status === 401) {
      this.$store.dispatch('logout');
      router.push('/login');
      console.log(router);
      resolve();
    }
    throw err;
  }));

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
    authLogout: (state) => {
      state.authStatus = '';
      state.authToken = '';
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
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('authLogout');
        localStorage.removeItem('user-token');
        delete axios.defaults.headers.common.Authorization;
        resolve();
      });
    },
    autoAuth({ commit }) {
      return new Promise((resolve, rejected) => {
        const token = localStorage.getItem('user-token');
        if (token !== null) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          commit('authSuccess', token);
          resolve();
        } else {
          rejected();
        }
      });
    },

    getItemsList({ state }, item) {
      return new Promise((resolve, rejected) => {
        const url = `${state.apiUrl}${item.type}`;
        axios.get(url).then((response) => {
          const elemList = response.data;
          resolve(elemList);
        }).catch(() => {
          rejected();
        });
      });
    },
    addItem({ state }, item) {
      return new Promise((resolve, rejected) => {
        const url = `${state.apiUrl}${item.type}`;
        axios.post(
          url,
          item.props,
        ).then(() => {
          resolve();
        }).catch(() => {
          rejected();
        });
      });
    },
    updateItem({ state }, item) {
      const url = `${state.apiUrl}${item.type}/${item.id}`;
      return new Promise((resolve, rejected) => {
        axios.put(
          url,
          item.props,
        ).then(() => {
          resolve();
        }).catch(() => {
          rejected();
        });
      });
    },
    deleteItem({ state }, item) {
      const url = `${state.apiUrl}${item.type}/${item.id}`;
      return new Promise((resolve, rejected) => {
        axios.delete(url).then(() => {
          resolve();
        }).catch(() => {
          rejected();
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
