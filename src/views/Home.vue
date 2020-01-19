<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-snackbar
      :value="true"
      v-if="checkSum > 0"
      color="info"
      bottom
      :timeout="3600000"
    >
      Общая стоимость: {{ checkSum }}
      <v-btn
        color="error"
        depressed
        @click="deleteCheckCards"
      >Удалить</v-btn>
      <v-btn
        color="info"
        depressed
        @click="dialogPay = true"
      >Оплатить</v-btn>
    </v-snackbar>
    <v-dialog
      :value="loadingDialog"
      persistent
      max-width="320px"
    >
      <v-list>
        <v-list-tile
          v-for="(item, index) in loadingData"
          :key="index"
          avatar
          :color="(item.error) ? 'red' : item.color"
        >
          <v-list-tile-avatar>
            <v-progress-circular
              :value="100"
              :size="30"
              :color="(item.error) ? 'red' : item.color"
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
      @input="getPaymentsList()"
    ></payment-day>

    <v-layout
      row
      wrap
      v-if="!loadingDialog"
    >
      <v-flex
        xs4
      >
        <v-card
          flat
          v-for="(item, index) in propsBouquet"
          :key="index"
        >
          <div
            class="py-1 px-3 text-xs-right"
            :style="'height: ' + ((!!item) ? 30 : 40) + 'px;'"
          >
            {{ item }}
          </div>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
      <v-flex
        xs8
      >
        <v-container
          id="scroll-block-top"
          style="overflow: auto;"
          class="scroll-y pa-0 right-block"
        >
          <v-layout
            row
            v-scroll:#scroll-block-top="onScroll"
          >
            <template v-for="(item, index) in cardsList">
              <v-flex
                :key="index"
                v-if="!item.success"
              >
                <created-bouquet-card
                  :florists-list="floristsList"
                  :clients-list="clientsList"
                  :payment-types-list="paymentTypesList"
                  :sumFlowers="item.sum"
                  :propsDefault="item.props"
                  @saveProps="saveProps(index, $event)"
                  @updateProps="updateProps(index, $event)"
                  @copy="copyItem(index)"
                  @delete="deleteItem(index)"
                  @checkCard="checkCard(index, $event)"
                ></created-bouquet-card>
              </v-flex>
            </template>
            <v-flex
              style="align-self: center;"
            >
              <v-btn
                fab
                large
                color="info"
                class="mx-4"
                @click="addCard"
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
      <v-flex
        xs4
      >
        <v-layout row wrap>
          <v-flex>
            <v-card
              flat
            >
              <div class="py-1 px-1 text-xs-center" style="height: 30px;">Остаток</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="py-1 px-1 text-xs-center"
                  style="height: 30px;"
                  :key="index"
                >{{ item.stockBalance }}</div>
                <v-divider :key="'divider-' + index"></v-divider>
              </template>
            </v-card>
          </v-flex>
          <!-- <v-flex>
            <v-card
              flat
            >
              <div class="py-1 px-1 text-xs-center" style="height: 30px;">Тип</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="py-1 px-1 text-xs-center"
                  style="height: 30px;"
                  :key="index"
                >{{ item.type }}</div>
                <v-divider :key="'divider-' + index"></v-divider>
              </template>
            </v-card>
          </v-flex> -->
          <v-flex>
            <v-card
              flat
            >
              <div class="py-1 px-1 text-xs-center" style="height: 30px;">Наименование</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="py-1 px-1 text-xs-center"
                  style="height: 30px;"
                  :key="index"
                >{{ item.name }}</div>
                <v-divider :key="'divider-' + index"></v-divider>
              </template>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card
              flat
            >
              <div class="py-1 px-1 text-xs-center" style="height: 30px;">Цена</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="py-1 px-1 text-xs-center"
                  style="height: 30px;"
                  :key="index"
                >{{ item.price }}</div>
                <v-divider :key="'divider-' + index"></v-divider>
              </template>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex
        xs8
        style="padding-left: 6px;"
      >
        <v-container
          id="scroll-block-bottom"
          style="overflow: hidden;"
          class="scroll-y pa-0 right-block"
        >
          <v-layout row>
            <template v-for="(item, index) in cardsList">
              <v-flex
                :key="index"
                v-if="!item.success"
              >
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

    <v-dialog
      v-model="dialogPay"
      persistent
      max-width="420px"
    >
      <v-card>
        <v-alert
          :value="createdSuccess"
          type="success"
          class="my-0"
        >
          Букеты созданы
        </v-alert>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-card-title
            class="px-4"
          >
            <span class="headline">Оплата заказа</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text
            class="px-4"
          >
            <v-text-field
              label="К оплате"
              readonly
              :value="checkSum"
            ></v-text-field>
            <v-text-field
              label="Сумма"
              :rules="[v => (v >= checkSum || typePay === 'На баланс') || 'Заполните поле']"
              v-model="sumClient"
              v-if="typePay !== 'На баланс'"
            ></v-text-field>
            <v-text-field
              label="Сдача"
              readonly
              :value="sumChange"
              v-if="typePay !== 'На баланс'"
            ></v-text-field>
            <v-select
              label="Способ оплаты"
              :items="typePayList"
              :rules="[v => !!v || 'Заполните поле']"
              item-text="name"
              item-value="id"
              v-model="typePay"
            ></v-select>
          </v-card-text>
          <v-card-actions
            class="px-4 pb-4"
          >
            <v-btn
              @click.native="dialogPay = false"
            >Отмена</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="info"
              @click="pay()"
            >Оплатить</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import CreatedBouquetCard from '../components/CreatedBouquetCard.vue';
