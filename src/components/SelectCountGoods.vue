<template>
  <v-card
    flat
    width="300"
    style="border-left: 1px solid #ccc; font-size: 16px;"
  >
    <div class="py-1 px-3 text-xs-center" style="height: 30px;">Кол-во</div>
    <v-divider></v-divider>
    <template v-for="(item, i) in goods">
      <div class="px-3" style="height: 30px;" :key="i">
        <v-text-field
          label="0"
          solo
          flat
          hide-details
          @input="setCountGood(i, $event)"
          class="scs-small"
        ></v-text-field>
        {{ item.value }}
      </div>
      <v-divider :key="'divider-' + i"></v-divider>
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
      const goods = this.goodsList;
      let item = {};
      for (let i = 0; i < goods.length; i += 1) {
        item = Object.assign({}, goods[i]);
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
