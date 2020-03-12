<template>
  <v-card
    flat
    width="300"
    style="border-left: 1px solid #ccc; font-size: 16px;"
    :class="$route.query.selectOrder === order ? 'selected' : ''"
  >
    <div class="px-0" style="height: 30px;">
      <v-select
        label="Флорист"
        :items="floristsList"
        item-text="name"
        item-value="id"
        solo
        flat
        hide-details
        v-model.number="florist"
        class="scs-small"
        no-data-text="Не найдено"
        @change="updateProps()"
      ></v-select>
    </div>
    <v-divider></v-divider>
    <div class="px-0" style="height: 30px;">
      <autosuggest
        :suggestions="suggestions"
        placeholder="Клиенты"
        :value="autosuggestValue"
        @onChange="onInputChange"
        @onSelect="onSelected"
      >
        <template slot-scope="slotProps">
          <span
            >{{ slotProps.suggestion.item.name }} ({{
              slotProps.suggestion.item.bill
            }})</span
          >
        </template>
      </autosuggest>
    </div>
    <v-divider></v-divider>
    <v-layout row>
      <v-flex xs5>
        <div class="pl-0" style="height: 30px;">
          <v-select
            label="Заказ"
            :items="clientOrdersList"
            item-text="id"
            item-value="id"
            solo
            flat
            hide-details
            no-data-text="Нет заказов"
            v-model.number="order"
            class="scs-small"
            @change="handleOrderChange"
          ></v-select>
        </div>
      </v-flex>
      <v-flex xs7>
        <div class="pr-0" style="height: 30px;">
          <v-select
            label="Букет"
            :items="orderBouquets"
            item-text="fullName"
            item-value="id"
            solo
            flat
            hide-details
            no-data-text="Нет букетов"
            v-model.number="orderBouquet"
            class="scs-small"
            @change="updateProps()"
          ></v-select>
        </div>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs6>
        <v-text-field
          label="Оформление, %"
          solo
          flat
          hide-details
          v-model.number="decorPercent"
          class="scs-small"
          type="number"
          min="0"
        ></v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-text-field
          label="Предопалата"
          solo
          flat
          hide-details
          v-model.number="prepayment"
          class="scs-small"
          readonly
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <div class="px-0" style="height: 30px;">
      <v-text-field
        label="Стоимость товара"
        solo
        flat
        hide-details
        v-model.number="goodsCost"
        class="scs-small"
        readonly
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs3>
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="Доставка"
            solo
            flat
            hide-details
            v-model.number="deliveryCost"
            class="scs-small"
            type="number"
            min="0"
          ></v-text-field>
        </div>
      </v-flex>
      <v-flex xs9>
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="Комментарий"
            solo
            flat
            hide-details
            v-model="comment"
            class="scs-small"
          ></v-text-field>
        </div>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs6>
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="Оформление"
            solo
            flat
            hide-details
            v-model.number="decorCost"
            class="scs-small"
            readonly
          ></v-text-field>
        </div>
      </v-flex>
      <v-flex xs6>
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="0"
            solo
            flat
            hide-details
            v-model.number="sumDecorAdditional"
            class="scs-small"
            type="number"
          ></v-text-field>
        </div>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs6>
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="Скидка, %"
            solo
            flat
            hide-details
            :value="clientSale"
            :background-color="clientSale > 0 ? 'deep-orange lighten-4' : ''"
            class="scs-small"
            @input="clientSaleCustom = $event"
            @change="updateProps()"
            type="number"
            min="0"
            @keyup="handleNumberFieldKeyUp($event, 'clientSaleCustom')"
          ></v-text-field>
        </div>
      </v-flex>
      <v-flex xs6>
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="0"
            solo
            flat
            hide-details
            :value="sumSale"
            class="scs-small"
            readonly
          ></v-text-field>
        </div>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <div class="pl-0" style="height: 30px;">
      <v-text-field
        label="0"
        solo
        flat
        hide-details
        :value="sumPay"
        class="scs-small"
        readonly
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <div class="px-0 text-xs-center" style="height: 40px;">
      <v-btn color="info" @click="handlePaymentModelOpenButtonClick" small>
        Оплатить
      </v-btn>
      <v-btn
        @click.native="dialogClear = true"
        flat
        small
        color="error"
        class="mx-0"
        title="Удалить"
      >
        <v-icon dark>clear</v-icon>
      </v-btn>
      <v-btn
        @click.native="$emit('copy')"
        flat
        small
        color="warning"
        class="mx-0"
        title="Скопировать"
      >
        <v-icon dark>library_add</v-icon>
      </v-btn>
      <div class="pr-0 input-min" style="height: 30px;">
        <v-text-field
          label="Кол-во"
          solo
          flat
          hide-details
          v-model="bouquetCount"
          class="scs-small text-lg-right"
          title="Количество"
          type="number"
          @change="updateProps()"
        ></v-text-field>
      </div>
      <v-btn @click="checkCard()" flat small color="gray" class="mx-0">
        <v-icon dark v-if="check" title="Убрать">check_box</v-icon>
        <v-icon dark v-else title="Выбрать">check_box_outline_blank</v-icon>
      </v-btn>
    </div>
    <v-divider></v-divider>
    <create-payment-modal
      :sum-pay-custom="sumPayCustom"
      :payment-types-list="paymentTypesList"
      :pre-payment="prePayment"
      :client="client"
      :orderPrice="orderPrice"
      :to-pay="toPay"
      :is-payment-on-balance="isPaymentOnBalance"
      ref="cardPaymentModel"
      @onPay="submitForm"
    />
    <v-dialog v-model="dialogClear" persistent max-width="320px">
      <v-card>
        <v-card-title class="px-4">
          <span class="headline">Очистить?</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions class="px-4 py-3">
          <v-btn @click.native="dialogClear = false">Отмена</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="$emit('delete')">Очистить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Autosuggest from './Autosuggest';
