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
        :value="client.name"
        @onChange="onInputChange"
        @onSelect="onSelected"
      />
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
          @change="updateProps()"
        ></v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-text-field
          label="Предопалата"
          solo
          flat
          hide-details
          v-model.number="prePayment"
          class="scs-small"
          readonly
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <div class="px-0" style="height: 30px;">
      <v-text-field
        label="0"
        solo
        flat
        hide-details
        :value="sumFlowers"
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
            v-model.number="delivery"
            class="scs-small"
            @change="updateProps()"
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
            @change="updateProps()"
          ></v-text-field>
        </div>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs6>
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="0"
            solo
            flat
            hide-details
            :value="sumDecor"
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
            de
            class="scs-small"
            @input="updateProps()"
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
      <v-btn color="info" @click.native="dialogPay = true" small
        >Оплатить
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
        ></v-text-field>
      </div>
      <v-btn @click="checkCard()" flat small color="gray" class="mx-0">
        <v-icon dark v-if="check" title="Убрать">check_box</v-icon>
        <v-icon dark v-else title="Выбрать">check_box_outline_blank</v-icon>
      </v-btn>
    </div>
    <v-divider></v-divider>
    <v-dialog v-model="dialogPay" persistent max-width="420px">
      <v-card>
        <v-alert :value="createdSuccess" type="success" class="my-0">
          Букет создан
        </v-alert>
        <v-form ref="form" lazy-validation>
          <v-card-title class="px-4">
            <span class="headline">Оплата заказа</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="px-4">
            <v-text-field
              label="Сумма заказа"
              readonly
              :value="sumOrder"
              v-if="!isEmptySum"
            ></v-text-field>
            <v-text-field
              label="К оплате"
              readonly
              :value="sumPay"
              v-if="!isEmptySum"
            ></v-text-field>
            <v-text-field
              label="Предоплата"
              readonly
              :value="prePayment"
              v-if="!isEmptySum"
            ></v-text-field>
            <v-text-field
              label="К оплате"
              v-model.number="sumPayCustom"
              v-if="isEmptySum"
            ></v-text-field>
            <v-text-field
              label="Сумма"
              :rules="[v => validateTotalSum(v) || 'Заполните поле']"
              v-model="sumClient"
              v-if="!isEmptySum && (partlyPayment || typePay === 1)"
              @keyup="handleFirstSumChange"
              ref="firstSum"
            ></v-text-field>

            <v-select
              label="Способ оплаты"
              :items="typePayList"
              :rules="[v => !!v || 'Заполните поле']"
              item-text="name"
              item-value="id"
              v-model="typePay"
            ></v-select>
            <v-checkbox label="Частичная" v-model="partlyPayment" />
            <v-select
              label="Второй способ оплаты"
              :items="typePayList"
              :rules="[v => !!v || 'Заполните поле']"
              item-text="name"
              item-value="id"
              v-model="secondTypePay"
              v-if="partlyPayment"
            />
            <v-text-field
              label="Вторая сумма"
              :rules="[v => validateTotalSum(v) || 'Заполните поле']"
              v-model="secondSumClient"
              v-if="!isEmptySum && secondTypePay"
              ref="secondSum"
              @keyup="handleSecondSumChange"
            ></v-text-field>
            <v-text-field
              label="Сдача"
              readonly
              :value="sumChange"
              v-if="!isEmptySum && (partlyPayment || typePay === 1)"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn @click.native="dialogPay = false">Отмена</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="info" @click="submitForm" :loading="btnLoad"
              >Оплатить</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

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
import Autosuggest from './Autosuggest'
import gql from "graphql-tag";

import { ClientTypes, PaymentTypes } from '../constants';
import InfiniteAutocomplete from '../components/InfiniteAutocomplete';

