import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "./router";

axios.defaults.baseURL = process.env.VUE_APP_API_PREFIX;

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
    apiUrl: "/",
    authToken: "",
    authStatus: "",
    authUserGroup: {},
    couriersGps: [],
    deliveryZones: [],
    updateOrderList: false,
    countElemPage: 20,
    purchaseFilter: {
      startDate: null,
      endDate: null,
      type: null,
      search: null,
      goodId: null
    },
    showGoodsList: [],
    orderFilter: {},
    orderSort: {}
  },
  getters: {
    isAuthenticated: state => !!state.authToken,
    authStatus: state => state.authStatus,
    getAuthUser: state => state.authUser,
    getAuthUserGroup: state => state.authUserGroup,
    getCouriersGps: state => state.couriersGps,
    getDeliveryZones: state => state.deliveryZones,
    getUpdateOrderList: state => state.updateOrderList,
    getCountElemPage: state => state.countElemPage,
    getShowGoodsList: state => state.showGoodsList,
    getOrderFilter: state => state.orderFilter,
    getOrderSort: state => state.orderSort
  },
  mutations: {
    authRequest: state => {
      state.authStatus = "loading";
    },
    authSuccess: (state, { token, id, group }) => {
      state.authStatus = "success";
      state.authToken = token;
      state.authUser = id;
      state.authUserGroup = group;
    },
    authError: state => {
      state.authStatus = "error";
    },
    authLogout: state => {
      state.authStatus = "";
      state.authToken = "";
      state.authUser = 0;
      state.authUserGroup = {};
    },
    setCouriersGps: (state, couriersGpsList) => {
      state.couriersGps = couriersGpsList;
    },
    setDeliveryZones: (state, zones) => {
      state.deliveryZones = zones;
    },
    setUpdateOrderList: (state, value) => {
      state.updateOrderList = value;
    },
    setCountElemPage: (state, value) => {
      state.countElemPage = value;
    },
    setShowGoodsList: (state, value) => {
      state.showGoodsList = value;
    },
    setPurchaseFilter: (state, { filterProp, value }) => {
      state.purchaseFilter[filterProp] = value;
    },
    setOrderFilter: (state, value) => {
      state.orderFilter = value;
    },
    setOrderSort: (state, value) => {
      state.orderSort = value;
    },
    clearPurchaseFilter: state => {
      state.purchaseFilter = {
        startDate: null,
        endDate: null,
        type: null,
        search: null,
        goodId: null
      };
    }
  },
  actions: {
    login({ state, commit }, user) {
      return new Promise((resolve, rejected) => {
        commit("authRequest");
        axios
          .post(`${state.apiUrl}login`, user, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(response => {
            const token = response.data.jwtToken;
            const { id, group } = response.data.userInfo;
            localStorage.setItem("user-token", token);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;

            localStorage.setItem("user-id", id);
            localStorage.setItem("user-group", JSON.stringify(group));

            const countElemPage = localStorage.getItem("countElemPage");
            if (countElemPage !== null) {
              commit("setCountElemPage", countElemPage);
            }

            commit("authSuccess", { token, id, group });

            resolve(response);
          })
          .catch(error => {
            commit("authError", error);
            localStorage.removeItem("user-token");
            rejected(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise(resolve => {
        commit("authLogout");
        localStorage.removeItem("user-token");
        localStorage.removeItem("user-id");
        localStorage.removeItem("user-group");
        delete axios.defaults.headers.common.Authorization;
        resolve();
      });
    },
    autoAuth({ commit }) {
      return new Promise((resolve, rejected) => {
        const token = localStorage.getItem("user-token");
        const id = +localStorage.getItem("user-id");
        const group = JSON.parse(localStorage.getItem("user-group"));

        const countElemPage = localStorage.getItem("countElemPage");
        if (countElemPage !== null) {
          commit("setCountElemPage", countElemPage);
        }

        if (token !== null) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          commit("authSuccess", { token, id, group });
          resolve();
        } else {
          rejected();
        }
      });
    },

    getItemsList({ state, dispatch }, item) {
      return new Promise((resolve, rejected) => {
        const url = `${state.apiUrl}${item.type}`;

        let filterQuery = "?";
        if (item.filter !== undefined) {
          const keys = Object.keys(item.filter);
          const values = Object.values(item.filter);
          for (let i = 0; i < keys.length; i += 1) {
            filterQuery += i !== 0 ? "&" : "";
            if (Array.isArray(values[i])) {
              for (let j = 0; j < values[i].length; j += 1) {
                filterQuery += j !== 0 ? "&" : "";

                if (
                  keys[i] === "creationDate" ||
                  keys[i] === "deliveryDate" ||
                  keys[i] === "purchaseDate" ||
                  keys[i] === "created_at"
                ) {
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

        let sortQuery = "";
        if (item.sort !== undefined) {
          const keysSort = Object.keys(item.sort);
          const valSort = Object.values(item.sort);
          for (let i = 0; i < keysSort.length; i += 1) {
            sortQuery += `&sort[${keysSort[i]}]=${valSort[i]}`;
          }
        }

        let takeQuery = "";
        if (item.take !== undefined) {
          takeQuery = `&take=${item.take}`;
        }

        let skipQuery = "";
        if (item.skip !== undefined) {
          skipQuery = `&skip=${item.skip}`;
        }

        let fullQuery = "";
        fullQuery += filterQuery;
        fullQuery += sortQuery;
        fullQuery += takeQuery;
        fullQuery += skipQuery;

        axios
          .get(url + fullQuery)
          .then(response => {
            const elemList = response.data;
            resolve(elemList);
          })
          .catch(error => {
            if (error.response.status === 401) {
              dispatch("logout");
              router.push("/login");
            }
            rejected();
          });
      });
    },
    getItem({ state, dispatch }, item) {
      return new Promise((resolve, rejected) => {
        const url = `${state.apiUrl}${item.type}/${item.id}`;
        axios
          .get(url, {
            params: item.params
          })
          .then(response => {
            const elem = response.data;
            resolve(elem);
          })
          .catch(error => {
            if (error.response.status === 401) {
              dispatch("logout");
              router.push("/login");
            }
            rejected();
          });
      });
    },
    addItem({ state, dispatch }, item) {
      return new Promise((resolve, rejected) => {
        const url = `${state.apiUrl}${item.type}`;
        axios
          .post(url, item.props)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            if (error.response.status === 401) {
              dispatch("logout");
              router.push("/login");
            }
            rejected(error.response.data);
          });
      });
    },
    updateItem({ state, dispatch }, item) {
      const url = `${state.apiUrl}${item.type}/${item.id}`;
      return new Promise((resolve, rejected) => {
        axios
          .put(url, item.props)
          .then(() => {
            resolve();
          })
          .catch(error => {
            if (error.response.status === 401) {
              dispatch("logout");
              router.push("/login");
            }
            rejected();
          });
      });
    },
    deleteItem({ state, dispatch }, item) {
      const url = `${state.apiUrl}${item.type}/${item.id}`;
      return new Promise((resolve, rejected) => {
        axios
          .delete(url, {
            data: item.props
          })
          .then(() => {
            resolve();
          })
          .catch(error => {
            if (error.response.status === 401) {
              dispatch("logout");
              router.push("/login");
            }
            rejected();
          });
      });
    },

    changePwd({ state, dispatch }, item) {
      const url = `${state.apiUrl}${item.type}/${item.id}/pwd`;
      return new Promise((resolve, rejected) => {
        axios
          .put(url, item.props)
          .then(() => {
            resolve();
          })
          .catch(error => {
            if (error.response.status === 401) {
              dispatch("logout");
              router.push("/login");
            }
            rejected();
          });
      });
    },

    getDeliveryZones({ state, commit }) {
      return new Promise((res, rej) => {
        const url = `${state.apiUrl}delivery-zones`;

        axios
          .get(url)
          .then(({ data }) => {
            commit("setDeliveryZones", data);
            res(data);
          })
          .catch(err => rej(err));
      });
    },

    courierDelivered({ dispatch }, item) {
      const url = `/delivery/${item.type}/${item.id}`;
      return new Promise((resolve, rejected) => {
        axios
          .put(url, item.props)
          .then(() => {
            resolve();
          })
          .catch(error => {
            if (error.response.status === 401) {
              dispatch("logout");
              router.push("/login");
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
          text: "Ошибка получения заказов!"
        };
        const successData = {
          text: "Заказы получены!"
        };

        axios.get(`${store.state.apiUrl}orders`).then(response => {
          let ordersList = response.data;
          ordersList =
            ordersList !== null && ordersList !== "" ? ordersList : [];
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
          text: "Ошибка получения закупок!"
        };
        const successData = {
          text: "Закупки получены!"
        };

        axios.get(`${store.state.apiSrc}purchase/list.php`).then(response => {
          let purchaseList = response.data;
          purchaseList =
            purchaseList !== null && purchaseList !== "" ? purchaseList : [];

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

    getGraphQL({ dispatch }, item) {
      return new Promise((resolve, rejected) => {
        const url = "http://192.168.4.161:7000/v1/graphql";
        axios({
          method: "post",
          url,
          data: item.data
        })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            if (error.response.status === 401) {
              dispatch("logout");
              router.push("/login");
            }
            rejected();
          });
      });
    }
  }
});
