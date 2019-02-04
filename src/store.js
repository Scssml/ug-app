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

// const clientsListResponse = [
//   {
//     name: 'Клиент 1',
//     id: 1,
//     bill: 2000,
//     sale: 10,
//     active: 1,
//     phone: '8 (999) 999-99-99',
//     birthDay: '01.01.2018',
//   },
//   {
//     name: 'Клиент 2',
//     id: 2,
//     bill: 5000,
//     sale: 7,
//     active: 1,
//     phone: '8 (888) 999-99-99',
//     birthDay: '01.01.2018',
//   },
//   {
//     name: 'Клиент 3',
//     id: 3,
//     bill: 0,
//     sale: 0,
//     active: 1,
//     phone: '8 (777) 999-99-99',
//     birthDay: '01.01.2018',
//   },
//   {
//     name: 'Клиент 4',
//     id: 4,
//     bill: 10000,
//     sale: 0,
//     active: 1,
//     phone: '8 (555) 999-99-99',
//     birthDay: '01.01.2018',
//   },
//   {
//     name: 'Клиент 5',
//     id: 5,
//     bill: 9000,
//     sale: 20,
//     active: 1,
//     phone: '8 (444) 999-99-99',
//     birthDay: '01.01.2018',
//   },
// ];

// const floristsListResponse = [
//   {
//     name: 'Флорист 1',
//     id: 1,
//     active: 1,
//   },
//   {
//     name: 'Флорист 2',
//     id: 2,
//     active: 1,
//   },
//   {
//     name: 'Флорист 3',
//     id: 3,
//     active: 1,
//   },
// ];

// const ordersListResponse = [
//   {
//     id: 214,
//     date: '2018-09-10',
//     client: 2,
//     phone: '8 (999) 999 99 99',
//     courier: 'Курьер1',
//     deliveryDate: '2018-09-15',
//     deliveryTime: '09:00-11:00',
//     delivered: false,
//     kto: 'Менеджер 1',
//     ts: '',
//     dp: '',
//     orderText: 'Розы 15шт',
//     sum: 2500,
//     addresseeName: 'Иван Иванов',
//     addresseePhone: '8 (777) 777 77 77',
//     address: 'ул. Самарская д. 2',
//     status: 2,
//     delivery: 2,
//   },
//   {
//     id: 215,
//     date: '2018-09-20',
//     client: 1,
//     phone: '8 (999) 999 99 99',
//     courier: 'Курьер1',
//     deliveryDate: '2018-09-20',
//     deliveryTime: '09:00-11:00',
//     delivered: false,
//     kto: 'Менеджер 1',
//     ts: '',
//     dp: '',
//     orderText: 'Розы 15шт',
//     sum: 2500,
//     addresseeName: 'Иван Иванов',
//     addresseePhone: '8 (777) 777 77 77',
//     address: 'ул. Самарская д. 2',
//     status: 4,
//     delivery: 2,
//   },
//   {
//     id: 216,
//     date: '2018-09-10',
//     client: 5,
//     phone: '8 (999) 999 99 99',
//     courier: 'Курьер1',
//     deliveryDate: '2018-09-15',
//     deliveryTime: '09:00-11:00',
//     delivered: false,
//     kto: 'Менеджер 2',
//     ts: '',
//     dp: '',
//     orderText: 'Розы 15шт',
//     sum: 2500,
//     addresseeName: 'Иван Иванов',
//     addresseePhone: '8 (777) 777 77 77',
//     address: 'ул. Самарская д. 2',
//     status: 1,
//     delivery: 1,
//   },
//   {
//     id: 217,
//     date: '2018-09-10',
//     client: 5,
//     phone: '8 (999) 999 99 99',
//     courier: 'Курьер1',
//     deliveryDate: '2018-09-10',
//     deliveryTime: '09:00-11:00',
//     delivered: false,
//     kto: 'Менеджер 1',
//     ts: '',
//     dp: '',
//     orderText: 'Розы 15шт',
//     sum: 2500,
//     addresseeName: 'Иван Иванов',
//     addresseePhone: '8 (777) 777 77 77',
//     address: 'ул. Самарская д. 2',
//     status: 4,
//     delivery: 1,
//   },
//   {
//     id: 218,
//     date: '2018-09-10',
//     client: 4,
//     phone: '8 (999) 999 99 99',
//     courier: 'Курьер1',
//     deliveryDate: '2018-09-15',
//     deliveryTime: '09:00-11:00',
//     delivered: false,
//     kto: 'Менеджер 1',
//     ts: '',
//     dp: '',
//     orderText: 'Розы 15шт',
//     sum: 2500,
//     addresseeName: 'Иван Иванов',
//     addresseePhone: '8 (777) 777 77 77',
//     address: 'ул. Самарская д. 2',
//     status: 3,
//     delivery: 2,
//   },
//   {
//     id: 219,
//     date: '2018-09-10',
//     client: 1,
//     phone: '8 (999) 999 99 99',
//     courier: 'Курьер1',
//     deliveryDate: '2018-09-15',
//     deliveryTime: '09:00-11:00',
//     delivered: false,
//     kto: 'Менеджер 1',
//     ts: '',
//     dp: '',
//     orderText: 'Розы 15шт',
//     sum: 2500,
//     addresseeName: 'Иван Иванов',
//     addresseePhone: '8 (777) 777 77 77',
//     address: 'ул. Самарская д. 2',
//     status: 2,
//     delivery: 2,
//   },
//   {
//     id: 220,
//     date: '2018-209-10',
//     client: 2,
//     phone: '8 (999) 999 99 99',
//     courier: 'Курьер1',
//     deliveryDate: '2018-09-15',
//     deliveryTime: '09:00-11:00',
//     delivered: false,
//     kto: 'Менеджер 1',
//     ts: '',
//     dp: '',
//     orderText: 'Розы 15шт',
//     sum: 2500,
//     addresseeName: 'Иван Иванов',
//     addresseePhone: '8 (777) 777 77 77',
//     address: 'ул. Самарская д. 2',
//     status: 1,
//     delivery: 1,
//   },
// ];

