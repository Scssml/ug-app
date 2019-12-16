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
    apiUrl: '/',
    authToken: '',
    authStatus: '',
    authUserGroup: {},
    couriersGps: [],
  },
  getters: {
    isAuthenticated: state => !!state.authToken,
    authStatus: state => state.authStatus,
    getAuthUser: state => state.authUser,
    getAuthUserGroup: state => state.authUserGroup,
    getCouriersGps: state => state.couriersGps,
  },
  mutations: {
    authRequest: (state) => {
      state.authStatus = 'loading';
    },
    authSuccess: (state, { token, id, group }) => {
      state.authStatus = 'success';
      state.authToken = token;
      state.authUser = id;
      state.authUserGroup = group;
    },
    authError: (state) => {
      state.authStatus = 'error';
    },
    authLogout: (state) => {
      state.authStatus = '';
      state.authToken = '';
      state.authUser = 0;
      state.authUserGroup = {};
    },
    setCouriersGps: (state, couriersGpsList) => {
      state.couriersGps = couriersGpsList;
    },
  },
  actions: {
    login({ state, commit }, user) {
      return new Promise((resolve, rejected) => {
        commit('authRequest');
        axios.post(
          `${state.apiUrl}login/new`,
          user,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ).then((response) => {
          const token = response.data.jwtToken;
          const { id, group } = response.data.userInfo;
          localStorage.setItem('user-token', token);
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;

          localStorage.setItem('user-id', id);
          localStorage.setItem('user-group', JSON.stringify(group));

          commit('authSuccess', { token, id, group });

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
        localStorage.removeItem('user-id');
        localStorage.removeItem('user-group');
        delete axios.defaults.headers.common.Authorization;
        resolve();
      });
    },
    autoAuth({ commit }) {
      return new Promise((resolve, rejected) => {
        const token = localStorage.getItem('user-token');
        const id = +localStorage.getItem('user-id');
        const group = JSON.parse(localStorage.getItem('user-group'));
        if (token !== null) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          commit('authSuccess', { token, id, group });
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
            filterQuery += (i !== 0) ? '&' : '';
            if (Array.isArray(values[i])) {
              for (let j = 0; j < values[i].length; j += 1) {
                filterQuery += (j !== 0) ? '&' : '';

                if (keys[i] === 'creationDate' || keys[i] === 'deliveryDate') {
                  filterQuery += `filter[${keys[i]}][btw][]=${values[i][j]}`;
                } else {
                  filterQuery += `filter[${keys[i]}][]=${values[i][j]}`;
                }
              }
            } else {
              filterQuery += `filter[${keys[i]}]=${values[i]}`;
            }
          }
        }

        let sortQuery = '';
        if (item.sort !== undefined) {
          const keysSort = Object.keys(item.sort);
          const valSort = Object.values(item.sort);
          for (let i = 0; i < keysSort.length; i += 1) {
            sortQuery += `&sort[${keysSort[i]}]=${valSort[i]}`;
          }
        }

        axios.get(url + filterQuery + sortQuery).then((response) => {
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
        console.log(item.data);
        axios.get(url, {
          params: item.params,
        }).then((response) => {
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
    addItem({ state, dispatch }, item) {
      return new Promise((resolve, rejected) => {
        const url = `${state.apiUrl}${item.type}`;
        axios.post(
          url,
          item.props,
        ).then((response) => {
          resolve(response.data);
        }).catch((error) => {
          if (error.response.status === 401) {
            dispatch('logout');
            router.push('/login');
          }
          rejected();
        });
      });
    },
    updateItem({ state, dispatch }, item) {
      const url = `${state.apiUrl}${item.type}/${item.id}`;
      return new Promise((resolve, rejected) => {
        axios.put(
          url,
          item.props,
        ).then(() => {
          resolve();
        }).catch((error) => {
          if (error.response.status === 401) {
            dispatch('logout');
            router.push('/login');
          }
          rejected();
        });
      });
    },
    deleteItem({ state, dispatch }, item) {
      const url = `${state.apiUrl}${item.type}/${item.id}`;
      return new Promise((resolve, rejected) => {
        axios.delete(
          url,
          {
            data: item.props,
          },
        ).then(() => {
          resolve();
        }).catch((error) => {
          if (error.response.status === 401) {
            dispatch('logout');
            router.push('/login');
          }
          rejected();
        });
      });
    },

    courierDelivered({ dispatch }, item) {
      const url = `http://192.168.4.161:3001/${item.type}/${item.id}`;
      return new Promise((resolve, rejected) => {
        axios.put(
          url,
          item.props,
        ).then(() => {
          resolve();
        }).catch((error) => {
          if (error.response.status === 401) {
            dispatch('logout');
            router.push('/login');
          }
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
