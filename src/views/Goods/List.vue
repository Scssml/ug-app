<template>
  <v-container fluid class="pa-0">
    <v-dialog :value="loadingDialog" persistent max-width="320px">
      <v-list>
        <v-list-tile
          v-for="(item, index) in loadingData"
          :key="index"
          avatar
          :color="item.error ? 'red' : item.color"
        >
          <v-list-tile-avatar>
            <v-progress-circular
              :value="100"
              :size="30"
              :color="item.error ? 'red' : item.color"
              :indeterminate="item.loading"
            ></v-progress-circular>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-dialog>
    <template v-if="!loadingDialog">
      <v-dialog v-model="dialogForm" persistent max-width="420px">
        <template v-if="dialogForm">
          <good-delete
            v-if="deleteId"
            :id="deleteId"
            @cancel="closeDialogAdd($event)"
          ></good-delete>
          <good-add
            v-else
            @cancel="closeDialogAdd($event)"
          ></good-add>
        </template>
      </v-dialog>
      <v-card>
        <v-alert :value="createdSuccess" type="success" class="my-0">
          {{ formAlertTitle }}
        </v-alert>
        <v-form ref="form" lazy-validation>
          <v-card-title>
            <v-layout row wrap>
              <v-flex xs2>
                <v-select
                  label="Тип изменения"
                  :items="typeEdit"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="dataEdit.operation_type"
                  hide-details
                  class="pr-4"
                ></v-select>
              </v-flex>
              <v-flex xs2>
                <v-text-field
                  label="Закупка"
                  :value="dataEdit.arrival"
                  hide-details
                  class="pr-4"
                  :rules="[
                    v => (v !== '' && v !== undefined) || 'Заполните поле'
                  ]"
                  @change="dataEdit.arrival = exelCalc($event)"
                ></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-text-field
                  label="Сумма"
                  :value="amount"
                  hide-details
                  class="pr-4"
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-text-field
                  label="Наценка"
                  :value="markup + '%'"
                  hide-details
                  class="pr-4"
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-autocomplete
                  label="Компания"
                  :items="clientsList"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="dataEdit.client_id"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  clearable
                  :search-input.sync="searchClients"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs2>
                <v-btn
                  color="info"
                  :disabled="isSaveButtonDisabled"
                  @click="submitForm"
                  >Сохранить</v-btn
                >
              </v-flex>
            </v-layout>
          </v-card-title>
        </v-form>
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
          <v-btn
            color="info"
            @click="dialogForm = true"
          >Добавить</v-btn>
          <v-btn
            color="info"
            :to="historyLinkPage"
            @click="handleHistoryButtonClick"
            >История</v-btn
          >
        </v-card-title>
        <v-data-table
          :headers="headersTable"
          :items="goodsList"
          hide-actions
          no-data-text="Товаров не найдено"
          no-results-text="Товаров не найдено"
          :search="search"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props">
            <ListItem
              :props="props"
              @onChange="handleRowItemChange"
              @deleteItem="deleteGood"
            />
          </template>
        </v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios';
import GoodAdd from './add.vue';
import ListItem from './ListItem.vue';
import GoodDelete from './delete.vue';

