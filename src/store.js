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
  },
  {
    name: 'Клиент 2',
    id: 2,
    bill: 5000,
    sale: 7,
    active: 1,
  },
  {
    name: 'Клиент 3',
    id: 3,
    bill: 0,
    sale: 0,
    active: 1,
  },
  {
    name: 'Клиент 4',
    id: 4,
    bill: 10000,
    sale: 0,
    active: 1,
  },
  {
    name: 'Клиент 5',
    id: 5,
    bill: 9000,
    sale: 20,
    active: 1,
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
    client: 2,
    id: 214,
  },
  {
    client: 1,
    id: 215,
  },
  {
    client: 5,
    id: 216,
  },
  {
    client: 5,
    id: 217,
  },
  {
    client: 4,
    id: 218,
  },
  {
    client: 1,
    id: 219,
  },
  {
    client: 2,
    id: 220,
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
    id: 1,
    type: 'Эквадор',
    price: 100,
    store: 351,
  },
  {
    name: 'Цветок 12',
    id: 2,
    type: 'Эквадор',
    price: 90,
    store: 251,
  },
  {
    name: 'Цветок 13',
    id: 3,
    type: 'Эквадор',
    price: 45,
    store: 84,
  },
  {
    name: 'Цветок 14',
    id: 4,
    type: 'Эквадор',
    price: 120,
    store: 516,
  },
  {
    name: 'Цветок 15',
    id: 5,
    type: 'Эквадор',
    price: 86,
    store: 54,
  },
  {
    name: 'Цветок 16',
    id: 6,
    type: 'Эквадор',
    price: 110,
    store: 842,
  },
  {
    name: 'Цветок 17',
    id: 7,
    type: 'Эквадор',
    price: 140,
    store: 420,
  },
  {
    name: 'Цветок 18',
    id: 8,
    type: 'Эквадор',
    price: 62,
    store: 521,
  },
  {
    name: 'Цветок 19',
    id: 9,
    type: 'Эквадор',
    price: 82,
    store: 125,
  },
  {
    name: 'Цветок 20',
    id: 10,
    type: 'Эквадор',
    price: 94,
    store: 264,
  },
  {
    name: 'Цветок 21',
    id: 1,
    type: 'Эквадор',
    price: 100,
    store: 351,
  },
  {
    name: 'Цветок 22',
    id: 2,
    type: 'Эквадор',
    price: 90,
    store: 251,
  },
  {
    name: 'Цветок 23',
    id: 3,
    type: 'Эквадор',
    price: 45,
    store: 84,
  },
  {
    name: 'Цветок 24',
    id: 4,
    type: 'Эквадор',
    price: 120,
    store: 516,
  },
  {
    name: 'Цветок 25',
    id: 5,
    type: 'Эквадор',
    price: 86,
    store: 54,
  },
  {
    name: 'Цветок 26',
    id: 6,
    type: 'Эквадор',
    price: 110,
    store: 842,
  },
  {
    name: 'Цветок 27',
    id: 7,
    type: 'Эквадор',
    price: 140,
    store: 420,
  },
  {
    name: 'Цветок 28',
    id: 8,
    type: 'Эквадор',
    price: 62,
    store: 521,
  },
  {
    name: 'Цветок 29',
    id: 9,
    type: 'Эквадор',
    price: 82,
    store: 125,
  },
  {
    name: 'Цветок 30',
    id: 10,
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
