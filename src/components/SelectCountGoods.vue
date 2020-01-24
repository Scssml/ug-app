<template>
  <v-card
    flat
    width="300"
    style="border-left: 1px solid #ccc; font-size: 16px;"
  >
    <div class="py-1 px-0 text-xs-center" style="height: 30px;">
      Кол-во
      <v-icon
        left
        @click="showComposition()"
        title="Показать состав"
        v-if="!diffShowAndSelectedGoods"
      >
        assignment
      </v-icon>
      <v-icon
        left
        color="primary"
        @click="showAll()"
        title="Показать все товары"
        v-if="diffShowAndSelectedGoods"
      >
        assignment
      </v-icon>
    </div>
    <v-divider></v-divider>
    <template v-for="(item, i) in goods">
      <template v-if="showGoodsList.indexOf(item.id) !== -1">
        <div class="px-0" style="height: 30px;" :key="i">
          <v-text-field
            label="0"
            solo
            flat
            hide-details
            :value="(item.value > 0) ? item.value : ''"
            @input="setCountGood(i, $event)"
            class="scs-small"
          ></v-text-field>
          {{ item.value }}
        </div>
        <v-divider :key="'divider-' + i"></v-divider>
      </template>
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
    selectedGoodsDefault: {
      type: Array,
    },
  },
  data() {
    return {
      goods: [],
    };
  },
  computed: {
    diffShowAndSelectedGoods() {
      const showGoods = this.showGoodsList;
      const selectedGoods = this.selectedGoodsId;
      return this.diffArray(showGoods, selectedGoods).length === 0;
    },
    showGoodsList() {
      const showGoodsList = this.$store.getters.getShowGoodsList;
      let goodsList = this.goods.map(item => item.id);
      if (showGoodsList.length > 0) {
        goodsList = showGoodsList;
      }
      return goodsList;
    },
    selectedGoods: function selectedGoods() {
      const goodsList = this.goods.filter(item => item.value > 0);
      return goodsList;
    },
    selectedGoodsId() {
      return this.selectedGoods.map(item => item.id);
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
    diffArray(a1, a2) {
      return a1.filter(i => !a2.includes(i)).concat(a2.filter(i => !a1.includes(i)));
    },
    showComposition() {
      this.$store.commit('setShowGoodsList', this.selectedGoodsId);
    },
    showAll() {
      this.$store.commit('setShowGoodsList', []);
    },
    setValueGoods: function setValueGoods() {
      const goods = this.goodsList;
      let item = {};

      function compareId(elem) {
        return elem.id === item.id;
      }

      for (let i = 0; i < goods.length; i += 1) {
        item = Object.assign({}, goods[i]);

        const findElem = this.selectedGoodsDefault.find(compareId);
        item.value = (findElem !== undefined) ? findElem.value : 0;

        this.goods.push(item);
      }
    },
    setCountGood: function setCountGood(index, value) {
      const item = this.goods[index];
      item.value = +value.replace(',', '.');
      this.$set(this.goods, index, item);
      this.changeSum();
    },
    changeSum: function changeSum() {
      this.$emit('changeSum', this.sumSelectedGoods);
      this.$emit('changeGoods', this.selectedGoods);
    },
  },
  created() {
    this.setValueGoods();
  },
};
</script>
