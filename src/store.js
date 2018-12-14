import Vue from 'vue';
import Vuex from 'vuex';

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
    active: 1,
    groups: [1],
  },
  {
    name: 'Менеджер 1',
    id: 2,
    active: 1,
    groups: [2],
  },
  {
    name: 'Менеджер 2',
    id: 3,
    active: 1,
    groups: [2],
  },
];

const clientsListResponse = [
  {
    name: 'Клиент 1',
    id: 1,
    bill: 2000,
    sale: 10,
    active: 1,
    phone: '8 (999) 999-99-99',
    birthDay: '01.01.2018',
  },
  {
    name: 'Клиент 2',
    id: 2,
    bill: 5000,
    sale: 7,
    active: 1,
    phone: '8 (888) 999-99-99',
    birthDay: '01.01.2018',
  },
  {
    name: 'Клиент 3',
    id: 3,
    bill: 0,
    sale: 0,
    active: 1,
    phone: '8 (777) 999-99-99',
    birthDay: '01.01.2018',
  },
  {
    name: 'Клиент 4',
    id: 4,
    bill: 10000,
    sale: 0,
    active: 1,
    phone: '8 (555) 999-99-99',
    birthDay: '01.01.2018',
  },
  {
    name: 'Клиент 5',
    id: 5,
    bill: 9000,
    sale: 20,
    active: 1,
    phone: '8 (444) 999-99-99',
    birthDay: '01.01.2018',
  },
];

const floristsListResponse = [
  {
    name: 'Флорист 1',
    id: 1,
    active: 1,
  },
  {
    name: 'Флорист 2',
    id: 2,
    active: 1,
  },
  {
    name: 'Флорист 3',
    id: 3,
    active: 1,
  },
];

const ordersListResponse = [
  {
    id: 214,
    date: '2018-09-10',
    client: 2,
    phone: '8 (999) 999 99 99',
    courier: 'Курьер1',
    deliveryDate: '2018-09-15',
    deliveryTime: '09:00-11:00',
    delivered: false,
    kto: 'Менеджер 1',
    ts: '',
    dp: '',
    orderText: 'Розы 15шт',
    sum: 2500,
    addresseeName: 'Иван Иванов',
    addresseePhone: '8 (777) 777 77 77',
    address: 'ул. Самарская д. 2',
    status: 2,
    delivery: 2,
  },
  {
    id: 215,
    date: '2018-09-20',
    client: 1,
    phone: '8 (999) 999 99 99',
    courier: 'Курьер1',
    deliveryDate: '2018-09-20',
    deliveryTime: '09:00-11:00',
    delivered: false,
    kto: 'Менеджер 1',
    ts: '',
    dp: '',
    orderText: 'Розы 15шт',
    sum: 2500,
    addresseeName: 'Иван Иванов',
    addresseePhone: '8 (777) 777 77 77',
    address: 'ул. Самарская д. 2',
    status: 4,
    delivery: 2,
  },
  {
    id: 216,
    date: '2018-09-10',
    client: 5,
    phone: '8 (999) 999 99 99',
    courier: 'Курьер1',
    deliveryDate: '2018-09-15',
    deliveryTime: '09:00-11:00',
    delivered: false,
    kto: 'Менеджер 2',
    ts: '',
    dp: '',
    orderText: 'Розы 15шт',
    sum: 2500,
    addresseeName: 'Иван Иванов',
    addresseePhone: '8 (777) 777 77 77',
    address: 'ул. Самарская д. 2',
    status: 1,
    delivery: 1,
  },
  {
    id: 217,
    date: '2018-09-10',
    client: 5,
    phone: '8 (999) 999 99 99',
    courier: 'Курьер1',
    deliveryDate: '2018-09-10',
    deliveryTime: '09:00-11:00',
    delivered: false,
    kto: 'Менеджер 1',
    ts: '',
    dp: '',
    orderText: 'Розы 15шт',
    sum: 2500,
    addresseeName: 'Иван Иванов',
    addresseePhone: '8 (777) 777 77 77',
    address: 'ул. Самарская д. 2',
    status: 4,
    delivery: 1,
  },
  {
    id: 218,
    date: '2018-09-10',
    client: 4,
    phone: '8 (999) 999 99 99',
    courier: 'Курьер1',
    deliveryDate: '2018-09-15',
    deliveryTime: '09:00-11:00',
    delivered: false,
    kto: 'Менеджер 1',
    ts: '',
    dp: '',
    orderText: 'Розы 15шт',
    sum: 2500,
    addresseeName: 'Иван Иванов',
    addresseePhone: '8 (777) 777 77 77',
    address: 'ул. Самарская д. 2',
    status: 3,
    delivery: 2,
  },
  {
    id: 219,
    date: '2018-09-10',
    client: 1,
    phone: '8 (999) 999 99 99',
    courier: 'Курьер1',
    deliveryDate: '2018-09-15',
    deliveryTime: '09:00-11:00',
    delivered: false,
    kto: 'Менеджер 1',
    ts: '',
    dp: '',
    orderText: 'Розы 15шт',
    sum: 2500,
    addresseeName: 'Иван Иванов',
    addresseePhone: '8 (777) 777 77 77',
    address: 'ул. Самарская д. 2',
    status: 2,
    delivery: 2,
  },
  {
    id: 220,
    date: '2018-209-10',
    client: 2,
    phone: '8 (999) 999 99 99',
    courier: 'Курьер1',
    deliveryDate: '2018-09-15',
    deliveryTime: '09:00-11:00',
    delivered: false,
    kto: 'Менеджер 1',
    ts: '',
    dp: '',
    orderText: 'Розы 15шт',
    sum: 2500,
    addresseeName: 'Иван Иванов',
    addresseePhone: '8 (777) 777 77 77',
    address: 'ул. Самарская д. 2',
    status: 1,
    delivery: 1,
  },
];

