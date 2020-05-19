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
import gql from "graphql-tag";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      propsItem: {},
      editedItem: {
        description: null,
      },
      createdSuccess: false,
      loading: true,
    };
  },
  apollo: {
    floristsList: {
      query: gql`
        query bouquetsList(
          $id: bigint
        ) {
          bouquetsList: bouquets(
            where: {
              id: { _eq: $id }
            }
          ) {
            id
            client {
              id
              name
              bill
            }
            clientId
            decorCost
            decorPercent
            deliveryCost
            sumDecorAdditional
            floristId
            orderBouquetId
            salePercent
            sumSale
            totalCost
            bouquetGoodsMappings {
              goodId
              goodsCount
              good {
                price
              }
            }
          }
        }
      `,
      variables() {
        return {
          id: this.id,
        };
      },
      update({ bouquetsList }) {
        this.propsItem = bouquetsList.shift();
        this.loading = false;
      },
    },
  },
  methods: {
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsService = {
          id: this.id,
          managerId: this.$store.getters.getAuthUser,
          comment: this.editedItem.description,
        };

        this.$apollo.mutate({
          mutation: gql`mutation returnService (
            $props: ReturnService!
          ) {
            returnService(input: $props) {
              id
            }
          }`,
          variables: {
            props: propsService,
          },
        }).then(() => {
          this.createdSuccess = true;

          this.createdBouquet();

          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        }).catch((error) => {
          console.error(error);
        });
      }
    },
    createdBouquet() {
      let cardsList = JSON.parse(localStorage.getItem('cardsList'));
      cardsList = (cardsList !== null) ? cardsList : [];
      const item = this.propsItem;

      const itemProps = {
        client: item.client,
        clientId: item.clientId,
        decorCost: item.decorCost,
        decorPercent: item.decorPercent,
        deliveryCost: item.deliveryCost,
        sumDecorAdditional: item.sumDecorAdditional,
        floristId: item.floristId,
        orderId: 0,
        salePercent: item.salePercent,
        sumSale: item.sumSale,
        totalCost: item.totalCost,
      };
      const itemGoods = item.bouquetGoodsMappings.map((elem) => {
        return {
          id: elem.goodId,
          value: elem.goodsCount,
        };
      });
      const itemSum = item.bouquetGoodsMappings.reduce((sum, elem) => {
        const goodSum = elem.good.price * elem.goodsCount;
        return sum + goodSum;
      }, 0);

      cardsList.push({
        sum: itemSum,
        success: false,
        props: itemProps,
        goods: itemGoods,
      });

      localStorage.setItem('cardsList', JSON.stringify(cardsList));
      this.$router.push({ path: '/', query: { selectOrder: item.id } });
    },
  },
};
</script>
