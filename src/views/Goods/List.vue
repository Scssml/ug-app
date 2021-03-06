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
                <autosuggest
                  :suggestions="suggestions"
                  placeholder="Клиенты"
                  :value="client.name"
                  @onChange="onInputChange"
                  @onSelect="onSelected"
                  class="mt-3 view-filter"
                />
                <!-- <v-autocomplete
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
                ></v-autocomplete> -->
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
            <list-item
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
import GoodAdd from './add.vue';
import ListItem from './ListItem';
import { PaymentTypes } from './constants';
import GoodDelete from './delete.vue';
import gql from "graphql-tag";
import Autosuggest from "../../components/Autosuggest";

export default {
  name: 'Goods',
  components: {
    GoodAdd,
    ListItem,
    GoodDelete,
    Autosuggest,
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
      typeEdit: [],
      dataEdit: {
        type: 0,
        company: null,
        purchase: 0,
      },
      search: '',
      headersTable: [
        {
          text: 'Остаток',
          align: 'left',
          value: 'stockBalance',
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
          value: 'sortIndex',
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
  apollo: {
    goods: {
      query: gql`
        query goods {
          goods: goods(
            order_by: { sortIndex: desc }
            where: {
              deleted_at: { _is_null: true }
            }
          ) {
            id
            name
            price
            sortIndex
            stockBalance
            color
          }
        }
      `,
      // variables() {
      //   return {
      //     offset: this.page * this.take,
      //     limit: this.take,
      //   };
      // },
      update({ goods }) {
        const loadData = this.loadingData.find(item => item.id === 'goods');
        loadData.title = 'Товары получены!';
        loadData.loading = false;

        goods = goods.map((item) => {
          const good = item;
          good.count = 0;
          good.oldPrice = good.price;
          good.oldCount = good.count;
          return good;
        });

        this.goodsList = this.goodsList.concat(goods);

        if (goods.length > 0) {
          this.loading = false;
        }

        this.take = (this.take) ? this.take : 20;
        this.goodsUpdate = false;
      },
    },
    clientsList: {
      query: gql`
        query ClientsList($name: String) {
          clientsList: clients(
            where: {
              _or: [{ name: { _ilike: $name } }, { phone: { _ilike: $name } }]
              deleted_at: { _is_null: true }
              typeId: { _eq: 4 }
            }
            limit: 50
          ) {
            id
            name
          }
        }
      `,
      update({ clientsList: data }) {
        this.suggestions = [{ data }];

        return data;
      },
      variables() {
        return {
          name: this.queryName
        };
      },
      skip() {
        return this.skipClientsQuery;
      },
    },
    typeEdit: {
      query: gql`
        query {
          typeEdit: purchaseTypes {
            id
            name
          }
        }
      `,
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
    },
  },
  methods: {
    onSelected(item) {
      this.client = item;
      this.dataEdit.company = item.id;
    },
    onInputChange(text) {
      this.queryName = `%${text}%`;
      this.skipClientsQuery = false;

      if (text === "") {
        this.dataEdit.company = null;
      }
    },
    calculateRevaluation(goodsList) {
      return goodsList.reduce(
        (sum, item) => sum + (item.price - item.oldPrice) * item.stockBalance,
        0,
      );
    },
    calculateOtherOperations(goodsList) {
      return goodsList.reduce((sum, item) => sum + item.price * item.count, 0);
    },
    handleHistoryButtonClick() {
      this.$store.commit('clearPurchaseFilter');
    },
    handleRowItemChange({ id, prop, value }) {
      const good = this.goodsList.find(g => g.id === id);

      good[prop] = value;
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
      if (validate && this.dataEdit.company) {
        const propsPurchase = {
          typeId: this.dataEdit.type,
          purchase: this.dataEdit.purchase,
          arrival: this.arrival,
          companyId: this.dataEdit.company,
          createdByID: this.$store.getters.getAuthUser,
          purchasedGoods: [],
        };

        const goodsList = this.goodsList.filter((item) => {
          return (+item.price !== +item.oldPrice || +item.count !== +item.oldCount);
        });

        const purchaseGoods = goodsList.map((item) => {
          const good = {
            goodId: item.id,
            estimate: +item.count,
            newPrice: item.price,
            oldPrice: item.oldPrice,
            stockQuantity: item.stockBalance + +item.count,
          };

          return good;
        });

        propsPurchase.purchasedGoods = purchaseGoods;

        this.$apollo.mutate({
          mutation: gql`mutation createPurchase (
            $props: NewPurchase!
          ) {
            createPurchase(input: $props)
          }`,
          variables: {
            props: propsPurchase,
          },
        }).then(() => {
          this.createdSuccess = true;
          this.$apollo.queries.goods.refetch();

          setTimeout(() => {
            this.$emit('cancel', true);
            this.createdSuccess = false;
          }, 1000);
        }).catch((error) => {
          console.error(error);
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

        this.$apollo.queries.goods.refetch();


        const loadData = this.loadingData.find(item => item.id === 'goods');
        loadData.title = 'Получение товаров!';
        loadData.loading = true;
      }
    },
    deleteGood(id) {
      this.deleteId = id;
      this.dialogForm = true;
    },
    scroll() {
      window.onscroll = () => {
        const documentScrollTop = document.documentElement.scrollTop;
        const documentOffsetHeight = document.documentElement.offsetHeight;
        const windowInnerHeight = window.innerHeight;
        const bottomOfWindow = documentScrollTop + windowInnerHeight >= documentOffsetHeight - 300;

        if (bottomOfWindow && !this.loading) {
          this.page += 1;
          this.loading = true;
        }
      };
    },
  },
  mounted() {
    // this.scroll();
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
