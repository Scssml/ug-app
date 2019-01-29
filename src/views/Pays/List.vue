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
              @click="deletedItem(deletedIndex)"
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
                  <span class="headline">Просмотр оплаты</span>
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
              <td style="width: 18%;">
                {{ (findItem = usersList.find(item => item.id === props.item.user))
                  ? findItem.name : '' }}
              </td>
              <td style="width: 18%;">
                {{ (findItem = floristsList.find(item => item.id === props.item.florist))
                  ? findItem.name : '' }}
              </td>
              <td style="width: 18%;">
                {{ (findItem = clientsList.find(item => item.id === props.item.client))
                  ? findItem.name : '' }}
              </td>
              <td class="text-xs-right" style="width: 10%;">{{ props.item.sumPay }}</td>
              <td class="text-xs-right" style="width: 10%;">{{ props.item.typePay }}</td>
              <td class="text-xs-right" style="width: 7%;">
                <v-icon
                  class="mr-2"
                  @click="editItem(props.item)"
                >
                  visibility
                </v-icon>
                <v-icon
                  @click="confirmDeleted(props.item)"
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
      deletedIndex: -1,
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
      this.$store.dispatch('getBouquetsList').then((response) => {
        this.bouquetsList = response.bouquetsList;

        const loadData = this.loadingData.find(item => item.id === 'bouquets');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'bouquets');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getUsersList: function getUsersList() {
      this.$store.dispatch('getUsersList').then((response) => {
        this.usersList = response.usersList;

        const loadData = this.loadingData.find(item => item.id === 'users');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'users');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getClientsList: function getClientsList() {
      this.$store.dispatch('getClientsList').then((response) => {
        this.clientsList = response.clientsList;

        const loadData = this.loadingData.find(item => item.id === 'clients');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'clients');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getFloristsList: function getFloristsList() {
      this.$store.dispatch('getFloristsList').then((response) => {
        this.floristsList = response.floristsList;

        const loadData = this.loadingData.find(item => item.id === 'florists');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'florists');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getOrdersList: function getOrdersList() {
      this.$store.dispatch('getOrdersList').then((response) => {
        this.ordersList = response.ordersList;

        const loadData = this.loadingData.find(item => item.id === 'orders');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'orders');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getGoodsList: function getGoodsList() {
      this.$store.dispatch('getGoodsList').then((response) => {
        this.goodsList = response.goodsList;

        const loadData = this.loadingData.find(item => item.id === 'goods');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'goods');
        loadData.title = error.text;
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
    confirmDeleted: function confirmDeleted(item) {
      this.dialogDeleted = true;
      this.deletedIndex = this.bouquetsList.indexOf(item);
    },
    deletedItem: function deletedItem(index) {
      this.bouquetsList.splice(index, 1);
      this.closeConfirm();
    },
    closeConfirm: function closeDialog() {
      this.dialogDeleted = false;
      setTimeout(() => {
        this.deletedIndex = -1;
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
