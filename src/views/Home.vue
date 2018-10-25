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
            <v-flex
              v-for="n in 10"
              :key="n"
            >
              <v-card
                flat
                width="300"
                style="border-left: 1px solid #ccc; font-size: 16px;"
              >
                <div class="px-3" style="height: 48px;">
                  <v-select
                    label="Флорист"
                    :items="floristsList"
                    item-text="name"
                    item-value="id"
                    solo
                    flat
                    hide-details
                    v-model="florist"
                  ></v-select>
                </div>
                <v-divider></v-divider>
                <div class="px-3" style="height: 48px;">
                  <v-select
                    label="Клиент"
                    :items="clientsList"
                    item-text="name"
                    item-value="id"
                    solo
                    flat
                    hide-details
                    v-model="client"
                  ></v-select>
                </div>
                <v-divider></v-divider>
                <div class="px-3" style="height: 48px;">
                  <v-select
                    label="Заказ"
                    :items="clientOrdersList"
                    item-text="id"
                    item-value="id"
                    solo
                    flat
                    hide-details
                    v-model="order"
                  ></v-select>
                </div>
                <v-divider></v-divider>
                <div class="px-3" style="height: 48px;">
                  <v-text-field
                    label="Оформление, %"
                    solo
                    flat
                    hide-details
                    v-model="decorPersent"
                  ></v-text-field>
                </div>
                <v-divider></v-divider>
                <div class="pa-3" style="height: 48px;">
                  <span class="px-3">1200</span>
                </div>
                <v-divider></v-divider>
                <div class="px-3" style="height: 48px;">
                  <v-text-field
                    label="Доставка"
                    solo
                    flat
                    hide-details
                    v-model="delivery"
                  ></v-text-field>
                </div>
                <v-divider></v-divider>
                <div class="pa-3" style="height: 48px;">
                  <span class="px-3">240</span>
                </div>
                <v-divider></v-divider>
                <div class="px-3" style="height: 48px;">
                  <v-text-field
                    label="Скидка, %"
                    solo
                    flat
                    hide-details
                    v-model="salePersent"
                  ></v-text-field>
                </div>
                <v-divider></v-divider>
                <div class="pa-3" style="height: 48px;">
                  <span class="px-3">144</span>
                </div>
                <v-divider></v-divider>
                <div class="pa-3" style="height: 48px;">
                  <span class="px-3">1296</span>
                </div>
                <v-divider></v-divider>
                <div class="px-3 text-xs-center" style="height: 48px;">
                  <v-btn color="info">Info</v-btn>
                </div>
                <v-divider></v-divider>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout row wrap style="min-height: 100px; height: 312px; overflow: auto;">
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
              <template v-for="n in 10">
                <div class="pa-3 text-xs-center" style="height: 48px;" :key="n">351</div>
                <v-divider :key="'divider-' + n"></v-divider>
              </template>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card
              flat
            >
              <div class="pa-3 text-xs-center" style="height: 48px;">Тип</div>
              <v-divider></v-divider>
              <template v-for="n in 10">
                <div class="pa-3 text-xs-center" style="height: 48px;" :key="n">Эквадор</div>
                <v-divider :key="'divider-' + n"></v-divider>
              </template>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card
              flat
            >
              <div class="pa-3 text-xs-center" style="height: 48px;">Наименование</div>
              <v-divider></v-divider>
              <template v-for="n in 10">
                <div class="pa-3 text-xs-center" style="height: 48px;"
                  :key="n"
                >Цветок {{ n }}</div>
                <v-divider :key="'divider-' + n"></v-divider>
              </template>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card
              flat
            >
              <div class="pa-3 text-xs-center" style="height: 48px;">Цена</div>
              <v-divider></v-divider>
              <template v-for="n in 10">
                <div class="pa-3 text-xs-center" style="height: 48px;" :key="n">123</div>
                <v-divider :key="'divider-' + n"></v-divider>
              </template>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex
        xs8
      >
        <v-container
          id="scroll-block-bottom"
          style="overflow: hidden;"
          class="scroll-y pa-0 right-block"
        >
          <v-layout row>
            <v-flex
              v-for="n in 10"
              :key="n"
            >
              <v-card
                flat
                width="300"
                style="border-left: 1px solid #ccc; font-size: 16px;"
              >
                <div class="pa-3 text-xs-center" style="height: 48px;">Кол-во</div>
                <v-divider></v-divider>
                <template v-for="j in 10">
                  <div class="px-3" style="height: 48px;" :key="j">
                    <v-text-field
                      label="Solo"
                      solo
                      flat
                      hide-details
                    ></v-text-field>
                  </div>
                  <v-divider :key="'divider-' + j"></v-divider>
                </template>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
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
      propsGoodsTable: [
        {
          text: 'Остаток',
          value: 'store',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Тип',
          value: 'type',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Наименование',
          value: 'name',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Цена',
          value: 'price',
          align: 'center',
          sortable: false,
        },
      ],
      client: '',
      florist: '',
      order: '',
      decorPersent: 10,
      delivery: 0,
      salePersent: 0,
      clientsList: [
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
      ],
      floristsList: [
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
      ],
      ordersList: [
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
      ],
    };
  },
  computed: {
    clientOrdersList: function clientOrdersList() {
      const ordersList = this.ordersList.filter(item => item.client === this.client);

      return ordersList;
    },
  },
  methods: {
    onScroll: function onScroll(e) {
      console.log(e);
      const scroll = e.target.scrollLeft;

      if (e.target.id === 'scroll-block-top') {
        document.getElementById('scroll-block-bottom').scrollLeft = scroll;
      } else {
        // document.getElementById('scroll-block-top').scrollLeft = scroll;
      }
    },
  },
};
</script>
