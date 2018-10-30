<template>
  <v-card
    flat
    width="300"
    style="border-left: 1px solid #ccc; font-size: 16px;"
  >
    <div class="pa-3 text-xs-center" style="height: 48px;">Кол-во</div>
    <v-divider></v-divider>
    <template v-for="(item, index) in goods">
      <div class="px-3" style="height: 48px;" :key="index">
        <v-text-field
          label="0"
          solo
          flat
          hide-details
          @input="setCountGood(index, $event)"
        ></v-text-field>
        {{ item.value }}
      </div>
      <v-divider :key="'divider-' + index"></v-divider>
    </template>
  </v-card>
</template>

<script>
export default {
  name: 'SelectCountGoods',
  props: {
    goodsList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      goods: [],
    };
  },
  computed: {
    selectedGoods: function selectedGoods() {
      const goodsList = this.goods.filter(item => item.value > 0);
      return goodsList;
    },
    sumSelectedGoods: function sumSelectedGoods() {
      const goods = this.selectedGoods;
      let sum = 0;
      for (let i = 0; i < goods.length; i += 1) {
        sum += goods[i].price * goods[i].value;
      }
      return sum;
    },
  },
  methods: {
    setValueGoods: function setValueGoods() {
      let item = [];
      for (let i = 0; i < this.goodsList.length; i += 1) {
        item = this.goodsList[i];
        item.value = 0;
        this.goods.push(item);
      }
    },
    setCountGood: function setCountGood(index, value) {
      const item = this.goods[index];
      item.value = +value;
      this.$set(this.goods, index, item);
      this.changeSum();
    },
    changeSum: function changeSum() {
      this.$emit('changeSum', this.sumSelectedGoods);
    },
  },
  created() {
    this.setValueGoods();
  },
};
</script>
