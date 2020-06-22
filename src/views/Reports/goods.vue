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
                @change="validateForm()"
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
                @change="validateForm()"
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
                  @change="validateForm()"
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
                  @change="validateForm()"
                  no-title
                  locale="ru-ru"
                  scrollable
                  first-day-of-week="1"
                  :min="!!data.dateStart ? data.dateStart : undefined"
                ></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-title>

      <v-card-text
        class="report"
      >
        <template v-if="validate">
          <good-bouquets
            :date-start="data.dateStart"
            :date-end="data.dateEnd"
            :good-id="data.goodId"
            v-if="data.type === 'bouquets'"
          ></good-bouquets>

          <good-orders
            :date-start="data.dateStart"
            :date-end="data.dateEnd"
            :good-id="data.goodId"
            v-if="data.type === 'orders'"
          ></good-orders>

          <good-purchases
            :date-start="data.dateStart"
            :date-end="data.dateEnd"
            :good-id="data.goodId"
            v-if="data.type === 'purchases'"
          ></good-purchases>
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
    >Распечатать</v-btn>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import goodBouquets from "./Goods/bouquets.vue";
import goodOrders from "./Goods/orders.vue";
import goodPurchases from "./Goods/purchases.vue";

export default {
  components: {
    goodBouquets,
    goodOrders,
    goodPurchases,
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
        {
          name: 'Операции',
          id: 'purchases',
        },
        {
          name: 'Букеты',
          id: 'bouquets',
        },
        {
          name: 'Заказы',
          id: 'orders',
        },
      ],
      goodsList: [],
      validate: false,
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
    validateForm() {
      setTimeout(() => {
        this.validate = this.$refs.form.validate();
      }, 300);
    },
    printPage() {
      window.print();
    },
  },
};
</script>

<style lang="scss">
  .report {

    table {
      // width: 100%;
      border-collapse: collapse;

      td, th {
        padding: 5px;
        border: 1px solid #ccc;
      }
    }
  }
</style>
