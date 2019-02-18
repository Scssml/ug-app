import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router';

Vue.use(Vuex);

// axios.interceptors.response.use(undefined, err =>
//   new Promise((resolve) => {
//     if (err.response.status === 401) {
//       this.$store.dispatch('logout');
//       router.push('/login');
//       console.log(err.response);
//       resolve();
//     }
//     throw err;
//   }));

export default new Vuex.Store({
  state: {
    authUser: 0,
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
    authSuccess: (state, { token, id }) => {
      state.authStatus = 'success';
      state.authToken = token;
      state.authUser = id;
    },
    authError: (state) => {
      state.authStatus = 'error';
    },
    authLogout: (state) => {
      state.authStatus = '';
      state.authToken = '';
      state.authUser = 0;
    },
  },
  actions: {
    login({ state, commit, dispatch }, user) {
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

          const itemParams = {
            type: 'users',
            filter: {
              login: user.login,
            },
          };

          dispatch('getItemsList', itemParams).then((users) => {
            const { id } = users[0];
            localStorage.setItem('user-id', id);
            commit('authSuccess', { token, id });
            resolve(response);
          });
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
        localStorage.removeItem('user-id');
        delete axios.defaults.headers.common.Authorization;
        resolve();
      });
    },
    autoAuth({ commit }) {
      return new Promise((resolve, rejected) => {
        const token = localStorage.getItem('user-token');
        const id = +localStorage.getItem('user-id');
        if (token !== null) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          commit('authSuccess', { token, id });
          resolve();
        } else {
          rejected();
        }
      });
    },

    getItemsList({ state, dispatch }, item) {
      return new Promise((resolve, rejected) => {
        const url = `${state.apiUrl}${item.type}`;

        let filterQuery = '?';
        if (item.filter !== undefined) {
          const keys = Object.keys(item.filter);
          const values = Object.values(item.filter);
          for (let i = 0; i < keys.length; i += 1) {
            filterQuery += `filter[${keys[i]}]=${values[i]}`;
          }
        }

        axios.get(url + filterQuery).then((response) => {
          const elemList = response.data;
          resolve(elemList);
        }).catch((error) => {
          if (error.response.status === 401) {
            dispatch('logout');
            router.push('/login');
          }
          rejected();
        });
      });
    },
    getItem({ state, dispatch }, item) {
      return new Promise((resolve, rejected) => {
        const url = `${state.apiUrl}${item.type}/${item.id}`;

        axios.get(url).then((response) => {
          const elem = response.data;
          resolve(elem);
        }).catch((error) => {
          if (error.response.status === 401) {
            dispatch('logout');
            router.push('/login');
          }
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
        ).then((response) => {
          resolve(response.data);
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
