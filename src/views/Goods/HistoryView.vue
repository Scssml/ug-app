<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-dialog
      :value="loadingDialog"
      persistent
      max-width="320px"
    >
      <v-list>
        <v-list-tile
          v-for="(item, index) in loadingData"
          :key="index"
          avatar
          :color="(item.error) ? 'red' : item.color"
        >
          <v-list-tile-avatar>
            <v-progress-circular
              :value="100"
              :size="30"
              :color="(item.error) ? 'red' : item.color"
              :indeterminate="item.loading"
            ></v-progress-circular>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-dialog>
    <template v-if="!$apollo.queries.purchaseList.loading">
      <v-card>
        <v-card-title>
          <v-layout row wrap>
            <v-flex>
              <v-btn color="info" to="/goods/history">Назад</v-btn>
            </v-flex>
          </v-layout>
          <v-layout
            row
            wrap
          >
            <v-flex>
              <v-text-field
                label="Дата"
                :value="purchase.created_at"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex
              v-if="purchase.purchaseType"
            >
              <v-text-field
                label="Тип изменения"
                :value="purchase.purchaseType.name"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Закупка"
                :value="purchase.purchase"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Приход"
                :value="purchase.arrival"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Наценка"
                :value="markup + '%'"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex
              v-if="purchase.company"
            >
              <v-text-field
                label="Компания"
                v-model="purchase.company.name"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex
              v-if="purchase.createdBy"
            >
              <v-text-field
                label="Менеджер"
                :value="purchase.createdBy.name"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            prepend-icon="search"
            label="Поиск"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          :headers="headersTable"
          :items="purchase.purchasedGoods"
          hide-actions
          no-data-text="Товаров не найдено"
          no-results-text="Товаров не найдено"
          :search="search"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.good.name }}</td>
            <td>{{ props.item.stockQuantity - props.item.estimate }}</td>
            <td>{{ props.item.estimate }}</td>
            <td>{{ props.item.stockQuantity }}</td>
            <td>{{ props.item.oldPrice }}</td>
            <td>{{ props.item.newPrice }}</td>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";

export default {
  name: 'HistoryView',
  data() {
    return {
      loadingData: [
        {
          title: 'Получение поставок',
          error: false,
          loading: false,
          color: 'indigo',
          id: 'purchase',
        },
      ],
      search: '',
      headersTable: [
        {
          text: 'Название',
          align: 'left',
          value: 'id',
        },
        {
          text: 'Было на складе',
          align: 'left',
          value: 'stockQuantity',
        },
        {
          text: 'Пришло',
          align: 'left',
          value: 'estimate',
        },
        {
          text: 'Стало',
          align: 'left',
          value: 'stockQuantityNew',
        },
        {
          text: 'Старая цена',
          align: 'left',
          value: 'oldPrice',
        },
        {
          text: 'Цена',
          align: 'left',
          value: 'newPrice',
        },
      ],
      purchase: {},
    };
  },
  apollo: {
    purchaseList: {
      query: gql`
        query purchaseList(
          $id: bigint
        ) {
          purchaseList: purchases(
            where: {
              id: { _eq: $id }
            },
          ) {
            id,
            created_at
            purchaseType {
              name
            }
            purchase
            arrival
            revaluation
            company {
              name
            }
            createdBy {
              name
            }
            purchasedGoods {
              good {
                name
              }
              stockQuantity
              estimate
              oldPrice
              newPrice
            }
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      update({ purchaseList }) {
        this.purchase = purchaseList.shift();
        this.purchase.created_at = this.formatDate(this.purchase.created_at, 'dd.MM.yyyy HH:mm:ss');
      },
    },
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    markup() {
      let markupVal = 0;
      if (this.purchase.arrival !== 0) {
        markupVal = 100 - ((this.purchase.purchase * 100) / this.purchase.arrival);
      }

      return +markupVal.toFixed(2);
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
    getPurchaseList: function getPurchaseList() {
      const itemParams = {
        type: 'purchase',
        id: this.$route.params.id,
      };

      const successData = 'Закупки получены!';
      const errorData = 'Ошибка получения закупок!';

      this.$store.dispatch('getItem', itemParams).then((response) => {
        this.purchase = {
          ...response,
          purchasedGoods: !response.purchasedGoods ? [] : response.purchasedGoods,
        };

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
  },
};
</script>

<style lang="scss">
  .v-table {

    tr:nth-child(even) {

      td {
        background: #f9f9f9;
      }

      &:hover {

        td {
          background: #eee;
        }
      }
    }
  }

  .scs-small {
    &.v-text-field {
      .v-input__control {
        min-height: 30px;
      }
      input {
        max-height: 30px;
        padding: 5px 0;
      }
      .v-select__selection--comma {
        margin: 6px 4px 6px 0;
      }
    }
  }
</style>
