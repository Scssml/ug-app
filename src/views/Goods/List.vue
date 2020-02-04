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
          <good-add @cancel="closeDialogAdd()"></good-add>
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
                  v-model.number="dataEdit.type"
                  hide-details
                  class="pr-4"
                ></v-select>
              </v-flex>
              <v-flex xs2>
                <v-text-field
                  label="Закупка"
                  :value="dataEdit.purchase"
                  hide-details
                  class="pr-4"
                  :rules="[
                    v => (v !== '' && v !== undefined) || 'Заполните поле'
                  ]"
                  @change="dataEdit.purchase = exelCalc($event)"
                ></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-text-field
                  label="Сумма"
                  :value="arrival"
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
                <!-- <v-text-field
                                                  label="Компания"
                                                  v-model="dataEdit.company"
                                                  hide-details
                                                  class="pr-4"
                                                  :rules="[v => !!v || 'Заполните поле']"
                                                ></v-text-field> -->
                <v-autocomplete
                  label="Компания"
                  :items="clientsList"
                  :filter="clientsFilter"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="dataEdit.company"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  clearable
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
            <list-item :props="props" @onChange="handleRowItemChange" />
          </template>
        </v-data-table>
        <v-btn fab color="info" class="mx-4" @click="dialogForm = true">
          <v-icon dark>add</v-icon>
        </v-btn>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import GoodAdd from "./add.vue";
import ListItem from "./ListItem";
import { PaymentTypes } from "./constants";

export default {
  name: "Goods",
  components: {
    GoodAdd,
    ListItem
  },
  data() {
    return {
      loadingData: [
        {
          title: "Получение товаров",
          error: false,
          loading: true,
          color: "indigo",
          id: "goods"
        }
      ],
      typeEdit: [],
      dataEdit: {
        type: 0,
        company: "",
        purchase: 0
      },
      search: "",
      headersTable: [
        {
          text: "Остаток",
          align: "left",
          value: "stockBalance"
        },
        {
          text: "Название",
          align: "left",
          value: "name"
        },
        {
          text: "Сортировка",
          align: "left",
          value: "sortIndex"
        },
        {
          text: "Цена",
          align: "left",
          value: "price"
        },
        {
          text: "Кол-во",
          align: "left",
          value: "count"
        },
        {
          text: "",
          align: "right",
          sortable: false,
          value: "action"
        }
      ],
      goodsList: [],
      createdSuccess: false,
      dialogForm: false,
      clientsList: []
    };
  },
  computed: {
    isSaveButtonDisabled() {
      return !this.goodsList.some(
        g => +g.oldPrice !== +g.price || +g.oldCount !== +g.count
      );
    },
    historyLinkPage() {
      return "/goods/history";
    },
    loadingDialog() {
      const loadData = this.loadingData.filter(
        item => !item.error && !item.loading
      );
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    formAlertTitle() {
      return "Остатки изменены";
    },
    arrival() {
      switch (+this.dataEdit.type) {
        case PaymentTypes.Revaluation: {
          return this.calculateRevaluation(this.goodsList);
        }
        default: {
          return this.calculateOtherOperations(this.goodsList);
        }
      }
    },
    markup() {
      let markupVal = 0;
      if (this.arrival !== 0) {
        markupVal = 100 - (this.dataEdit.purchase * 100) / this.arrival;
      }

      return +markupVal.toFixed(2);
    }
  },
  methods: {
    calculateRevaluation(goodsList) {
      return goodsList.reduce(
        (sum, item) => sum + (item.price - item.oldPrice) * item.stockBalance,
        0
      );
    },
    calculateOtherOperations(goodsList) {
      return goodsList.reduce((sum, item) => sum + item.price * item.count, 0);
    },
    handleHistoryButtonClick() {
      this.$store.commit("clearPurchaseFilter");
    },
    handleRowItemChange({ id, prop, value }) {
      const good = this.goodsList.find(g => g.id === id);

      good[prop] = value;
    },
    exelCalc(val) {
      /* eslint no-eval: 0 */

      const value = val.length > 1 ? val.replace(/^0+/, "") : val;
      console.log(value);

      // return value;
      return eval(value);
    },
    getGoodsList() {
      const itemParams = {
        type: "goods",
        sort: {
          sortIndex: "asc"
        }
      };

      const successData = "Товары получены!";
      const errorData = "Ошибка получения товаров!";

      this.$store
        .dispatch("getItemsList", itemParams)
        .then(response => {
          this.goodsList = response.map(item => {
            const good = item;
            good.count = 0;
            good.oldPrice = good.price;
            good.oldCount = good.count;
            return good;
          });

          const loadData = this.loadingData.find(
            item => item.id === itemParams.type
          );
          loadData.title = successData;
          loadData.loading = false;
        })
        .catch(() => {
          const loadData = this.loadingData.find(
            item => item.id === itemParams.type
          );
          loadData.title = errorData;
          loadData.error = true;
        });
    },
    getPurchaseTypesList() {
      const itemParams = {
        type: "purchase-types"
      };

      this.$store
        .dispatch("getItemsList", itemParams)
        .then(response => {
          this.typeEdit = response.map(item => {
            item.id = +item.id;
            return item;
          });
        })
        .catch(() => {
          console.log("error");
        });
    },
    getClientsList() {
      const itemParams = {
        type: "clients",
        filter: {
          active: true,
          typeId: 4,
        },
      };

      this.$store
        .dispatch("getItemsList", itemParams)
        .then(response => {
          this.clientsList = response.map(item => {
            item.id = +item.id;
            return item;
          });
        })
        .catch(() => {
          console.log("error");
        });
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, "");
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        // const goods = this.goodsList.map((item, i) => {
        //   //this.goodsList[i].stockBalance = +item.stockBalance + +item.count;
        //   const good = Object.assign({}, item);
        //   //delete good.count;
        //   return good;
        // });

        const purchaseGoods = this.goodsList.map(item => {
          const good = {
            estimate: item.count,
            newPrice: item.price,
            oldPrice: item.oldPrice,
            stockQuantity: item.stockBalance,
            good: item.id
          };

          return good;
        });

        const propsItem = Object.assign({}, this.dataEdit);
        [propsItem.purchasedGoods, propsItem.arrival] = [
          purchaseGoods,
          this.arrival
        ];

        const itemParams = {
          type: "purchase",
          props: propsItem
        };

        this.$store.dispatch("addItem", itemParams).then(() => {
          this.createdSuccess = true;
          this.getGoodsList();
          setTimeout(() => {
            this.closeDialog();
          }, 1000);
        });

        this.goodsList.forEach(elem => {
          const propsGood = Object.assign({}, elem);
          propsGood.stockBalance = +propsGood.stockBalance + +propsGood.count;
          delete propsGood.id;
          delete propsGood.count;

          propsGood.price = +propsGood.price;

          const goodParams = {
            type: "goods",
            props: propsGood,
            id: elem.id
          };

          this.$store.dispatch("updateItem", goodParams);
        });
      }
    },
    closeDialog() {
      this.createdSuccess = false;
    },
    closeDialogAdd() {
      this.getGoodsList();
      this.dialogForm = false;
    }
  },
  mounted() {
    this.getGoodsList();
    this.getPurchaseTypesList();
    this.getClientsList();
  }
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
