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
          <div class="pa-3 text-xs-right" style="height: 48px;">{{ item }}</div>
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
                  @createdSuccess="createdSuccess(index, $event)"
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
      style="min-height: 100px; height: 380px; overflow-y: scroll;"
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
              <div class="pa-3 text-xs-center" style="height: 48px;">Остаток</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="pa-3 text-xs-center"
                  style="height: 48px;"
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
              <div class="pa-3 text-xs-center" style="height: 48px;">Тип</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="pa-3 text-xs-center"
                  style="height: 48px;"
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
              <div class="pa-3 text-xs-center" style="height: 48px;">Наименование</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="pa-3 text-xs-center"
                  style="height: 48px;"
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
              <div class="pa-3 text-xs-center" style="height: 48px;">Цена</div>
              <v-divider></v-divider>
              <template v-for="(item, index) in goodsList">
                <div
                  class="pa-3 text-xs-center"
                  style="height: 48px;"
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
                  @changeSum="setSum(index, $event)"
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
    addCard: function addCard() {
      this.cardsList.push({
        sum: 0,
        success: false,
      });
    },
    createdSuccess: function createdSuccess(index, data) {
      if (data) {
        const item = this.cardsList[index];
        item.success = true;
        this.$set(this.cardsList, index, item);
        this.addCard();
      }
    },
    getClientsList: function getClientsList() {
      this.$store.dispatch('getClientsList').then((response) => {
        this.clientsList = response.clientsList;

        const loadData = this.loadingData.find(item => item.id === 'clients');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'clients');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getFloristsList: function getFloristsList() {
      this.$store.dispatch('getFloristsList').then((response) => {
        this.floristsList = response.floristsList;

        const loadData = this.loadingData.find(item => item.id === 'florists');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'florists');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getOrdersList: function getOrdersList() {
      this.$store.dispatch('getOrdersList').then((response) => {
        this.ordersList = response.ordersList;

        const loadData = this.loadingData.find(item => item.id === 'orders');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'orders');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getGoodsList: function getGoodsList() {
      this.$store.dispatch('getGoodsList').then((response) => {
        this.goodsList = response.goodsList;

        const loadData = this.loadingData.find(item => item.id === 'goods');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'goods');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getDataProps: function getDataProps() {
      this.getClientsList();
      this.getFloristsList();
      this.getOrdersList();
      this.getGoodsList();
    },
  },
  mounted() {
    for (let i = 0; i < 5; i += 1) {
      this.addCard();
    }

    this.getDataProps();
  },
};
</script>