const goodsListResponse = [
  {
    name: 'Цветок 1',
    id: 1,
    type: 'Эквадор',
    price: 100,
    store: 351,
  },
  {
    name: 'Цветок 2',
    id: 2,
    type: 'Эквадор',
    price: 90,
    store: 251,
  },
  {
    name: 'Цветок 3',
    id: 3,
    type: 'Эквадор',
    price: 45,
    store: 84,
  },
  {
    name: 'Цветок 4',
    id: 4,
    type: 'Эквадор',
    price: 120,
    store: 516,
  },
  {
    name: 'Цветок 5',
    id: 5,
    type: 'Эквадор',
    price: 86,
    store: 54,
  },
  {
    name: 'Цветок 6',
    id: 6,
    type: 'Эквадор',
    price: 110,
    store: 842,
  },
  {
    name: 'Цветок 7',
    id: 7,
    type: 'Эквадор',
    price: 140,
    store: 420,
  },
  {
    name: 'Цветок 8',
    id: 8,
    type: 'Эквадор',
    price: 62,
    store: 521,
  },
  {
    name: 'Цветок 9',
    id: 9,
    type: 'Эквадор',
    price: 82,
    store: 125,
  },
  {
    name: 'Цветок 10',
    id: 10,
    type: 'Эквадор',
    price: 94,
    store: 264,
  },
  {
    name: 'Цветок 11',
    id: 11,
    type: 'Эквадор',
    price: 100,
    store: 351,
  },
  {
    name: 'Цветок 12',
    id: 12,
    type: 'Эквадор',
    price: 90,
    store: 251,
  },
  {
    name: 'Цветок 13',
    id: 13,
    type: 'Эквадор',
    price: 45,
    store: 84,
  },
  {
    name: 'Цветок 14',
    id: 14,
    type: 'Эквадор',
    price: 120,
    store: 516,
  },
  {
    name: 'Цветок 15',
    id: 15,
    type: 'Эквадор',
    price: 86,
    store: 54,
  },
  {
    name: 'Цветок 16',
    id: 16,
    type: 'Эквадор',
    price: 110,
    store: 842,
  },
  {
    name: 'Цветок 17',
    id: 17,
    type: 'Эквадор',
    price: 140,
    store: 420,
  },
  {
    name: 'Цветок 18',
    id: 18,
    type: 'Эквадор',
    price: 62,
    store: 521,
  },
  {
    name: 'Цветок 19',
    id: 19,
    type: 'Эквадор',
    price: 82,
    store: 125,
  },
  {
    name: 'Цветок 20',
    id: 20,
    type: 'Эквадор',
    price: 94,
    store: 264,
  },
  {
    name: 'Цветок 21',
    id: 21,
    type: 'Эквадор',
    price: 100,
    store: 351,
  },
  {
    name: 'Цветок 22',
    id: 22,
    type: 'Эквадор',
    price: 90,
    store: 251,
  },
  {
    name: 'Цветок 23',
    id: 23,
    type: 'Эквадор',
    price: 45,
    store: 84,
  },
  {
    name: 'Цветок 24',
    id: 24,
    type: 'Эквадор',
    price: 120,
    store: 516,
  },
  {
    name: 'Цветок 25',
    id: 25,
    type: 'Эквадор',
    price: 86,
    store: 54,
  },
  {
    name: 'Цветок 26',
    id: 26,
    type: 'Эквадор',
    price: 110,
    store: 842,
  },
  {
    name: 'Цветок 27',
    id: 27,
    type: 'Эквадор',
    price: 140,
    store: 420,
  },
  {
    name: 'Цветок 28',
    id: 28,
    type: 'Эквадор',
    price: 62,
    store: 521,
  },
  {
    name: 'Цветок 29',
    id: 29,
    type: 'Эквадор',
    price: 82,
    store: 125,
  },
  {
    name: 'Цветок 30',
    id: 30,
    type: 'Эквадор',
    price: 94,
    store: 264,
  },
];