export default {
  name: 'CreatedBouquetCard',
  components: {
    'autosuggest': Autosuggest
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
    },
  },
  data() {
    return {
      sumPayCustom: 0,
      createdSuccess: false,
      florist: 0,
      client: {},
      clientId: 0,
      order: 0,
      decorPercent: 20,
      delivery: 0,
      comment: '',
      sumDecorAdditional: 0,
      salePersent: null,
      dialogPay: false,
      sumClient: 0,
      secondSumClient: 0,
      typePay: null,
      secondTypePay: null,
      dialogClear: false,
      sumDecorCustom: '',
      clientSaleCustom: '',
      check: false,
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
          clientsList: clients(where: { name: { _ilike: $name } }, limit: 50) {
            id
            name
            type: clientType {
              id
            }
            discountPercent: sale
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
  computed: {
    prePayment() {
      let prePayment = 0;

      if (this.order > 0 && this.clientOrdersList.length) {
        const order = this.clientOrdersList.find(item => item.id === this.order);

        prePayment = order ? +order.prePayment : 0;
      }

      return prePayment;
    },
    orderBouquets() {
      const orderSelected = this.clientOrdersList.find(item => item.id === this.order);
      let orderList = [];

      if (orderSelected) {
        orderList = orderSelected.bouquets.map((item) => {
          item.fullName = `${item.name} - ${item.count}шт`;
          return item;
        });
      }

      return orderList;
    },
    typePayList() {
      return this.paymentTypesList.filter((item) => {
        if (
          item.id === PaymentTypes.PRESENT &&
          (this.client.type !== ClientTypes.LEGAL || this.goods.length)
        ) {
          return false;
        }

        if (this.clientId === 0) {
          return item.id !== 5;
        }

        return item.id !== 7;
      });
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
      const sum = Math.ceil((this.sumFlowers + this.sumDecor + this.sumDecorAdditional) *
          (this.clientSale / 100));
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

      return +sum.toFixed() * +this.bouquetCount;
    },
    isEmptySum() {
      let emptySum = true;
      if (this.sumFlowers > 0) emptySum = false;
      if (this.sumDecorAdditional > 0) emptySum = false;
      if (this.delivery > 0) emptySum = false;

      return emptySum;
    },
    sumChange: function sumChange() {
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
  methods: {
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
    handleSecondSumChange() {
      this.$refs.firstSum.validate();
    },
    handleFirstSumChange() {
      this.$refs.secondSum && this.$refs.secondSum.validate();
    },
    validateTotalSum(v) {
      return +this.sumClient + +this.secondSumClient >= this.sumPay;
    },
    handleOrderChange(id) {
      const order = this.clientOrdersList.find(item => item.id === id);

      const isHaveReadyBouquets = order.bouquets.some(b => b.bouquets_aggregate.aggregate.count);

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
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        this.createdSuccess = true;
        this.btnLoad = true;

        const props = {
          floristId: this.florist,
          clientId: this.clientId,
          orderId: this.order,
          totalCost: this.sumPay,
          decorPercent: +this.decorPercent,
          decorCost: this.sumDecor + this.sumDecorAdditional,
          deliveryCost: this.delivery,
          salePercent: +this.clientSale,
          sumSale: this.sumSale,
          payment: {
            paymentTypeId: this.typePay,
            amount: this.partlyPayment
              ? this.sumPay - this.secondSumClient
              : this.sumPay,
            clientId: this.clientId,
            description: '',
          },
          secondPayment: this.partlyPayment
            ? {
              paymentTypeId: this.secondTypePay,
              amount: this.secondSumClient,
              clientId: this.clientId,
              description: '',
            }
            : null,
          comment: this.comment,
          orderBouquet: this.orderBouquet,
          bouquetCount: +this.bouquetCount,
        };

        if (this.sumFlowers === 0) {
          props.payment.amount = this.sumPayCustom;
        }

        setTimeout(() => {
          this.dialogPay = false;
          this.$emit('saveProps', props);
        }, 1000);
      }
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
        comment: this.comment,
        orderBouquet: this.orderBouquet,
        sumDecorAdditional: this.sumDecorAdditional,
        bouquetCount: +this.bouquetCount,
      };

      this.$emit('updateProps', props);
    },
    checkCard() {
      this.check = !this.check;
      this.$emit('checkCard', this.sumPay);
    },
    priceRound: function priceRound(sum) {
      return +sum;
    },
    setValueDefault: function setValueDefault() {
      if (Object.keys(this.propsDefault).length > 0) {
        this.florist = this.propsDefault.floristId;
        this.clientId = this.propsDefault.clientId;
        this.client = this.propsDefault.client;
        this.order = this.propsDefault.orderId;
        this.decorPercent = this.propsDefault.decorPercent;
        this.delivery = this.propsDefault.deliveryCost;
        this.salePersent = this.propsDefault.salePercent;
        this.comment = this.propsDefault.comment;
        this.orderBouquet = this.propsDefault.orderBouquet;
        this.sumDecorAdditional = this.propsDefault.sumDecorAdditional;
      }
    },
  },
  updated() {
    // if ((this.salePersent === null || this.salePersent === '')
    //   && (this.sumFlowers + this.sumDecor) >= 5000) {
    //   this.salePersent = 10;
    // }
  },
  created() {
    this.setValueDefault();
  },
};
</script>

<style></style>
