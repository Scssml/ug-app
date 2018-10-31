<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-layout row wrap>
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
                  :florists-list="$store.state.Floristslist"
                  :clients-list="$store.state.ClientsList"
                  :orders-list="$store.state.Orderslist"
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
    <v-layout row wrap style="min-height: 100px; height: 380px; overflow-y: scroll;">
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
              <template v-for="(item, index) in $store.state.GoodsList">
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
              <template v-for="(item, index) in $store.state.GoodsList">
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
              <template v-for="(item, index) in $store.state.GoodsList">
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
              <template v-for="(item, index) in $store.state.GoodsList">
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
                  :goods-list="$store.state.GoodsList"
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
    };
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
  },
  mounted() {
    for (let i = 0; i < 5; i += 1) {
      this.addCard();
    }
  },
};
</script>