import SelectCountGoods from '../components/SelectCountGoods.vue';
import PaymentDay from './Pays/paymentDay.vue';

export default {
  name: 'Home',
  components: {
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
          title: 'Получение клиентов',
          error: false,
          loading: true,
          color: 'indigo',
          id: 'clients',
        },
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
        // {
        //   title: 'Получение букетов',
        //   error: false,
        //   loading: true,
        //   color: 'deep-orange',
        //   id: 'bouquets',
        // },
        {
          title: 'Получение оплат',
          error: false,
          loading: true,
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
      clientsList: [],
      paymentTypesList: [],
      goodsList: [],
      // bouquetsList: [],
      paymentsList: [],
      checkCardList: [],
      createdSuccess: false,
      dialogPay: false,
      sumClient: 0,
      typePay: null,
    };
  },
  computed: {
    typePayList() {
      return this.paymentTypesList.filter((item) => {
        if (this.client) {
          return item.id !== 5;
        }

        return item.id !== 7;
      });
    },
    sumChange: function sumChange() {
      const sum = this.sumClient - this.checkSum;
      return (sum > 0) ? sum : 0;
    },
    checkSum() {
      return this.checkCardList.reduce((sum, item) => {
        const allSum = sum + item.sum;
        return allSum;
      }, 0);
    },
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
  },
  methods: {
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

      const cardNoEmpty = this.cardsList.filter(elem =>
        (elem.goods.length > 0 || Object.keys(elem.props).length > 0)
        && elem.success !== true);
      localStorage.setItem('cardsList', JSON.stringify(cardNoEmpty));
    },
    addCard: function addCard() {
      this.cardsList.push({
        sum: 0,
        success: false,
        props: {},
        goods: [],
      });
    },
    checkCard(indexCard, sumPay) {
      const findIndex = this.checkCardList.findIndex(item => item.index === indexCard);

      if (findIndex + 1) {
        this.checkCardList.splice(findIndex, 1);
      } else {
        this.checkCardList.push({
          index: indexCard,
          sum: sumPay,
        });
      }
    },
    saveProps: function saveProps(index, props) {
      if (props) {
        const item = this.cardsList[index];
        item.success = true;
        this.$set(this.cardsList, index, item);

        // if (props.payment.paymentTypeId === 5) {
        if (item.goods.length === 0) {
          const itemParams = {
            type: 'payments',
            props: {
              paymentType: {
                id: props.payment.paymentTypeId,
                name: 'На баланс',
                isActive: true,
                code: 'balance',
              },
              amount: props.payment.amount,
              clientId: props.payment.clientId,
              description: 'На баланс',
            },
          };
          console.log(itemParams);
          this.$store.dispatch('addItem', itemParams).then(() => {
            this.getPaymentsList();
          });
        } else {
          const newBouqet = props;

          newBouqet.goods = item.goods.map((elem) => {
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

          this.$store.dispatch('addItem', bouquetParams).then(() => {
            // this.getBouquetsList();
            this.getPaymentsList();
          });


          item.goods.forEach((elem) => {
            const findGood = this.goodsList.find(good => good.id === elem.id);
            findGood.store -= elem.value;
          });
        }

        const cardNoEmpty = this.cardsList.filter(elem =>
          (elem.goods.length > 0 || Object.keys(elem.props).length > 0)
          && elem.success !== true);
        localStorage.setItem('cardsList', JSON.stringify(cardNoEmpty));

        const findIndex = this.checkCardList.findIndex(card => card.index === index);

        if (findIndex + 1) {
          this.checkCardList.splice(findIndex, 1);
        }
      }
    },
    updateProps: function updateProps(index, props) {
      const item = this.cardsList[index];
      item.props = props;
      this.$set(this.cardsList, index, item);

      const cardNoEmpty = this.cardsList.filter(elem =>
        (elem.goods.length > 0 || Object.keys(elem.props).length > 0)
        && elem.success !== true);
      localStorage.setItem('cardsList', JSON.stringify(cardNoEmpty));
    },
    getClientsList: function getClientsList() {
      const itemParams = {
        type: 'clients',
        filter: {
          isActive: true,
        },
      };

      const successData = 'Клиенты получены!';
      const errorData = 'Ошибка получения клиентов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.clientsList = [];

        this.clientsList = this.clientsList.concat(response);

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getFloristsList: function getFloristsList() {
      const itemParams = {
        type: 'florists',
        filter: {
          isActive: true,
        },
      };

      const successData = 'Флористы получены!';
      const errorData = 'Ошибка получения флористов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.floristsList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getPaymentTypesList() {
      const itemParams = {
        type: 'paymentTypes',
        filter: {
          isActive: true,
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.paymentTypesList = response;
      }).catch(() => {
        console.log('error');
      });
    },
    getGoodsList: function getGoodsList() {
      const itemParams = {
        type: 'goods',
      };

      const successData = 'Товары получены!';
      const errorData = 'Ошибка получения товаров!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.goodsList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    // getBouquetsList() {
    //   const itemParams = {
    //     type: 'bouquets',
    //     filter: {
    //       creationDate: this.dateNow,
    //     },
    //   };

    //   const successData = 'Букеты получены!';
    //   const errorData = 'Ошибка получения букетов!';

    //   this.$store.dispatch('getItemsList', itemParams).then((response) => {
    //     this.bouquetsList = response;

    //     const loadData = this.loadingData.find(item => item.id === itemParams.type);
    //     loadData.title = successData;
    //     loadData.loading = false;
    //   }).catch(() => {
    //     const loadData = this.loadingData.find(item => item.id === itemParams.type);
    //     loadData.title = errorData;
    //     loadData.error = true;
    //   });
    // },
    getPaymentsList() {
      const itemParams = {
        type: 'payments',
        filter: {
          creationDate: [this.dateYesterday, this.dateNow],
        },
      };

      const successData = 'Оплаты получены!';
      const errorData = 'Ошибка получения оплат!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.paymentsList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getDataProps: function getDataProps() {
      this.getClientsList();
      this.getFloristsList();
      this.getGoodsList();
      // this.getBouquetsList();
      this.getPaymentsList();
      this.getPaymentTypesList();
    },
    copyItem(index) {
      const item = Object.assign({}, this.cardsList[index]);
      this.cardsList.push(item);
      const cardNoEmpty = this.cardsList.filter(elem =>
        (elem.goods.length > 0 || Object.keys(elem.props).length > 0)
        && elem.success !== true);
      localStorage.setItem('cardsList', JSON.stringify(cardNoEmpty));
    },
    deleteItem(index) {
      const item = this.cardsList[index];
      item.success = true;

      const cardNoEmpty = this.cardsList.filter(elem =>
        (elem.goods.length > 0 || Object.keys(elem.props).length > 0)
        && elem.success !== true);
      localStorage.setItem('cardsList', JSON.stringify(cardNoEmpty));

      const findIndex = this.checkCardList.findIndex(card => card.index === index);

      if (findIndex + 1) {
        this.checkCardList.splice(findIndex, 1);
      }
    },
    pay() {
      this.createdSuccess = true;
      const checkCards = this.checkCardList.slice();

      checkCards.forEach((item) => {
        const card = this.cardsList[item.index];
        card.props.typePay = this.typePay;
        this.saveProps(item.index, card.props);
      });

      setTimeout(() => {
        this.dialogPay = false;
      }, 1000);
    },
    deleteCheckCards() {
      const checkCards = this.checkCardList.slice();

      checkCards.forEach((item) => {
        this.deleteItem(item.index);
      });
    },
  },
  mounted() {
    const dateNow = new Date();
    const dateNowStr = dateNow.toISOString().split('T')[0];
    this.dateNow = `${dateNowStr} 23:59:59`;
    dateNow.setDate(dateNow.getDate() - 1);
    const dateYesterdayStr = dateNow.toISOString().split('T')[0];
    this.dateYesterday = `${dateYesterdayStr} 00:00:00`;

    const cardsList = JSON.parse(localStorage.getItem('cardsList'));
    this.cardsList = (cardsList !== null) ? cardsList : [];
    const addCountElem = 1 - this.cardsList.length;

    for (let i = 0; i < addCountElem; i += 1) {
      this.addCard();
    }

    this.getDataProps();
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

  .v-card.selected  {
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
</style>