// const goodsListResponse = [
//   {
//     name: 'Цветок 1',
//     id: 1,
//     type: 'Эквадор',
//     price: 100,
//     store: 351,
//   },
//   {
//     name: 'Цветок 2',
//     id: 2,
//     type: 'Эквадор',
//     price: 90,
//     store: 251,
//   },
//   {
//     name: 'Цветок 3',
//     id: 3,
//     type: 'Эквадор',
//     price: 45,
//     store: 84,
//   },
//   {
//     name: 'Цветок 4',
//     id: 4,
//     type: 'Эквадор',
//     price: 120,
//     store: 516,
//   },
//   {
//     name: 'Цветок 5',
//     id: 5,
//     type: 'Эквадор',
//     price: 86,
//     store: 54,
//   },
// ];

// const bouquetsListResponse = [
//   {
//     id: 1,
//     date: '09.11.2018',
//     florist: 2,
//     user: 2,
//     client: 4,
//     order: 218,
//     sum: 5000,
//     decorPersent: 10,
//     sumDecor: 500,
//     delivery: 200,
//     salePersent: 0,
//     sumSale: 0,
//     sumPay: 5000,
//     typePay: 'Нал',
//     goods: [
//       {
//         id: 5,
//         count: 4,
//       },
//       {
//         id: 7,
//         count: 3,
//       },
//     ],
//   },
//   {
//     id: 2,
//     date: '11.11.2018',
//     florist: 2,
//     user: 2,
//     client: 4,
//     order: 218,
//     sum: 5000,
//     decorPersent: 10,
//     sumDecor: 500,
//     delivery: 200,
//     salePersent: 0,
//     sumSale: 0,
//     sumPay: 5000,
//     typePay: 'Безнал',
//     goods: [
//       {
//         id: 5,
//         count: 4,
//       },
//       {
//         id: 7,
//         count: 3,
//       },
//     ],
//   },
//   {
//     id: 3,
//     date: '12.11.2018',
//     florist: 2,
//     user: 2,
//     client: 4,
//     order: 218,
//     sum: 5000,
//     decorPersent: 10,
//     sumDecor: 500,
//     delivery: 200,
//     salePersent: 0,
//     sumSale: 0,
//     sumPay: 5000,
//     typePay: 'Нал',
//     goods: [
//       {
//         id: 5,
//         count: 4,
//       },
//       {
//         id: 7,
//         count: 3,
//       },
//     ],
//   },
// ];

export default new Vuex.Store({
  state: {
    authUser: 2,
    apiSrc: 'http://ug-app.cq58583.tmweb.ru/api/',
  },
  mutations: {

  },
  actions: {
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

        axios.get(`${store.state.apiSrc}bouquets/list.php`).then((response) => {
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

        axios.get(`${store.state.apiSrc}clients/list.php`).then((response) => {
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

        axios.get(`${store.state.apiSrc}florists/list.php`).then((response) => {
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

        axios.get(`${store.state.apiSrc}couriers/list.php`).then((response) => {
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

        axios.get(`${store.state.apiSrc}orders/list.php`).then((response) => {
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

        axios.get(`${store.state.apiSrc}orders/list.php`).then((response) => {
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

        axios.get(`${store.state.apiSrc}goods/list.php`).then((response) => {
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
