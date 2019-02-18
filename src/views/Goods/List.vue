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
    <template v-if="!loadingDialog">
      <v-dialog
        v-model="dialogDeleted"
        persistent
        max-width="320px"
      >
        <v-card>
          <v-card-title
            class="px-4"
          >
            <span class="headline">Удалить?</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions
            class="px-4 py-3"
          >
            <v-btn
              @click.native="dialogDeleted = false"
            >Отмена</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              @click="deletedItem(deletedId)"
            >Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogForm"
        persistent
        max-width="420px"
      >
        <v-card>
          <v-alert
            :value="createdSuccessAdd"
            type="success"
            class="my-0"
          >
            Товар добавлен
          </v-alert>
          <v-form
            ref="formAdd"
            lazy-validation
          >
            <v-card-title
              class="px-4"
            >
              <span class="headline">Добавление товара</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text
              class="px-4"
            >
              <v-text-field
                label="Название"
                :rules="[v => !!v || 'Заполните поле']"
                v-model="editedItem.name"
              ></v-text-field>
              <v-text-field
                label="Цена"
                :rules="[v => !!v || 'Заполните поле']"
                v-model="editedItem.price"
                type="number"
              ></v-text-field>
              <v-text-field
                label="На складе"
                :rules="[v => !!v || 'Заполните поле']"
                v-model="editedItem.store"
                type="number"
              ></v-text-field>
            </v-card-text>
            <v-card-actions
              class="px-4 pb-4"
            >
              <v-btn
                @click.native="closeDialogAdd()"
              >Отмена</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="info"
                @click="addGoods"
              >Сохранить</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-card>
        <v-alert
          :value="createdSuccess"
          type="success"
          class="my-0"
        >
          {{ formAlertTitle }}
        </v-alert>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-card-title>
            <v-layout
              row
              wrap
            >
              <v-flex
                xs2
              >
                <v-select
                  label="Тип изменения"
                  :items="typeEdit"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="dataEdit.type"
                  hide-details
                  class="pr-4"
                ></v-select>
              </v-flex>
              <v-flex
                xs2
              >
                <v-text-field
                  label="Закупка"
                  :value="dataEdit.purchase"
                  hide-details
                  class="pr-4"
                  :rules="[v => ((v !== '') && (v !== undefined)) || 'Заполните поле']"
                  @change="dataEdit.purchase = exelCalc($event)"
                ></v-text-field>
              </v-flex>
              <v-flex
                xs2
              >
                <v-text-field
                  label="Приход"
                  :value="arrival"
                  hide-details
                  class="pr-4"
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex
                xs1
              >
                <v-text-field
                  label="Наценка"
                  :value="markup + '%'"
                  hide-details
                  class="pr-4"
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex
                xs3
                v-if="dataEdit.type === 'Приход' || dataEdit.type ===  'Брак'"
              >
                <v-text-field
                  label="Компания"
                  v-model="dataEdit.company"
                  hide-details
                  class="pr-4"
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
              </v-flex>
              <v-flex
                xs2
              >
                <v-btn
                  color="info"
                  @click="submitForm"
                >Сохранить</v-btn>
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
            to="/goods/history/"
          >История</v-btn>
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
            <td>
              <v-text-field
                label="Склад"
                solo
                flat
                hide-details
                :value="+props.item.store + +props.item.count"
                class="scs-small"
                readonly
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Название"
                solo
                flat
                hide-details
                v-model="props.item.name"
                class="scs-small"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Тип"
                solo
                flat
                hide-details
                v-model="props.item.type"
                class="scs-small"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Цена"
                solo
                flat
                hide-details
                type="number"
                v-model="props.item.price"
                class="scs-small"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Кол-во"
                solo
                flat
                hide-details
                type="text"
                :value="props.item.count"
                @change="props.item.count = exelCalc($event)"
                class="scs-small"
              ></v-text-field>
            </td>
            <td class="text-xs-right" style="width: 7%;">
              <v-icon
                @click="confirmDeleted(props.item.id)"
              >
                delete
              </v-icon>
            </td>
          </template>
        </v-data-table>
        <v-btn
          fab
          color="info"
          class="mx-4"
          @click="dialogForm = true;"
        >
          <v-icon dark>add</v-icon>
        </v-btn>
      </v-card>
    </template>
  </v-container>
</template>

