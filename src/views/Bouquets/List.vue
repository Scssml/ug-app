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
            max-width="720px"
          >
            <v-card>
              <v-form
                ref="form"
                lazy-validation
              >
                <v-card-title
                  class="px-4"
                >
                  <span class="headline">Просмотр букета</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text
                  class="px-4"
                >
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      xs6
                    >
                      <p><b>Номер букета:</b> {{ editedItem.id }}</p>
                      <p>
                        <b>Флорист:</b>
                        {{ (findItem = floristsList.find(item => item.id === editedItem.florist))
                          ? findItem.name : '' }}
                      </p>
                      <p>
                        <b>Клиент:</b>
                        {{ (findItem = clientsList.find(item => item.id === editedItem.client))
                          ? findItem.name : '' }}
                      </p>
                      <p><b>Стоимость товаров:</b> {{ editedItem.sum }}</p>
                      <p><b>Процент оформления:</b> {{ editedItem.decorPersent }}</p>
                      <p><b>Процент скидки:</b> {{ editedItem.salePersent }}</p>
                      <p><b>Оплачено:</b> {{ editedItem.sumPay }}</p>
                    </v-flex>
                    <v-flex
                      xs6
                    >
                      <p><b>Дата создания:</b> {{ editedItem.date }}</p>
                      <p>
                        <b>Менеджер:</b>
                        {{ (findItem = usersList.find(item => item.id === editedItem.user))
                          ? findItem.name : '' }}
                      </p>
                      <p><b>Заказ:</b> {{ editedItem.order }}</p>
                      <p><b>Стоимость доставки:</b> {{ editedItem.delivery }}</p>
                      <p><b>Стоимость оформления:</b> {{ editedItem.sumDecor }}</p>
                      <p><b>Сумма скидки:</b> {{ editedItem.sumSale }}</p>
                      <p><b>Тип оплаты:</b> {{ editedItem.typePay }}</p>
                    </v-flex>
                    <v-flex
                      xs12
                    >
                    <div><b>Состав:</b></div>
                    <ul>
                      <li v-for="(good, index) in editedItem.goods" :key="index">
                        {{ goodsList.find(item => item.id === good.id).name }}:
                        {{ good.value }}шт
                      </li>
                    </ul>
                  </v-flex>
                 </v-layout>
                </v-card-text>
                <v-card-actions
                  class="px-4 pb-4"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    @click.native="dialogForm = false"
                  >Закрыть</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="bouquetsList"
          hide-actions
          no-data-text="Букетов не найдено"
          no-results-text="Букетов не найдено"
          :search="search"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props">
            <tr
              @dblclick="editItem(props.item)"
            >
              <td style="width: 5%;">{{ props.item.date }}</td>
              <td style="width: 15%;">Букет {{ props.item.id }}</td>
              <td style="width: 21%;">
                {{ (findItem = usersList.find(item => item.id === props.item.user))
                  ? findItem.name : '' }}
              </td>
              <td style="width: 21%;">
                {{ (findItem = floristsList.find(item => item.id === props.item.florist))
                  ? findItem.name : '' }}
              </td>
              <td style="width: 21%;">
                {{ (findItem = clientsList.find(item => item.id === props.item.client))
                  ? findItem.name : '' }}
              </td>
              <td class="text-xs-right" style="width: 10%;">{{ props.item.sumPay }}</td>
              <td class="text-xs-right" style="width: 7%;">
                <v-icon
                  class="mr-2"
                  @click="editItem(props.item)"
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
  name: 'Bouquets',
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
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      dialogForm: false,
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
  },
  methods: {
    getBouquetsList: function getBouquetsList() {
      const itemParams = {
        type: 'bouquets',
      };

      const successData = 'Букеты получены!';
      const errorData = 'Ошибка получения букетов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.bouquetsList = response;

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
    closeDialog: function closeDialog() {
      this.dialogForm = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    editItem: function editItem(item) {
      this.editedIndex = this.usersList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogForm = true;
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
