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
        <v-layout row style="overflow: auto;">
          <v-flex
            xs3
            v-for="n in 10"
            :key="n"
          >
            <v-card
              flat
              width="318"
            >
              <div class="px-3" style="height: 48px;">
                <v-select
                  label="Standard"
                  solo
                  flat
                  hide-details
                ></v-select>
              </div>
              <v-divider></v-divider>
              <div class="px-3" style="height: 48px;">
                <v-select
                  label="Standard"
                  solo
                  flat
                  hide-details
                ></v-select>
              </div>
              <v-divider></v-divider>
              <div class="px-3" style="height: 48px;">
                <v-select
                  label="Standard"
                  solo
                  flat
                  hide-details
                ></v-select>
              </div>
              <v-divider></v-divider>
              <div class="px-3" style="height: 48px;">
                <v-text-field
                  label="Solo"
                  solo
                  flat
                  hide-details
                ></v-text-field>
              </div>
              <v-divider></v-divider>
              <div class="pa-3" style="height: 48px;">
                <span class="px-3">1200</span>
              </div>
              <v-divider></v-divider>
              <div class="px-3" style="height: 48px;">
                <v-text-field
                  label="Solo"
                  solo
                  flat
                  hide-details
                ></v-text-field>
              </div>
              <v-divider></v-divider>
              <div class="pa-3" style="height: 48px;">
                <span class="px-3">240</span>
              </div>
              <v-divider></v-divider>
              <div class="px-3" style="height: 48px;">
                <v-text-field
                  label="Solo"
                  solo
                  flat
                  hide-details
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
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex
        xs4
      >
      </v-flex>
      <v-flex
        xs8
      >
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
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
    };
  },
};
</script>