<script>
export default {
  name: 'Goods',
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
        'Приход',
        'Инвентаризация',
        'Переоценка',
        'Брак',
      ],
      dataEdit: {
        type: '',
        company: '',
        purchase: 0,
      },
      search: '',
      headersTable: [
        {
          text: 'Остаток',
          align: 'left',
          value: 'store',
        },
        {
          text: 'Название',
          align: 'left',
          value: 'name',
        },
        {
          text: 'Тип',
          align: 'left',
          value: 'type',
        },
        {
          text: 'Цена',
          align: 'left',
          value: 'price',
        },
        {
          text: 'Кол-во',
          align: 'left',
          value: 'count',
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      goodsList: [],
      createdSuccess: false,
      dialogDeleted: false,
      deletedId: -1,
      dialogForm: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        price: 0,
        store: 0,
      },
      defaultItem: {
        name: '',
        price: 0,
        store: 0,
      },
      createdSuccessAdd: false,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    formAlertTitle: function formTitle() {
      return 'Остатки изменены';
    },
    arrival() {
      const arrival = this.goodsList.reduce((sum, item) => {
        const goodArrival = +item.count * +item.price;
        return goodArrival + sum;
      }, 0);

      return arrival;
    },
    markup() {
      let markupVal = 0;
      if (this.arrival !== 0) {
        markupVal = 100 - ((this.dataEdit.purchase * 100) / this.arrival);
      }

      return +markupVal.toFixed(2);
    },
  },
  methods: {
    exelCalc(val) {
      /* eslint no-eval: 0 */
      return eval(val);
    },
    getGoodsList: function getGoodsList() {
      const itemParams = {
        type: 'goods',
      };

      const successData = 'Товары получены!';
      const errorData = 'Ошибка получения товаров!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.goodsList = response.map((item) => {
          const good = item;
          good.count = 0;
          return good;
        });

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const goods = this.goodsList.map((item, i) => {
          this.goodsList[i].store = +item.store + +item.count;
          const good = Object.assign({}, item);
          delete good.count;
          return good;
        });

        const purchaseGoods = this.goodsList.map((item) => {
          const good = Object.assign({}, item);
          good.good_id = good.id;
          good.price = +good.price;
          delete good.id;
          return good;
        });

        const propsItem = Object.assign({}, this.dataEdit);
        [propsItem.date, propsItem.goods, propsItem.arrival, propsItem.user] = [
          new Date().toISOString(),
          purchaseGoods,
          this.arrival,
          this.$store.state.authUser,
        ];

        const itemParams = {
          type: 'purchase',
          props: propsItem,
        };

        this.$store.dispatch('addItem', itemParams).then(() => {
          this.createdSuccess = true;
          this.getGoodsList();
          setTimeout(() => {
            this.closeDialog();
          }, 1000);
        });

        goods.forEach((elem) => {
          const propsGood = Object.assign({}, elem);
          delete propsGood.id;

          propsGood.price = +propsGood.price;
          propsGood.store = +propsGood.store;

          const goodParams = {
            type: 'goods',
            props: propsGood,
            id: elem.id,
          };

          this.$store.dispatch('updateItem', goodParams);
        });
      }
    },
    closeDialog: function closeDialog() {
      this.createdSuccess = false;
    },
    closeDialogAdd: function closeDialogAdd() {
      this.dialogForm = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.createdSuccess = false;
      }, 300);
    },
    confirmDeleted: function confirmDeleted(id) {
      this.dialogDeleted = true;
      this.deletedId = id;
    },
    deletedItem: function deletedItem(elemId) {
      const itemParams = {
        type: 'goods',
        id: elemId,
      };

      this.$store.dispatch('deleteItem', itemParams).then(() => {
        this.getGoodsList();
        this.closeConfirm();
      });
    },
    closeConfirm: function closeDialog() {
      this.dialogDeleted = false;
      setTimeout(() => {
        this.deletedId = -1;
      }, 300);
    },
    addGoods() {
      const validate = this.$refs.formAdd.validate();
      if (validate) {
        const propsItem = Object.assign({}, this.editedItem);
        delete propsItem.id;

        propsItem.price = +propsItem.price;
        propsItem.store = +propsItem.store;

        const itemParams = {
          type: 'goods',
          props: propsItem,
        };

        this.$store.dispatch('addItem', itemParams).then(() => {
          this.createdSuccessAdd = true;
          this.getGoodsList();
          setTimeout(() => {
            this.closeDialogAdd();
          }, 1000);
        });
      }
    },
  },
  mounted() {
    this.getGoodsList();
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