export default {
  name: 'Goods',
  components: {
    GoodAdd,
    ListItem,
    GoodDelete,
  },
  data() {
    return {
      loadingData: [
        {
          title: 'Получение товаров',
          error: false,
          loading: true,
          color: 'indigo',
          id: 'goods',
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
      dataEdit: {
        arrival: 0,
        client_id: 0,
        operation_type: 'coming',
        revaluation: 0,
      },
      searchClients: '',
      timerClients: null,
      search: '',
      headersTable: [
        {
          text: 'Остаток',
          align: 'left',
          value: 'stock',
          sortable: false,
        },
        {
          text: 'Название',
          align: 'left',
          value: 'name',
          sortable: true,
        },
        {
          text: 'Сортировка',
          align: 'left',
          value: 'sort_index',
          sortable: true,
        },
        {
          text: 'Цена',
          align: 'left',
          value: 'price',
          sortable: false,
        },
        {
          text: 'Кол-во',
          align: 'left',
          value: 'count',
        },
        {
          text: 'Цвет',
          align: 'left',
          value: 'color',
          sortable: false,
        },
        {
          text: '',
          align: 'right',
          value: 'action',
          sortable: false,
        },
      ],
      goodsList: [],
      clientsList: [],
      createdSuccess: false,
      dialogForm: false,
      deleteId: 0,
      client: {},
      queryName: '',
      skipClientsQuery: true,
      suggestions: [],
      take: 0,
      page: 0,
      loading: true,
    };
  },
  watch: {
    searchClients(val) {
      const findClient = this.clientsList.find((item) => item.name === val);
      if (findClient) return false;

      if (val && val.length >= 3) {
        if (this.timerClients) clearTimeout(this.timerClients);

        this.timerClients = setTimeout(() => {
          this.getClients(val);
        }, 500);
      } else {
        this.clientsList = [];
      }
    },
  },
  computed: {
    isSaveButtonDisabled() {
      return !this.goodsList.some(g => +g.oldPrice !== +g.price || +g.oldCount !== +g.count);
    },
    historyLinkPage() {
      return '/goods/history';
    },
    loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    formAlertTitle() {
      return 'Остатки изменены';
    },
    amount() {
      switch (this.dataEdit.type) {
        case 'defect': {
          return this.calculateRevaluation(this.goodsList);
        }
        default: {
          return this.calculateOtherOperations(this.goodsList);
        }
      }
    },
    markup() {
      let markupVal = 0;
      if (this.amount !== 0) {
        markupVal = 100 - ((this.dataEdit.arrival * 100) / this.amount);
      }

      return +markupVal.toFixed(2);
    },
  },
  methods: {
    onSelected(item) {
      this.client = item;
      this.dataEdit.company = item.id;
    },
    calculateRevaluation(goodsList) {
      return goodsList.reduce(
        (sum, item) => sum + ((item.price - item.oldPrice) * item.stockBalance),
        0,
      );
    },
    calculateOtherOperations(goodsList) {
      return goodsList.reduce((sum, item) => sum + (item.price * item.count), 0);
    },
    handleHistoryButtonClick() {
      this.$store.commit('clearPurchaseFilter');
    },
    handleRowItemChange({ id, code, value }) {
      const good = this.goodsList.find(item => item.id === id);
      good[code] = value;
    },
    exelCalc(val) {
      /* eslint no-eval: 0 */

      const value = val.length > 1 ? val.replace(/^0+/, '') : val;
      console.log(value);

      // return value;
      return eval(value);
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate && this.dataEdit.client_id) {
        const propsPurchase = Object.assign({}, this.dataEdit);
        const url = 'purchases';

        propsPurchase.amount = this.amount;

        const goodsList = this.goodsList.filter((item) => {
          return (+item.price !== +item.oldPrice || +item.count !== 0);
        });

        propsPurchase.goods = goodsList.map((item) => {
          return {
            id: item.id,
            new_price: +item.price,
            new_stock: +item.count,
          };
        });

        axios
          .post(url, propsPurchase)
          .then(() => {
            this.createdSuccess = true;
            this.getItems();

            setTimeout(() => {
              this.createdSuccess = false;
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    closeDialog() {
      this.createdSuccess = false;
    },
    closeDialogAdd(update) {
      this.dialogForm = false;
      this.deleteId = 0;

      if (update) {
        this.goodsList = [];
        this.take = 0;

        const loadData = this.loadingData.find(item => item.id === 'goods');
        loadData.title = 'Получение товаров!';
        loadData.loading = true;

        this.getItems();
      }
    },
    deleteGood(id) {
      this.deleteId = id;
      this.dialogForm = true;
    },
    getItems() {
      const loadData = this.loadingData.find(item => item.id === 'goods');
      const url = 'goods';

      axios
        .get(url)
        .then((response) => {
          const items = response.data;
          this.goodsList = items.map((item) => {
            item.count = 0;
            item.oldPrice = item.price;
            return item;
          });

          loadData.title = 'Товары получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения товаров!';
          loadData.error = true;
          console.log(error);
        });
    },
    getClients(searchVal) {
      const url = 'clients';

      axios
        .get(url, {
          params: {
            client_type: 'legal',
            name_or_phone: searchVal,
            page_limit: 10,
          },
        })
        .then((response) => {
          this.clientsList = response.data.map((item) => {
            return {
              name: `${item.name} (${item.phone})`,
              id: item.id,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getItems();
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
