<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-card>
      <v-card-title
        class="print-hidden"
      >
        <v-form
          ref="form"
          lazy-validation
          style="width: 100%"
        >
          <v-layout
            row
            wrap
            align-center
          >
            <v-flex
              xs2
              class="px-2"
            >
              <v-select
                label="Товар"
                :items="goodsList"
                :rules="[v => !!v || 'Заполните поле']"
                item-text="name"
                item-value="id"
                v-model.number="data.goodId"
                hide-details
                class="pr-4"
              ></v-select>
            </v-flex>
            <v-flex
              xs2
              class="px-2"
            >
              <v-select
                label="Тип отчета"
                :items="reportType"
                item-text="name"
                item-value="id"
                v-model="data.type"
                :rules="[v => !!v || 'Заполните поле']"
                hide-details
              ></v-select>
            </v-flex>
            <v-flex
              xs2
              class="px-2"
            >
              <v-menu
                :close-on-content-click="false"
                v-model="dataStartPicker"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Дата (с)"
                  v-model="data.dateStart"
                  prepend-icon="event"
                  hide-details
                  readonly
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
                <v-date-picker
                  v-model="data.dateStart"
                  @input="dataStartPicker = false"
                  no-title
                  scrollable
                  locale="ru-ru"
                  first-day-of-week="1"
                  :max="!!data.dateEnd ? data.dateEnd : undefined"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex
              xs2
              class="px-2"
            >
              <v-menu
                :close-on-content-click="false"
                v-model="dataEndPicker"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Дата (по)"
                  v-model="data.dateEnd"
                  prepend-icon="event"
                  hide-details
                  readonly
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
                <v-date-picker
                  v-model="data.dateEnd"
                  @input="dataEndPicker = false"
                  no-title
                  locale="ru-ru"
                  scrollable
                  first-day-of-week="1"
                  :min="!!data.dateStart ? data.dateStart : undefined"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex
              xs2
              class="px-2"
            >
              <v-btn
                color="primary"
                dark
                @click="submitForm"
                class="mt-3"
                :loading="loadingBtn"
              >Создать</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-title>

      <v-card-text
        class="report"
      >
        <template v-if="report">
          <good-bouquets
            :report="report"
            v-if="data.type === 'bouquets'"
          ></good-bouquets>

          <good-orders
            :report="report"
            v-if="data.type === 'orders'"
          ></good-orders>
        </template>
      </v-card-text>

      <!-- <v-card-text
        v-html="report"
        class="report"
      ></v-card-text> -->
    </v-card>

    <br>
    <v-btn
      color="primary"
      dark
      class="mb-4 print-btn"
      @click.prevent="printPage()"
      v-if="report"
    >Распечатать</v-btn>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import goodBouquets from "./Goods/bouquets.vue";
import goodOrders from "./Goods/orders.vue";

export default {
  components: {
    goodBouquets,
    goodOrders,
  },
  data() {
    return {
      dataStartPicker: false,
      dataEndPicker: false,
      data: {
        type: '',
        dateStart: '',
        dateEnd: '',
        goodId: '',
      },
      reportType: [
        // {
        //   name: 'Операции',
        //   id: 'courier_stats',
        // },
        {
          name: 'Букеты',
          id: 'bouquets',
        },
        {
          name: 'Заказы',
          id: 'orders',
        },
      ],
      report: '',
      loadingBtn: false,
      goodsList: [],
    };
  },
  apollo: {
    goodsList: {
      query: gql`
        query {
          goodsList: goods(
            where: { active: { _eq: true } },
            order_by: { sortIndex: desc }
          ) {
            id
            name
          }
        }
      `,
    },
  },
  methods: {
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        this.report = '';
        this.loadingBtn = true;

        if (this.data.type === 'bouquets') {
          this.getReportBouquets();
        } else if (this.data.type === 'orders') {
          this.getReportOrders();
        }
      }
    },
    getReportBouquets() {
      this.$apollo.query({
        query: gql`
          query {
            reportBouquets: bouquets(
              where: {
                _and: [
                  { bouquetGoodsMappings: { good: { id: { _eq: "${this.data.goodId}" } } } }
                  { created_at: { _gte: "${this.data.dateStart} 00:00:00" } }
                  { created_at: { _lte: "${this.data.dateEnd} 23:59:59" } }
                ]
              },
              order_by: { created_at: asc }
            ) {
              id
              florist {
                name
                id
              }
              client {
                name
                id
              }
              orderBouquet {
                id
                orderId
                name
                count
              }
              bouquetGoodsMappings {
                good {
                  name
                  id
                }
                goodsCount
              }
              user {
                id
                name
              }
              totalCost
              created_at
            }
          }
        `,
      }).then((response) => {
        this.report = response.data.reportBouquets;
        this.loadingBtn = false;
      });
    },
    getReportOrders() {
      this.$apollo.query({
        query: gql`
          query {
            orderBouquetsId: bouquets(
              where: {
                _and: [
                  { bouquetGoodsMappings: { good: { id: { _eq: "${this.data.goodId}" } } } }
                  { created_at: { _gte: "${this.data.dateStart} 00:00:00" } }
                  { created_at: { _lte: "${this.data.dateEnd} 23:59:59" } }
                  { orderBouquetId: { _is_null: false } }
                ]
              },
              order_by: { created_at: asc }
            ) {
              orderBouquetId
            }
          }
        `,
      }).then((response) => {
        const orderBouquetsId = response.data.orderBouquetsId.map(item => item.orderBouquetId);

        this.$apollo.query({
          query: gql`
            query {
              reportOrders: orders(
                where: { orderBouquets: { id: { _in: [${orderBouquetsId}] } } },
                order_by: { created_at: asc }
              ) {
                id
                clientName
                courier {
                  name
                }
                created_at
                deliveryDate
                deliveryTime
                deliveryType {
                  name
                }
                orderBouquets {
                  name
                  count
                }
                orderCost
                orderStatus {
                  name
                }
                createdBy {
                  name
                }
              }
            }
          `,
        }).then((responseOrders) => {
          this.report = responseOrders.data.reportOrders;
          this.loadingBtn = false;
        });
      });
    },
    printPage() {
      window.print();
    },
  },
  mounted() {
    // this.createdReportGraphQL();
  },
};
</script>

<style lang="scss">
  .report {

    table {
      width: 100%;
      border-collapse: collapse;

      td, th {
        padding: 5px;
        border: 1px solid #ccc;
      }
    }
  }
</style>
