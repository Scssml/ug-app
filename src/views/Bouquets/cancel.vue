<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Возврат выполнен</v-alert>
    <v-form
      ref="form"
      lazy-validation
      v-if="!loading"
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Возврат букета №{{ id }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-textarea
          label="Комментарий"
          auto-grow
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.description"
          row-height="12"
        ></v-textarea>
      </v-card-text>
      <v-card-actions
        class="px-4 pb-4"
      >
        <v-btn
          @click.native="cancel()"
        >Отмена</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="submitForm"
        >Сохранить</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      propsItem: {},
      editedItem: {
        description: null,
      },
      createdSuccess: false,
    };
  },
  methods: {
    getItem() {
      if (this.id) {
        const itemParams = {
          type: 'bouquets',
          id: this.id,
        };

        this.$store.dispatch('getItem', itemParams).then((response) => {
          this.propsItem = response;
          this.loading = false;
        }).catch(() => {
          console.log('error');
        });
      }
    },
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsItem = Object.assign({}, this.editedItem);
        delete propsItem.id;

        const itemParams = {
          type: 'bouquets',
          id: this.id,
          props: propsItem,
        };

        this.$store.dispatch('deleteItem', itemParams).then(() => {
          this.createdSuccess = true;

          this.createdBouquet();

          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        });
      }
    },
    createdBouquet() {
      let cardsList = JSON.parse(localStorage.getItem('cardsList'));
      cardsList = (cardsList !== null) ? cardsList : [];
      const item = this.propsItem;

      const index = cardsList.findIndex(card => card.props.order === item.id);

      const itemProps = {
        client: item.client,
        clientId: item.client.id,
        decorCost: item.decorCost,
        decorPercent: item.decorPercent,
        deliveryCost: item.deliveryCost,
        sumDecorAdditional: 0,
        floristId: (item.florist) ? item.florist.id : 0,
        orderId: 0,
        payment: {
          amount: item.payments[0].amount,
          clientId: item.client.id,
          description: item.payments[0].description,
          paymentTypeId: item.payments[0].paymentType.id,
        },
        salePercent: item.salePercent,
        sumSale: item.sumSale,
        totalCost: item.payments[0].amount,
      };
      const itemGoods = item.goods.map((elem) => {
        return {
          id: elem.good.id,
          name: elem.good.name,
          price: elem.good.price,
          sortIndex: elem.good.sortIndex,
          stockBalance: elem.good.stockBalance + elem.count,
          originalBalance: elem.good.stockBalance + elem.count,
          value: elem.count,
        };
      });
      const itemSum = item.goods.reduce((sum, elem) => {
        const goodSum = elem.good.price * elem.count;
        return sum + goodSum;
      }, 0);

      if (index === -1) {
        cardsList.push({
          sum: itemSum,
          success: false,
          props: itemProps,
          goods: itemGoods,
        });
      } else {
        cardsList[index].props.clientId = item.client.id;
      }
      localStorage.setItem('cardsList', JSON.stringify(cardsList));
      this.$router.push({ path: '/', query: { selectOrder: item.id } });
    },
  },
  mounted() {
    this.getItem();
  },
};
</script>