const bouquetsListResponse = [
  {
    id: 1,
    date: '09.11.2018',
    florist: 2,
    user: 2,
    client: 4,
    order: 218,
    sum: 5000,
    decorPersent: 10,
    sumDecor: 500,
    delivery: 200,
    salePersent: 0,
    sumSale: 0,
    sumPay: 5000,
    typePay: 'Нал',
    goods: [
      {
        id: 5,
        count: 4,
      },
      {
        id: 7,
        count: 3,
      },
    ],
  },
  {
    id: 2,
    date: '11.11.2018',
    florist: 2,
    user: 2,
    client: 4,
    order: 218,
    sum: 5000,
    decorPersent: 10,
    sumDecor: 500,
    delivery: 200,
    salePersent: 0,
    sumSale: 0,
    sumPay: 5000,
    typePay: 'Безнал',
    goods: [
      {
        id: 5,
        count: 4,
      },
      {
        id: 7,
        count: 3,
      },
    ],
  },
  {
    id: 3,
    date: '12.11.2018',
    florist: 2,
    user: 2,
    client: 4,
    order: 218,
    sum: 5000,
    decorPersent: 10,
    sumDecor: 500,
    delivery: 200,
    salePersent: 0,
    sumSale: 0,
    sumPay: 5000,
    typePay: 'Нал',
    goods: [
      {
        id: 5,
        count: 4,
      },
      {
        id: 7,
        count: 3,
      },
    ],
  },
];

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
    getUsersList() {
      return new Promise((resolve, rejected) => {
        setTimeout(() => {
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
        }, 1000);
      });
    },
    getUsersGroupsList() {
      return new Promise((resolve, rejected) => {
        setTimeout(() => {
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
        }, 1500);
      });
    },
    getBouquetsList() {
      return new Promise((resolve, rejected) => {
        setTimeout(() => {
          const bouquetsList = bouquetsListResponse;
          const errorData = {
            text: 'Ошибка получения букетов!',
          };
          const successData = {
            text: 'Букеты получены!',
          };

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ bouquetsList, successData });
          }
        }, 1500);
      });
    },
    getClientsList() {
      return new Promise((resolve, rejected) => {
        setTimeout(() => {
          const clientsList = clientsListResponse;
          const errorData = {
            text: 'Ошибка получения клиентов!',
          };
          const successData = {
            text: 'Клиенты получены!',
          };

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ clientsList, successData });
          }
        }, 1000);
      });
    },
    getFloristsList() {
      return new Promise((resolve, rejected) => {
        setTimeout(() => {
          const floristsList = floristsListResponse;
          const errorData = {
            text: 'Ошибка получения флористов!',
          };
          const successData = {
            text: 'Флористы получены!',
          };

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ floristsList, successData });
          }
        }, 1500);
      });
    },
    getOrdersList() {
      return new Promise((resolve, rejected) => {
        setTimeout(() => {
          const ordersList = ordersListResponse;
          const errorData = {
            text: 'Ошибка получения заказов!',
          };
          const successData = {
            text: 'Заказы получены!',
          };

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ ordersList, successData });
          }
        }, 2000);
      });
    },
    getGoodsList() {
      return new Promise((resolve, rejected) => {
        setTimeout(() => {
          const goodsList = goodsListResponse;
          const errorData = {
            text: 'Ошибка получения товаров!',
          };
          const successData = {
            text: 'Товары получены!',
          };

          const error = false;
          if (error) {
            rejected(errorData);
          } else {
            resolve({ goodsList, successData });
          }
        }, 2500);
      });
    },
  },
});
