<template>
  <v-container fluid class="pa-0">
    <v-snackbar
      :value="true"
      v-if="totalToPay > 0"
      color="info"
      bottom
      :timeout="3600000"
    >
      Общая стоимость: {{ totalToPay }}
      <v-btn color="error" depressed @click="deleteCheckCards">Удалить</v-btn>
      <v-btn color="info" depressed @click="handlePayButtonClick"
        >Оплатить</v-btn
      >
    </v-snackbar>
    <v-dialog :value="loadingDialog" persistent max-width="320px">
      <v-list>
        <v-list-tile
          v-for="(item, index) in loadingData"
          :key="index"
          avatar
          :color="item.error ? 'red' : item.color"
        >
          <v-list-tile-avatar>
            <v-progress-circular
              :value="100"
              :size="30"
              :color="item.error ? 'red' : item.color"
              :indeterminate="item.loading"
            ></v-progress-circular>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-dialog>

    <payment-day
      v-if="!loadingDialog"
      :payments-list="paymentsList"
      ref="paymentDayRef"
    ></payment-day>

    <v-layout row wrap v-if="!loadingDialog">
      <v-flex xs4>
        <v-card flat v-for="(item, index) in propsBouquet" :key="index">
          <div
            class="py-1 px-3 text-xs-right"
            :style="'height: ' + (!!item ? 30 : 40) + 'px;'"
          >
            {{ item }}
          </div>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
      <v-flex xs8>
        <v-container
          id="scroll-block-top"
          style="overflow: auto;"
          class="scroll-y pa-0 right-block"
        >
          <v-layout row v-scroll:#scroll-block-top="onScroll">
            <template v-for="(item, index) in bouquetCards">
              <v-flex :key="index" v-if="!item.success">
                <created-bouquet-card
                  :id="item.id"
                  :florists-list="floristsList"
                  :payment-types-list="paymentTypesList"
                  @saveProps="saveProps(index, $event)"
                  @updateProps="updateProps(index, $event)"
                  @copy="copyItem(index)"
                  @delete="deleteItem(index)"
                  @checkCard="checkCard(index, $event)"
                  ref="createBouquetCard"
                ></created-bouquet-card>
              </v-flex>
            </template>
            <v-flex style="align-self: center;">
              <v-btn
                fab
                large
                color="info"
                class="mx-4"
                @click="addCard"
                title="Добавить букет"
              >
                <v-icon dark>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      style="min-height: 100px; height: 528px; overflow-y: scroll;"
      v-if="!loadingDialog"
    >
      <v-flex xs4>
        <v-layout row wrap>
          <v-flex>
            <v-card flat>
              <div class="py-1 px-1 text-xs-center" style="height: 30px;">
                Остаток
              </div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goods">
                <template v-if="showGoodsList.indexOf(item.id) !== -1">
                  <div
                    class="py-1 px-1 text-xs-center"
                    style="height: 30px;"
                    :key="index"
                  >
                    {{ item.stockBalance }}
                  </div>
                  <v-divider :key="'divider-' + index"></v-divider>
                </template>
              </template>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card flat>
              <div class="py-1 px-1 text-xs-center" style="height: 30px;">
                Наименование
              </div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <template v-if="showGoodsList.indexOf(item.id) !== -1">
                  <div
                    class="py-1 px-1 text-xs-center"
                    :style="
                      item.color
                        ? `background-color: ${item.color}; height: 30px;`
                        : 'height: 30px;'
                    "
                    :key="index"
                  >
                    {{ item.name }}
                  </div>
                  <v-divider :key="'divider-' + index"></v-divider>
                </template>
              </template>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card flat>
              <div class="py-1 px-1 text-xs-center" style="height: 30px;">
                Цена
              </div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <template v-if="showGoodsList.indexOf(item.id) !== -1">
                  <div
                    class="py-1 px-1 text-xs-center"
                    style="height: 30px;"
                    :key="index"
                  >
                    {{ item.price }}
                  </div>
                  <v-divider :key="'divider-' + index"></v-divider>
                </template>
              </template>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs8 style="padding-left: 6px;">
        <v-container
          id="scroll-block-bottom"
          style="overflow: hidden;"
          class="scroll-y pa-0 right-block"
        >
          <v-layout row>
            <template v-for="(item, index) in cardsList">
              <v-flex :key="index" v-if="!item.success">
                <select-count-goods
                  :goods-list="goodsList"
                  :selected-goods-default="item.goods"
                  @changeSum="setSum(index, $event)"
                  @changeGoods="setGoods(index, $event)"
                  :key="index"
                ></select-count-goods>
              </v-flex>
            </template>
            <v-flex>
              <div style="width: 120px;"></div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <create-payment-modal
      :sum-pay-custom="sumCheckCardsByProps('sumPayCustom')"
      :pre-payment="sumCheckCardsByProps('prePayment')"
      :payment-types-list="paymentTypesList"
      :client="checkedClient"
      :order-price="totalOrderPrice"
      :to-pay="totalToPay"
      :is-payment-on-balance="false"
      :hide-partial-payment="true"
      ref="createPaymentModel"
      @onPay="handlePaySubmitForm"
    />
  </v-container>
