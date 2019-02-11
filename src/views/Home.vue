<template>
  <v-container
    fluid
    class="pa-0"
  >
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
          >{{ item }}</div>
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
                  :orders-list="ordersList"
                  :sumFlowers="item.sum"
                  :propsDefault="item.props"
                  @saveProps="saveProps(index, $event)"
                  @updateProps="updateProps(index, $event)"
                  @copy="copyItem(index)"
                  @delete="deleteItem(index)"
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
              <div class="py-1 px-3 text-xs-center" style="height: 30px;">Остаток</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="py-1 px-3 text-xs-center"
                  style="height: 30px;"
                  :key="index"
                >{{ item.store }}</div>
                <v-divider :key="'divider-' + index"></v-divider>
              </template>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card
              flat
            >
              <div class="py-1 px-3 text-xs-center" style="height: 30px;">Тип</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="py-1 px-3 text-xs-center"
                  style="height: 30px;"
                  :key="index"
                >{{ item.type }}</div>
                <v-divider :key="'divider-' + index"></v-divider>
              </template>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card
              flat
            >
              <div class="py-1 px-3 text-xs-center" style="height: 30px;">Наименование</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="py-1 px-3 text-xs-center"
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
              <div class="py-1 px-3 text-xs-center" style="height: 30px;">Цена</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="py-1 px-3 text-xs-center"
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
  </v-container>
</template>

<script>
import CreatedBouquetCard from '../components/CreatedBouquetCard.vue';
import SelectCountGoods from '../components/SelectCountGoods.vue';

export default {
  name: 'Home',
  components: {
    'created-bouquet-card': CreatedBouquetCard,
    'select-count-goods': SelectCountGoods,
  },
  data() {
    return {
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
          title: 'Получение заказов',
          error: false,
          loading: true,
          color: 'amber',
          id: 'orders',
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
      ],
      offsetLeft: 0,
      propsBouquet: [
        'Флорист',
        'Клиент',
        'Заказ',
        'Cтавка на оформление, %',
        'Сумма товара',
        'Доставка',
        'Оформление',
        'Ставка на скидку,%',
        'Сумма скидки',
        'Всего к оплате',
        '',
      ],
      cardsList: [],
      floristsList: [],
      clientsList: [],
      ordersList: [],
      goodsList: [],
      bouquetsList: [],
    };
  },
  computed: {
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
    saveProps: function saveProps(index, props) {
      if (props) {
        const item = this.cardsList[index];
        item.success = true;
        this.$set(this.cardsList, index, item);
        this.addCard();

        const newBouqet = props;

        newBouqet.date = `${newBouqet.date}T00:00:00.000-00:00`;

        newBouqet.goods = item.goods.map((elem) => {
          const good = {
            id: elem.id,
            value: elem.value,
          };
          return good;
        });

        console.log(newBouqet);

        const bouquetParams = {
          type: 'bouquets',
          props: newBouqet,
        };

        this.$store.dispatch('addItem', bouquetParams);

        this.bouquetsList.push(newBouqet);

        // localStorage.setItem('bouquets', JSON.stringify(this.bouquetsList));

        if (newBouqet.typePay === 'На баланс') {
          const client = this.clientsList.find(elem => elem.id === newBouqet.client);

          const propsItem = Object.assign({}, client);
          delete propsItem.id;
          delete propsItem.type;
          propsItem.bill -= newBouqet.sumPay;
          propsItem.sale = +propsItem.sale;

          const dateParam = propsItem.birthDay.split('/');
          propsItem.birthDay = `${dateParam[2]}-${dateParam[0]}-${dateParam[1]}`;

          const itemParams = {
            type: 'clients',
            props: propsItem,
          };

          itemParams.id = client.id;
          this.$store.dispatch('updateItem', itemParams).then(() => {
            this.getClientsList();
          });
        }

        item.goods.forEach((elem) => {
          const findGood = this.goodsList.find(good => good.id === elem.id);
          findGood.store -= elem.value;
        });

        // axios.post(`${this.$store.state.apiSrc}goods/edit.php`, {
        //   ELEMS: this.goodsList,
        // });
        // localStorage.setItem('goods', JSON.stringify(this.goodsList));

        const cardNoEmpty = this.cardsList.filter(elem =>
          (elem.goods.length > 0 || Object.keys(elem.props).length > 0)
          && elem.success !== true);
        localStorage.setItem('cardsList', JSON.stringify(cardNoEmpty));
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
      };

      const successData = 'Клиенты получены!';
      const errorData = 'Ошибка получения клиентов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.clientsList = [];

        this.clientsList.push({
          active: true,
          bill: 0,
          id: 0,
          name: 'Розничный покупатель',
          sale: 0,
          phone: '',
        });

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
    getOrdersList: function getOrdersWorksList() {
      const itemParams = {
        type: 'orders',
        filter: {
          status: 1,
        },
      };

      const successData = 'Заказы получены!';
      const errorData = 'Ошибка получения заказов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.ordersList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
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
    // getBouquetsList: function getBouquetsList() {
    //   this.$store.dispatch('getBouquetsList').then((response) => {
    //     this.bouquetsList = response.bouquetsList;

    //     const loadData = this.loadingData.find(item => item.id === 'bouquets');
    //     loadData.title = response.successData.text;
    //     loadData.loading = false;
    //   }).catch((error) => {
    //     const loadData = this.loadingData.find(item => item.id === 'bouquets');
    //     loadData.title = error.text;
    //     loadData.error = true;
    //   });
    // },
    getDataProps: function getDataProps() {
      this.getClientsList();
      this.getFloristsList();
      this.getOrdersList();
      this.getGoodsList();
      // this.getBouquetsList();
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
    },
  },
  mounted() {
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
