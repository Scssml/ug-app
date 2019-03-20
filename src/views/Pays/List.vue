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

          <v-dialog
            v-model="dialogForm"
            v-if="dialogForm"
            persistent
            max-width="420px"
          >
            <v-card>
              <v-alert
                :value="createdSuccess"
                type="success"
                class="my-0"
              >
                Оплата изменена
              </v-alert>
              <v-form
                ref="form"
                lazy-validation
              >
                <v-card-title
                  class="px-4"
                >
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text
                  class="px-4"
                >
                  <v-autocomplete
                    label="Клиент"
                    :items="clientsList"
                    :filter="clientsFilter"
                    item-text="name"
                    item-value="id"
                    v-model="editedItem.client"
                    hide-details
                    class="mb-4"
                    no-data-text="Не надено"
                    :readonly="editedItemReadOnly"
                    clearable
                  ></v-autocomplete>

                  <v-select
                    label="Заказ"
                    :items="ordersList"
                    item-text="name"
                    item-value="id"
                    v-model="editedItem.order"
                    hide-details
                    :readonly="editedItemReadOnly"
                  ></v-select>

                  <v-select
                    label="Флорист"
                    :items="floristsList"
                    :rules="[v => !!v || 'Заполните поле']"
                    item-text="name"
                    item-value="id"
                    v-model="editedItem.florist"
                    hide-details
                    :readonly="editedItemReadOnly"
                  ></v-select>

                  <v-select
                    label="Менеджер"
                    :items="usersList"
                    :rules="[v => !!v || 'Заполните поле']"
                    item-text="name"
                    item-value="id"
                    v-model="editedItem.user"
                    hide-details
                    :readonly="editedItemReadOnly"
                  ></v-select>

                  <v-text-field
                    label="Стоимость товаров"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.sum"
                    hide-details
                    class="mb-4"
                    :readonly="editedItemReadOnly"
                  ></v-text-field>

                  <v-text-field
                    label="Стоимость оформления"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.sumDecor"
                    hide-details
                    class="mb-4"
                    :readonly="editedItemReadOnly"
                  ></v-text-field>

                  <v-text-field
                    label="Стоимость доставки"
                    v-model="editedItem.delivery"
                    hide-details
                    class="mb-4"
                    :readonly="editedItemReadOnly"
                  ></v-text-field>

                  <v-text-field
                    label="Сумма скидки"
                    v-model="editedItem.sumSale"
                    hide-details
                    class="mb-4"
                    :readonly="editedItemReadOnly"
                  ></v-text-field>

                  <v-text-field
                    label="Оплачено"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.sumPay"
                    hide-details
                    class="mb-4"
                    :readonly="editedItemReadOnly"
                  ></v-text-field>

                  <v-select
                    label="Тип оплаты"
                    :items="typePayList"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.typePay"
                    hide-details
                    :readonly="editedItemReadOnly"
                  ></v-select>

                  <br>
                  <div><b>Состав:</b></div>
                  <ul>
                    <li v-for="(good, index) in editedItem.goods" :key="index">
                      {{ (findItem = goodsList.find(item => item.id === good.good_id))
                        ? findItem.name : '' }}:
                      {{ good.value }}шт
                    </li>
                  </ul>

                  <v-textarea
                    label="Комментарий"
                    auto-grow
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.comment"
                    row-height="12"
                    hide-details
                    class="mb-4"
                    v-if="!editedItemReadOnly"
                  ></v-textarea>
                </v-card-text>
                <v-card-actions
                  class="px-4 pb-4"
                >
                  <v-btn
                    @click.native="closeDialog()"
                  >Отмена</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="info"
                    @click="submitForm"
                    v-if="!editedItemReadOnly"
                  >Сохранить</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="bouquetsList"
          hide-actions
          no-data-text="Оплат не найдено"
          no-results-text="Оплат не найдено"
          :search="search"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props">
            <tr
              @dblclick="editItem(props.item)"
            >
              <td style="width: 5%;">{{ props.item.date }}</td>
              <td style="width: 14%;">Букет {{ props.item.id }}</td>
              <td style="width: 17%;">
                {{ (findItem = usersList.find(item => item.id === props.item.user))
                  ? findItem.name : '' }}
              </td>
              <td style="width: 17%;">
                {{ (findItem = floristsList.find(item => item.id === props.item.florist))
                  ? findItem.name : '' }}
              </td>
              <td style="width: 17%;">
                {{ (findItem = clientsList.find(item => item.id === props.item.client))
                  ? findItem.name : '' }}
              </td>
              <td class="text-xs-right" style="width: 10%;">{{ props.item.sumPay }}</td>
              <td class="text-xs-right" style="width: 10%;">{{ props.item.typePay }}</td>
              <td class="text-xs-right" style="width: 10%;">
                <v-icon
                  class="mr-2"
                  @click="editItem(props.item)"
                >
                  edit
                </v-icon>
                <v-icon
                  class="mr-2"
                  @click="editItem(props.item, true)"
                >
                  visibility
                </v-icon>
                <v-icon
                  @click="confirmDeleted(props.item.id)"
                >
                  delete
                </v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