</template>

<script>
import CreatedBouquetCard from '../components/CreatedBouquetCard.vue';
import SelectCountGoods from '../components/SelectCountGoods.vue';
import PaymentDay from './Pays/paymentDay.vue';
import gql from 'graphql-tag';
import { mapState } from 'vuex'
import CreatePaymentModal from '../components/CreatePaymentModal';
import {ADD_BOUQUET_CARD} from './CreateBouquet/mutation-types'

export default {
  name: 'Home',
  components: {
    CreatePaymentModal,
    'created-bouquet-card': CreatedBouquetCard,
    'select-count-goods': SelectCountGoods,
    PaymentDay,
  },
  data() {
    return {
      dateNow: '',
      dateYesterday: '',
      loadingData: [
        {
          title: 'Получение флористов',
          error: false,
          loading: true,
          color: 'cyan',
          id: 'florists',
        },
        {
          title: 'Получение товаров',
          error: false,
          loading: true,
          color: 'blue-grey',
          id: 'goods',
        },
        {
          title: 'Получение оплат',
          error: false,
          loading: false,
          color: 'deep-orange',
          id: 'payments',
        },
      ],
      offsetLeft: 0,
      propsBouquet: [
        'Флорист',
        'Клиент',
        'Заказ | Букет',
        'Cтавка на оформление, % | Предоплата',
        'Сумма товара',
        'Доставка | Комментарий',
        'Оформление',
        'Ставка на скидку, % | Сумма скидки',
        'Всего к оплате | Кол-во',
        '',
      ],
      cardsList: [],
      floristsList: [],
      paymentTypesList: [],
      goodsList: [],
      paymentsList: [],
      checkCardList: [],
      createdSuccess: false,
      sumClient: 0,
      typePay: null,
      paymentsPagination: {
        page: 0,
        limit: 200,
      },
    };
  },
  apollo: {
    floristsList: {
      query: gql`
        query {
          floristsList: florists {
            id
            name
          }
        }
      `,
      result() {
        this.handleLoadingSuccess('florists', 'Флористы получены!');
      },
      error() {
        this.handleLoadingFailed('florists', 'Ошибка получения флористов!');
      },
    },
    goodsList: {
      query: gql`
        query {
          goodsList: goods(order_by: { sortIndex: desc }) {
            id
            name
            price
            stockBalance
            color
          }
        }
      `,
      result() {
        this.handleLoadingSuccess('goods', 'Товары получены!');
      },
      error() {
        this.handleLoadingFailed('goods', 'Ошибка получения товаров!');
      },
      update({ goodsList }) {
        return goodsList.map(g => ({
          ...g,
          originalBalance: g.stockBalance,
        }));
      },
    },
    paymentTypesList: {
      query: gql`
        query {
          paymentTypesList: paymentTypes {
            id
            name
          }
        }
      `,
    },
  },
  computed: {
    ...mapState({
      bouquetCards: state => state.bouquetCards.cards
    }),
    totalOrderPrice() {
      const totalSum = this.checkedCards.reduce(
        (sum, item) => sum + +item.sum,
        0,
      );

      return (
        totalSum +
        this.sumCheckCardsByProps('decorCost') +
        this.sumCheckCardsByProps('sumDecorAdditional') -
        this.sumCheckCardsByProps('sumSale')
      );
    },
    totalToPay() {
      return this.checkedCards.reduce((sum, item) => {
        return (
          sum +
          (+item.sum +
            (+item.props.decorCost || 0) +
            (+item.props.sumDecorAdditional || 0) +
            (+item.props.sumSale || 0) +
            (+item.props.delivery || 0)) *
            (+item.props.bouquetCount || 1)
        );
      }, 0);
    },
    checkedCards() {
      return this.cardsList.filter(c => c.isChecked);
    },
    checkedClient() {
      return (
        (this.checkedCards[0] &&
          this.checkedCards[0].props &&
          this.checkedCards[0].props.client) ||
        {}
      );
    },
    sumCheckCardsByProps() {
      return prop =>
        this.checkedCards.reduce(
          (sum, item) => sum + (+item.props[prop] || 0),
          0,
        ) || 0;
    },
    goods() {
      for (let good of this.goodsList.filter(g => g.originalBalance)) {
        good.stockBalance = good.originalBalance;
      }

      for (let good of this.goodsList) {
        const goodCardsSum = this.cardsList.reduce((acc, card) => {
          const { value } = card.goods.find(g => g.id === good.id) || {
            value: 0,
          };

          return acc + value;
        }, 0);

        good.stockBalance = good.stockBalance - goodCardsSum;
      }

      return this.goodsList;
    },
    sumChange: function surrender() {
      const sum = this.sumClient - this.checkSum;
      return sum > 0 ? sum : 0;
    },
    checkSum() {
      return this.checkCardList.reduce((sum, item) => sum + item.sum, 0);
    },
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(
        item => !item.error && !item.loading,
      );
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    showGoodsList() {
      const showGoodsList = this.$store.getters.getShowGoodsList;
      let goodsList = this.goodsList.map(item => item.id);
      if (showGoodsList.length > 0) {
        goodsList = showGoodsList;
      }
      return goodsList;
    },
  },
  methods: {
    saveCardsToLocalStorage(cards = this.cardsList) {
      localStorage.setItem('cardsList', JSON.stringify(this.cardsList));
    },
    handlePayButtonClick() {
      this.$refs.createPaymentModel.dialogPay = true;
    },
    handlePaySubmitForm({ payment }) {
      this.checkedCards.map(card => {
        const amount =
          card.sum +
          +card.props.decorCost +
          +card.props.deliveryCost -
          +card.props.sumSale;

        card.props.payment = {
          paymentTypeId: payment.paymentTypeId,
          clientId: card.props.clientId,
          description: '',
          amount,
        };

        this.saveProps(card.index, card.props);
      });
    },
    refreshPayments() {
      this.$refs.paymentDayRef && this.$refs.paymentDayRef.refreshPayments();
    },
    handleLoadingSuccess(loadingBarId, msg) {
      const loadData = this.loadingData.find(item => item.id === loadingBarId);
      loadData.title = msg;
      loadData.loading = false;
    },
    handleLoadingFailed(loadingBarId, msg) {
      const loadData = this.loadingData.find(item => item.id === loadingBarId);
      loadData.title = msg;
      loadData.error = true;
    },
    onScroll: function onScroll(e) {
      const scroll = e.target.scrollLeft;

      if (e.target.id === 'scroll-block-top') {
        document.getElementById('scroll-block-bottom').scrollLeft = scroll;
      } else {
        // document.getElementById('scroll-block-top').scrollLeft = scroll;
      }
    },
    setSum: function setSum(index, sum) {
      const item = this.cardsList[index];
      item.sum = sum;
      this.$set(this.cardsList, index, item);
    },
    setGoods: function setSum(index, goods) {
      const item = this.cardsList[index];
      item.goods = goods;
      this.$set(this.cardsList, index, item);

      const cardNoEmpty = this.cardsList.filter(
        elem =>
          (elem.goods.length > 0 || Object.keys(elem.props).length > 0) &&
          elem.success !== true,
      );
      this.saveCardsToLocalStorage(cardNoEmpty);
    },
    addCard: function addCard() {
      this.$store.commit(ADD_BOUQUET_CARD);
    },
    checkCard(index) {
      this.cardsList[index].index = index;
      this.$set(
        this.cardsList[index],
        'isChecked',
        !this.cardsList[index].isChecked,
      );
      localStorage.setItem('cardsList', JSON.stringify(this.cardsList));
    },
    saveProps: function saveProps(index, props) {
      const item = this.cardsList[index];

      if (props) {
        new Promise((res, rej) => {
          let emptySum = true;

          if (
            item.goods.length > 0 ||
            props.decorCost > 0 ||
            props.deliveryCost > 0
          ) {
            emptySum = false;
          }

          if (emptySum) {
            const itemParams = {
              type: 'payments',
              props: {
                paymentType: {
                  id: props.payment.paymentTypeId,
                  name: 'На баланс',
                  isActive: true,
                  code: 'balance',
                },
                amount: props.sumPayCustom,
                clientId: props.payment.clientId,
                description: props.comment,
              },
            };

            this.$store
              .dispatch('addItem', itemParams)
              .then(res)
              .catch(rej);
          } else {
            const newBouqet = props;

            newBouqet.goods = item.goods.map(elem => {
              const good = {
                goodId: elem.id,
                count: elem.value,
              };
              return good;
            });

            const bouquetParams = {
              type: 'bouquets',
              props: newBouqet,
            };

            this.$store
              .dispatch('addItem', bouquetParams)
              .then(res)
              .catch(rej);
          }
        })
          .then(() => {
            item.success = true;
            this.$set(this.cardsList, index, item);

            this.refreshPayments();

            item.goods.forEach(elem => {
              const findGood = this.goodsList.find(good => good.id === elem.id);
              findGood.store -= elem.value;
            });

            const cardNoEmpty = this.cardsList.filter(
              elem =>
                (elem.goods.length > 0 || Object.keys(elem.props).length > 0) &&
                elem.success !== true,
            );
            this.saveCardsToLocalStorage(cardNoEmpty);

            const findIndex = this.checkCardList.findIndex(
              card => card.index === index,
            );

            if (findIndex + 1) {
              this.checkCardList.splice(findIndex, 1);
            }
          })
          .catch(err => {
            this.$refs.createBouquetCard[0] &&
              (this.$refs.createBouquetCard[0].btnLoad = false);
            err &&
              err.message &&
              this.getErrors(err.message).forEach(msg => {
                this.$notify({
                  group: 'global',
                  title: 'Ошибка валидации!',
                  text: msg,
                  type: 'error',
                  duration: -1,
                });
              });
          });
      }
    },
    updateProps: function updateProps(index, props) {
      const item = this.cardsList[index];
      item.props = props;
      this.$set(this.cardsList, index, item);

      const cardNoEmpty = this.cardsList.filter(
        elem =>
          (elem.goods.length > 0 || Object.keys(elem.props).length > 0) &&
          elem.success !== true,
      );
      this.saveCardsToLocalStorage(cardNoEmpty);
    },
    copyItem(index) {
      const item = Object.assign({}, this.cardsList[index]);
      this.cardsList.push(item);
      const cardNoEmpty = this.cardsList.filter(
        elem =>
          (elem.goods.length > 0 || Object.keys(elem.props).length > 0) &&
          elem.success !== true,
      );
      this.saveCardsToLocalStorage(cardNoEmpty);
    },
    deleteItem(index) {
      const item = this.cardsList[index];
      item.success = true;

      const cardNoEmpty = this.cardsList.filter(
        elem =>
          (elem.goods.length > 0 || Object.keys(elem.props).length > 0) &&
          elem.success !== true,
      );

      this.cardsList = this.cardsList.filter(c => c.index !== index);
      this.saveCardsToLocalStorage();
    },
    deleteCheckCards() {
      const checkCards = this.checkCardList.slice();

      checkCards.forEach(item => {
        this.deleteItem(item.index);
      });
    },
    getErrors(rawErrors) {
      return rawErrors.reduce((acc, msg) => {
        return [...acc, ...Object.values(msg.constraints)];
      }, []);
    },
  },
  mounted() {
    this.$store.commit('setShowGoodsList', []);

    const dateNow = new Date();
    const dateNowStr = dateNow.toISOString().split('T')[0];
    this.dateNow = `${dateNowStr} 23:59:59`;
    dateNow.setDate(dateNow.getDate() - 1);
    const dateYesterdayStr = dateNow.toISOString().split('T')[0];
    this.dateYesterday = `${dateYesterdayStr} 00:00:00`;

    const cardsList = JSON.parse(localStorage.getItem('cardsList'));
    this.cardsList = cardsList !== null ? cardsList : [];
    const addCountElem = 1 - this.cardsList.length;

    for (let i = 0; i < addCountElem; i += 1) {
      this.addCard();
    }
  },
};
</script>

<style lang="scss">
.scs-small {
  &.v-text-field {
    .v-input__control {
      min-height: 30px;
    }
    input {
      max-height: 30px;
      padding: 5px 0;
    }
    .v-select__selection--comma {
      margin: 6px 4px 6px 0;
      white-space: nowrap;
      overflow: hidden;
      max-width: 116px;
      text-overflow: ellipsis;
      display: block;
    }
  }
}

.input-min {
  width: 40px;
  display: inline-block;

  .v-text-field.v-text-field--enclosed {
    .v-input__slot {
      padding: 0 5px;
    }
  }
}

.v-card.selected {
  box-shadow: inset 0 0 2px 2px #008a00;
}

.v-btn--small {
  min-width: 50px;
}

.right-block {
  .flex {
    max-width: 300px;
  }
}

.view-filter {
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  padding-bottom: 5px;

  &:hover,
  &:focus {
    border-bottom-color: #000;
  }

  #autosuggest__input {
    text-indent: 0;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
