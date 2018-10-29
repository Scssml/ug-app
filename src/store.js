import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const clientsList = [
  {
    name: 'Клиент 1',
    id: 1,
  },
  {
    name: 'Клиент 2',
    id: 2,
  },
  {
    name: 'Клиент 3',
    id: 3,
  },
  {
    name: 'Клиент 4',
    id: 4,
  },
  {
    name: 'Клиент 5',
    id: 5,
  },
];

const floristsList = [
  {
    name: 'Флорист 1',
    id: 1,
  },
  {
    name: 'Флорист 2',
    id: 2,
  },
  {
    name: 'Флорист 3',
    id: 3,
  },
];

const ordersList = [
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

const goodsList = [
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
];

export default new Vuex.Store({
  state: {
    ClientsList: clientsList,
    Floristslist: floristsList,
    Orderslist: ordersList,
    GoodsList: goodsList,
  },
  mutations: {

  },
  actions: {

  },
});
