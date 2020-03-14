import nanoId from 'nanoid';
import { getField, updateField } from 'vuex-map-fields';

import * as MutationTypes from './mutation-types';

const initialCardState = () => ({
  id: nanoId(),
  floristId: null,
  client: null,
  orderId: null,
  bouquetId: null,
  decorPercent: 20,
  prepayment: 0,
  goodsCost: 0,
  deliveryCost: 0,
  comment: '',
  decorCost: 0,
  additionalDecorCost: 0,
  discountPercent: 0,
  discountCost: 0,
  totalCost: 0,
  bouquetCount: 1,
  selectedGoods: [],
  isChecked: false,
});

export const BouquetCardsStore = {
  state: {
    cards: [],
  },
  getters: {
    getField,
  },

  mutations: {
    updateField,
    [MutationTypes.ADD_BOUQUET_CARD]: state => {
      state.cards.push(initialCardState());
    },
    [MutationTypes.CHANGE_BOUQUET_CARD]: (state, { id, ...props }) => {
      const cardIndex = state.cards.findIndex(card => card.id === id);
      state.cards = [...state.categories.map(c => c.id !== id), category];
      state.cards[cardIndex] = {
        ...state.cards[cardIndex],
        ...props,
      };
      console.log(state.cards[cardIndex]);
    },
  },
};