export default {
  name: 'Pays',
  data() {
    return {
      loadingData: [
        {
          title: 'Получение букетов',
          error: false,
          loading: true,
          color: 'deep-orange',
          id: 'bouquets',
        },
        {
          title: 'Получение пользователей',
          error: false,
          loading: true,
          color: 'deep-purple',
          id: 'users',
        },
        {
          title: 'Получение клиентов',
          error: false,
          loading: true,
          color: 'indigo',
          id: 'clients',
        },
        {
          title: 'Получение флористов',
          error: false,
          loading: true,
          color: 'cyan',
          id: 'florists',
        },
        {
          title: 'Получение заказов',
          error: false,
          loading: true,
          color: 'amber',
          id: 'orders',
        },
        {
          title: 'Получение товаров',
          error: false,
          loading: true,
          color: 'blue-grey',
          id: 'goods',
        },
      ],
      search: '',
      headersTable: [
        {
          text: 'Дата',
          align: 'left',
          value: 'date',
        },
        {
          text: 'Букет',
          align: 'left',
          value: 'id',
        },
        {
          text: 'Менеджер',
          align: 'left',
          value: 'user',
        },
        {
          text: 'Флорист',
          align: 'left',
          value: 'florist',
        },
        {
          text: 'Клиент',
          align: 'left',
          value: 'client',
        },
        {
          text: 'Сумма',
          align: 'right',
          value: 'sumPay',
        },
        {
          text: 'Тип оплаты',
          align: 'right',
          value: 'typePay',
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      dialogForm: false,
      editedItemReadOnly: false,
      createdSuccess: false,
      bouquetsList: [],
      usersList: [],
      floristsList: [],
      clientsList: [],
      ordersList: [],
      goodsList: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        date: '',
        florist: '',
        user: '',
        client: '',
        order: '',
        sum: '',
        decorPersent: '',
        sumDecor: '',
        delivery: '',
        salePersent: '',
        sumSale: '',
        sumPay: '',
        typePay: '',
        goods: [],
        comment: '',
      },
      defaultItem: {
        id: 0,
        date: '',
        florist: '',
        user: '',
        client: '',
        order: '',
        sum: '',
        decorPersent: '',
        sumDecor: '',
        delivery: '',
        salePersent: '',
        sumSale: '',
        sumPay: '',
        typePay: '',
        goods: [],
        comment: '',
      },
      dialogDeleted: false,
      deletedId: -1,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    formTitle: function formTitle() {
      let title = '';
      if (this.editedItemReadOnly) {
        title = 'Просмотр оплаты';
      } else {
        title = 'Изменение оплаты';
      }
      return title;
    },
    typePayList() {
      const typePay = [
        'Наличные',
        'Яндекс',
        'Карта',
        'Терминал',
      ];
      if (this.client !== 0) typePay.push('На баланс');
      return typePay;
    },
  },
  methods: {
    getBouquetsList: function getBouquetsList() {
      const itemParams = {
        type: 'bouquets',
      };

      const successData = 'Букеты получены!';
      const errorData = 'Ошибка получения букетов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.bouquetsList = response.map((item) => {
          const bouquet = item;
          if (bouquet.date !== undefined) {
            const dateCreated = bouquet.date.split('T')[0];
            bouquet.date = dateCreated;
          }
          return bouquet;
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
    getUsersList: function getUsersList() {
      const itemParams = {
        type: 'users',
      };

      const successData = 'Пользователи получены!';
      const errorData = 'Ошибка получения пользователей!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.usersList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getClientsList: function getClientsList() {
      const itemParams = {
        type: 'clients',
      };

      const successData = 'Клиенты получены!';
      const errorData = 'Ошибка получения клиентов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.clientsList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getFloristsList: function getFloristsList() {
      const itemParams = {
        type: 'florists',
      };

      const successData = 'Флористы получены!';
      const errorData = 'Ошибка получения флористов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.floristsList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getOrdersList: function getOrdersList() {
      const itemParams = {
        type: 'orders',
      };

      const successData = 'Заказы получены!';
      const errorData = 'Ошибка получения заказов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.ordersList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getGoodsList: function getGoodsList() {
      const itemParams = {
        type: 'goods',
      };

      const successData = 'Товары получены!';
      const errorData = 'Ошибка получения товаров!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.goodsList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getDataProps: function getDataProps() {
      this.getBouquetsList();
      this.getUsersList();
      this.getClientsList();
      this.getFloristsList();
      this.getOrdersList();
      this.getGoodsList();
    },
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsItem = Object.assign({}, this.editedItem);
        delete propsItem.id;
        delete propsItem.comment;

        propsItem.sum = +propsItem.sum;
        propsItem.sumDecor = +propsItem.sumDecor;
        propsItem.sumPay = +propsItem.sumPay;
        propsItem.sumSale = +propsItem.sumSale;

        const itemParams = {
          type: 'bouquets',
          props: propsItem,
        };

        if (this.editedIndex > -1) {
          itemParams.id = this.editedItem.id;
          this.$store.dispatch('updateItem', itemParams).then(() => {
            this.createdSuccess = true;
            this.getBouquetsList();
            setTimeout(() => {
              this.closeDialog();
            }, 1000);
          });
        }
      }
    },
    closeDialog: function closeDialog() {
      this.dialogForm = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.createdSuccess = false;
        this.editedItemReadOnly = false;
      }, 300);
    },
    editItem: function editItem(item, readonly = false) {
      this.editedIndex = this.bouquetsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogForm = true;
      this.editedItemReadOnly = readonly;
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1;
    },
    confirmDeleted: function confirmDeleted(id) {
      this.dialogDeleted = true;
      this.deletedId = id;
    },
    deletedItem: function deletedItem(elemId) {
      const itemParams = {
        type: 'florists',
        id: elemId,
      };

      this.$store.dispatch('deleteItem', itemParams).then(() => {
        this.getBouquetsList();
        this.closeConfirm();
      });
    },
    closeConfirm: function closeDialog() {
      this.dialogDeleted = false;
      setTimeout(() => {
        this.deletedId = -1;
      }, 300);
    },
  },
  mounted() {
    this.getDataProps();
  },
};
</script>

<style lang="scss" scoped>
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
</style>