import gql from 'graphql-tag';
import { mapState, mapMutations } from 'vuex';
import {mapFields} from 'vuex-map-fields'

import { ClientTypes, PaymentTypes } from '../constants';
import CreatePaymentModal from './CreatePaymentModal';
import { CHANGE_BOUQUET_CARD } from '../views/CreateBouquet/mutation-types'
import { mapDynamicFields } from '../helpers';

export default {
  name: 'CreatedBouquetCard',
  components: {
    CreatePaymentModal,
    autosuggest: Autosuggest,
  },
  props: {
    goods: {
      type: Array,
      required: true,
    },
    floristsList: {
      type: Array,
      required: true,
    },
    paymentTypesList: {
      type: Array,
      required: true,
    },
    sumFlowers: {
      type: Number,
      required: true,
    },
    propsDefault: {
      type: Object,
      required: true,
    },
    check: {
      type: Boolean,
    },
    id: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      sumPayCustom: 0,
      createdSuccess: false,
      florist: 0,
      client: {},
      clientId: 0,
      order: 0,
      salePersent: null,
      dialogPay: false,
      sumClient: 0,
      secondSumClient: 0,
      dialogClear: false,
      sumDecorCustom: '',
      clientSaleCustom: '',
      bouquetCount: 1,
      orderBouquet: null,
      clientOrdersList: [],
      clientsList: [],
      partlyPayment: false,
      btnLoad: false,
      queryName: '',
      skipClientsQuery: true,
      suggestions: [],
    };
  },
  apollo: {
    clientsList: {
      query: gql`
        query ClientsList($name: String) {
          clientsList: clients(
            where: {
              _or: [{ name: { _ilike: $name } }, { phone: { _ilike: $name } }]
            }
            limit: 50
          ) {
            id
            name
            type: typeId
            discountPercent: sale
            bill
          }
        }
      `,
      update({ clientsList: data }) {
        this.suggestions = [{ data }];

        return data;
      },
      variables() {
        return {
          name: this.queryName,
        };
      },
      skip() {
        return this.skipClientsQuery;
      },
    },
    clientOrdersList: {
      query: gql`
        query ClientOrdersList($clientId: bigint) {
          clientOrdersList: orders(where: { clientId: { _eq: $clientId } }) {
            id
            prePayment
            deliveryCost
            bouquets: orderBouquets {
              id
              name
              count
              bouquets_aggregate {
                aggregate {
                  count
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          clientId: this.clientId,
        };
      },
    },
  },
  methods: {
    handlePaymentModelOpenButtonClick() {
      console.log(this.$refs.cardPaymentModel.dialogPay);
      this.$refs.cardPaymentModel.dialogPay = true;
    },
    handleNumberFieldKeyUp(e, fieldName) {
      if (e.target.value === '') {
        this[fieldName] = 0;
      }
    },
    onSelected(item) {
      this.client = item;
      this.clientId = item.id;
      this.updateProps();
    },
    getSuggestionValue(suggestion) {
      return suggestion.item.name;
    },
    onInputChange(text) {
      this.queryName = `%${text}%`;
      this.skipClientsQuery = false;
    },
    handleOrderChange(id) {
      const order = this.clientOrdersList.find(item => item.id === id);

      const isHaveReadyBouquets = order.bouquets.some(
        b => b.bouquets_aggregate.aggregate.count,
      );

      this.delivery = !isHaveReadyBouquets ? order.deliveryCost : 0;

      this.updateProps();
    },
    clearProps() {
      this.florist = 0;
      this.client = 0;
      this.order = 0;
      this.decorPercent = 20;
      this.delivery = 0;
      this.salePersent = 0;

      this.dialogClear = false;
      this.updateProps();
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    submitForm(model) {
      const props = {
        floristId: this.florist,
        clientId: this.clientId || 0,
        orderId: this.order,
        totalCost: this.sumPay / +this.bouquetCount,
        decorPercent: +this.decorPercent,
        decorCost: this.sumDecor + this.sumDecorAdditional,
        deliveryCost: +this.delivery,
        salePercent: +this.clientSale,
        sumSale: this.sumSale,
        sumPayCustom: this.sumPayCustom,
        comment: this.comment,
        orderBouquet: this.orderBouquet,
        bouquetCount: +this.bouquetCount,
        ...model,
      };

      setTimeout(() => {
        this.$emit('saveProps', props);
      }, 1000);
    },
    updateProps: function updateProps() {
      const props = {
        floristId: this.florist,
        clientId: this.client.id,
        client: this.client,
        orderId: this.order,
        totalCost: this.sumPay,
        decorPercent: this.decorPercent,
        decorCost: this.sumDecor,
        deliveryCost: this.delivery,
        salePercent: +this.clientSale,
        sumSale: this.sumSale,
        payment: {
          paymentTypeId: 1,
          amount: this.sumPay,
          clientId: this.clientId,
          description: '',
        },
        prePayment: this.prePayment,
        comment: this.comment,
        orderBouquet: this.orderBouquet,
        sumDecorAdditional: this.sumDecorAdditional,
        bouquetCount: +this.bouquetCount,
      };

      this.$emit('updateProps', props);
    },
    checkCard() {
      this.$emit('checkCard');
    },
    priceRound: function priceRound(sum) {
      return +sum;
    },
  },
  computed: {
    ...mapState({
      card(state) {
        return state.bouquetCards.cards.find(c => c.id === this.id)
      }
    }),
    ...mapDynamicFields('cards[]',['decorPercent', 'prepayment', 'goodsCost', 'deliveryCost', 'comment', 'additionalDecorCost', 'decorCost'], 'index'),
    isPaymentOnBalance() {
      return !(
              this.sumFlowers > 0 ||
              this.sumDecorAdditional > 0 ||
              this.delivery > 0
      );
    },
    orderPrice() {
      return (
              this.sumFlowers +
              +this.sumDecor +
              +this.sumDecorAdditional -
              this.sumSale
      );
    },
    toPay() {
      return (+this.orderPrice + +this.delivery) * +this.bouquetCount;
    },
    autosuggestValue() {
      return this.client.name
              ? `${this.client.name} (${this.client.bill})`
              : '';
    },
    orderBouquets() {
      const orderSelected = this.clientOrdersList.find(
              item => item.id === this.order,
      );
      let orderList = [];

      if (orderSelected) {
        orderList = orderSelected.bouquets.map(item => {
          item.fullName = `${item.name} - ${item.count}шт`;
          return item;
        });
      }

      return orderList;
    },
    sumDecor: function decorSum() {
      let sum = 0;
      if (this.sumDecorCustom !== '') {
        sum = this.sumDecorCustom;
      } else {
        sum = Math.ceil(this.sumFlowers * (this.decorPercent / 100));
      }
      return this.priceRound(sum);
    },
    sumSale: function sumSale() {
      const sum = Math.ceil(
              (this.sumFlowers + this.sumDecor + this.sumDecorAdditional) *
              (this.clientSale / 100),
      );
      return this.priceRound(sum);
    },
    sumOrder: function sumPay() {
      let sum = this.sumFlowers;
      sum += this.sumDecor;
      sum += +this.delivery;
      sum += +this.sumDecorAdditional;
      sum -= this.sumSale;
      return +sum.toFixed();
    },
    sumPay: function sumPay() {
      let sum = this.sumFlowers;
      sum += this.sumDecor;
      sum += +this.delivery;
      sum += +this.sumDecorAdditional;
      sum -= this.sumSale;

      return (
              +sum.toFixed() * +this.bouquetCount -
              +this.delivery * +this.bouquetCount +
              +this.delivery
      );
    },
    isEmptySum() {
      let emptySum = true;
      if (this.sumFlowers > 0) emptySum = false;
      if (this.sumDecorAdditional > 0) emptySum = false;
      if (this.delivery > 0) emptySum = false;

      return emptySum;
    },
    sumChange: function surrender() {
      const sum = +this.sumClient + +this.secondSumClient - +this.sumPay;

      return sum > 0 ? sum : 0;
    },
    activePayBtn: function activePayBtn() {
      const active = this.florist !== '' ? 1 : 0;
      return active;
    },
    clientSale: function clientSale() {
      const client = this.client;

      let salePersent = 0;

      if (client) {
        if (this.clientSaleCustom !== '') {
          salePersent = this.clientSaleCustom;
        } else if (client !== 0 && client.discountPercent > 0) {
          salePersent = client.discountPercent;
        } else if (
                this.sumFlowers + this.sumDecor + this.sumDecorAdditional >=
                3000
        ) {
          salePersent = 5;
        } else {
          salePersent = null;
        }
      }

      return salePersent;
    },
  },
};
</script>

<style></style>
