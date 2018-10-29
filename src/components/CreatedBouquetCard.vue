<template>
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
        no-data-text="Нет заказов"
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
      <v-btn color="info">Оплатить</v-btn>
    </div>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
export default {
  name: 'CreatedBouquetCard',
  props: {
    floristsList: {
      type: Array,
      required: true,
    },
    clientsList: {
      type: Array,
      required: true,
    },
    ordersList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      florist: '',
      client: '',
      order: '',
      decorPersent: 10,
      delivery: 0,
      salePersent: 0,
    };
  },
  computed: {
    clientOrdersList: function clientOrdersList() {
      const ordersList = this.ordersList.filter(item => item.client === this.client);
      return ordersList;
    },
  },
};
</script>
