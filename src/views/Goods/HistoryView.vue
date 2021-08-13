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
    <template>
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
              v-if="purchase.operation_type"
            >
              <v-text-field
                label="Тип изменения"
                :value="typeEdit.find((item) => item.id === purchase.operation_type).name"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Закупка"
                :value="purchase.arrival"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Приход"
                :value="purchase.amount"
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
              v-if="purchase.company_name"
            >
              <v-text-field
                label="Компания"
                v-model="purchase.company_name"
                hide-details
                class="pr-4"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex
              v-if="purchase.user_name"
            >
              <v-text-field
                label="Менеджер"
                :value="purchase.user_name"
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
          :items="purchase.purchase_goods"
          hide-actions
          no-data-text="Товаров не найдено"
          no-results-text="Товаров не найдено"
          :search="search"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.old_stock }}</td>
            <td>{{ props.item.new_stock - props.item.old_stock }}</td>
            <td>{{ props.item.new_stock }}</td>
            <td>{{ props.item.old_price }}</td>
            <td>{{ props.item.new_price }}</td>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios';

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
      typeEdit: [
        {
          id: 'coming',
          name: 'Приход',
        },
        {
          id: 'revaluation',
          name: 'Переоценка',
        },
        {
          id: 'inventory',
          name: 'Инвентаризация',
        },
        {
          id: 'defect',
          name: 'Брак',
        },
      ],
      search: '',
      headersTable: [
        {
          text: 'Название',
          align: 'left',
          value: 'name',
        },
        {
          text: 'Было на складе',
          align: 'left',
          value: 'old_stock',
        },
        {
          text: 'Пришло',
          align: 'left',
          value: 'estimate',
        },
        {
          text: 'Стало',
          align: 'left',
          value: 'new_stock',
        },
        {
          text: 'Старая цена',
          align: 'left',
          value: 'old_price',
        },
        {
          text: 'Цена',
          align: 'left',
          value: 'new_price',
        },
      ],
      purchase: {},
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    markup() {
      let markupVal = 0;
      if (this.purchase.amount !== 0) {
        markupVal = 100 - ((this.purchase.arrival * 100) / this.purchase.amount);
      }

      return +markupVal.toFixed(2);
    },
  },
  methods: {
    getPurchase() {
      const loadData = this.loadingData.find(item => item.id === 'purchase');
      const url = `purchases/${this.$route.params.id}`;

      axios
        .get(url)
        .then((response) => {
          const item = response.data;
          this.purchase = item;

          loadData.title = 'Поставоки получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения поставок!';
          loadData.error = true;
          console.log(error);
        });
    },
  },
  mounted() {
    this.getPurchase();
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
