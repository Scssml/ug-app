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
      <v-snackbar
        :value="true"
        v-if="selectedOrders.length > 0"
        color="info"
        bottom
        :timeout="3600000"
      >
        <v-btn
          dark
          flat
          depressed
          :to="`/print/orders/delivery/${printOrdersIds}/`"
          target="_blank"
          class="ml-0"
          >Печать бланков на доставку</v-btn
        >

        <v-btn
          dark
          flat
          depressed
          :to="`/print/orders/florist/${printOrdersIds}/`"
          target="_blank"
          >Печать бланков флористов</v-btn
        >
      </v-snackbar>
      <v-card>
        <v-card-title>
          <v-dialog
            v-model="dialogForm"
            :max-width="editStatus || editDescription ? '420px' : '1200px'"
            :fullscreen="editStatus || editDescription ? false : true"
          >
            <v-btn slot="activator" color="primary" dark class="mb-2"
              >Добавить</v-btn
            >
            <template v-if="dialogForm">
              <change-status
                v-if="editStatus"
                :id="editedId"
                :orderSourceType="orderSourceTypeEditElem"
                @cancel="closeDialog()"
              ></change-status>
              <change-description
                v-if="editDescription"
                :id="editedId"
                :orderSourceType="orderSourceTypeEditElem"
                @cancel="closeDialog()"
              ></change-description>
              <edit-bouquets
                v-if="editOrderBouquets"
                :id="editedId"
                :orderSourceType="orderSourceTypeEditElem"
                @cancel="closeDialog()"
              ></edit-bouquets>
              <order-edit
                v-if="editedId && !editStatus && !editDescription && !editOrderBouquets"
                :id="editedId"
                :copy="copyElem"
                :orderSourceType="orderSourceTypeEditElem"
                @cancel="closeDialog()"
              ></order-edit>
              <order-add
                v-if="
                  !editedId && !editStatus && !editDescription && !editSettings && !editOrderBouquets
                "
                @cancel="closeDialog()"
              ></order-add>
              <user-settings
                v-if="editSettings"
                :userSettings="userSettings"
                @cancel="closeDialog()"
              ></user-settings>
            </template>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-layout row wrap justify-space-around>
            <v-flex xs2 class="px-2">
              <v-select
                label="Статус"
                :items="statusList"
                item-text="name"
                item-value="id"
                v-model="filter.order_status"
                hide-details
                @change="customFilter()"
              ></v-select>
            </v-flex>
            <v-flex xs2 class="px-2">
              <v-select
                label="Клиент"
                :items="clientsList"
                item-text="name"
                item-value="id"
                v-model="filter.client_id"
                hide-details
                clearable
                @change="customFilter()"
              ></v-select>
              <!-- <autosuggest
                :suggestions="clientSuggestions"
                placeholder="Клиенты"
                :value="filter.client"
                @onChange="onClientsInputChange"
                @onSelect="onClientSelect"
                class="view-filter"
              /> -->
            </v-flex>

            <v-flex
              xs2
              class="px-2"
              v-if="$store.getters.getAuthUserGroup.code === 'admin'"
            >
              <v-select
                label="Менеджер"
                :items="usersList"
                item-text="name"
                item-value="id"
                v-model="filter.user_id"
                hide-details
                clearable
                @change="customFilter()"
              ></v-select>
            </v-flex>

            <v-flex xs2 class="px-2">
              <v-select
                label="Время суток"
                :items="deliveryTimeOfDayFilter"
                item-text="name"
                item-value="id"
                v-model="filter.times_of_day"
                hide-details
                @change="customFilter()"
              ></v-select>
            </v-flex>
            <v-flex xs2 class="pl-2">
              <v-menu
                :close-on-content-click="false"
                v-model="dataStartPicker"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                class="mb-4"
              >
                <v-text-field
                  slot="activator"
                  label="Дата доставки (с)"
                  v-model="filter.start_date"
                  prepend-icon="event"
                  hide-details
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="filter.start_date"
                  @input="dataStartPicker = false"
                  no-title
                  scrollable
                  locale="ru-ru"
                  first-day-of-week="1"
                  :max="!!filter.end_date ? filter.end_date : undefined"
                  @change="customFilter()"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs2 class="pl-2">
              <v-menu
                :close-on-content-click="false"
                v-model="dataEndPicker"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                class="mb-4"
              >
                <v-text-field
                  slot="activator"
                  label="Дата доставки (по)"
                  v-model="filter.end_date"
                  prepend-icon="event"
                  hide-details
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="filter.end_date"
                  @input="dataEndPicker = false"
                  no-title
                  locale="ru-ru"
                  scrollable
                  first-day-of-week="1"
                  :min="!!filter.start_date ? filter.start_date : undefined"
                  @change="customFilter()"
                ></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            :to="`/print/order/day-orders/${dateNowStr}/`"
            target="_blank"
            >Заказы за день</v-btn
          >
        </v-card-title>

        <v-layout row wrap align-center>
          <v-flex xs3 class="px-1">
            <v-layout row wrap align-center>
              <v-flex class="px-1">
                Доставок на сегодня: {{ todayDeliveriesCount }}<br>
                Количество заказов: {{ ordersCount }}
              </v-flex>
              <v-flex xs4 class="px-1">
                <v-btn color="primary" dark @click.prevent="changeSettings()"
                  >Настройки</v-btn
                >
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs9 class="px-1 text-xs-right">
            <v-btn color="primary" dark @click.prevent="setFilterNewOrderSite()"
              >Новые заказы с сайта</v-btn
            >

            <v-btn color="primary" dark @click.prevent="setFilter14February()"
              >6 марта</v-btn
            >

            <v-btn color="primary" dark @click.prevent="setFilter8March()"
              >8 марта</v-btn
            >

            <v-btn color="primary" dark @click.prevent="setFilterDateNow()"
              >За сегодня</v-btn
            >

            <v-btn color="primary" dark @click.prevent="setFilterDateWeek()"
              >За неделю</v-btn
            >

            <v-btn color="primary" dark @click.prevent="setFilterDateMonth()"
              >За месяц</v-btn
            >
          </v-flex>
        </v-layout>

        <v-data-table
          :headers="headersTable"
          :items="ordersList"
          hide-actions
          no-data-text="Заказов не найдено"
          no-results-text="Заказов не найдено"
          :pagination.sync="pagination"
          class="orders-table"
          select-all
          v-model="selectedOrders"
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td
                style="width: 30px; max-width: 30px; min-width: 30px;"
                class="px-1"
              >
                <v-checkbox
                  v-model="props.selected"
                  color="primary"
                  hide-details
                ></v-checkbox>
              </td>
              <td>
                №{{ props.item.id }}
                <br>Статус: {{ props.item.status}}
                <br>{{ props.item.user.name }}
                <br>Т/С: {{ props.item.order_source}}
              </td>
              <td>
                Заказчик: {{ props.item.client.name }}

                <template v-if="props.item.recipient_id">
                  <br>Получатель: {{ props.item.recipient.name }}
                </template>
              </td>
              <td>
                <template v-for="(item, index) in props.item.bouquets">
                  <p :key="index">{{ item.name }} - {{ item.count }} ({{ item.place }})</p>
                </template>
              </td>
              <td></td>
              <td>
                Стоимость: {{ props.item.cost }}

                <template v-if="props.item.delivery_cost">
                  <br>Доставка: {{ props.item.delivery_cost }}
                </template>

                <template v-if="props.item.pre_payment">
                  <br>Предоплата: {{ props.item.pre_payment }}
                  <br>Оплачено: {{ (props.item.already_paid) ? 'Да' : 'Нет' }}

                  <template v-if="props.item.already_paid">
                    <br>Способ: {{ props.item.pay_channel }}
                  </template>
                </template>
              </td>
              <td
                class="text-xs-right px-1"
                style="width: 100px; max-width: 100px; min-width: 100px;"
              >
                <!-- <v-icon
                  left
                  @click="createdBouquet(props.item)"
                  v-if="
                    props.item.orderStatus.id === 1 ||
                      props.item.orderStatus.id === 7
                  "
                  title="Собрать"
                >
                  playlist_add
                </v-icon>

                <v-icon
                  left
                  @click="editItem(props.item.id, true)"
                  title="Скопировать"
                >
                  add_to_photos
                </v-icon>

                <br /> -->

                <v-icon left @click="editItem(props.item.id)" title="Изменить">
                  edit
                </v-icon>

                <!-- <v-menu style="vertical-align: top;">
                  <v-icon
                    left
                    slot="activator"
                    title="Печать"
                    :color="
                      props.item.isAlreadyPrinted ? 'teal darken-3' : '123'
                    "
                  >
                    insert_drive_file
                  </v-icon>

                  <v-list>
                    <v-list-tile
                      :to="`/print/order/delivery/${props.item.id}/`"
                      v-if="props.item.deliveryType.id === 2"
                      target="_blank"
                    >
                      <v-list-tile-title
                        >Печать бланка заказа на доставку</v-list-tile-title
                      >
                    </v-list-tile>
                    <v-list-tile
                      :to="`/print/order/florist/${props.item.id}/`"
                      target="_blank"
                    >
                      <v-list-tile-title
                        >Печать бланка флориста</v-list-tile-title
                      >
                    </v-list-tile>
                  </v-list>
                </v-menu> -->
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-layout row wrap justify-space-around class="py-2">
          <v-flex xs2 class="px-3">
            <v-text-field
              label="Количество на странице"
              v-model.number="take"
              hide-details
              @change="changeShowElem()"
            ></v-text-field>
          </v-flex>
          <v-flex xs10 class="text-xs-right px-3">
            <v-btn
              small
              color="info"
              class="ml-3"
              :disabled="page === 1"
              @click="prevPage()"
            >
              <v-icon dark>keyboard_arrow_left</v-icon>
            </v-btn>
            <v-btn
              small
              color="info"
              class="ml-3"
              :disabled="ordersList.length < take"
              @click="nextPage()"
            >
              <v-icon dark>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
      <v-btn fab color="info" class="mx-4" @click="dialogForm = true">
        <v-icon dark>add</v-icon>
      </v-btn>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios';
import OrderEdit from "./edit.vue";
import OrderAdd from "./add.vue";
import ChangeStatus from "./changeStatus.vue";
import changeDescription from "./changeDescription.vue";
import changeAlreadyPaid from "./changeAlreadyPaid.vue";
import userSettings from "./userSettings.vue";
import editBouquets from './editOrderBouquets.vue';

export default {
  name: 'Orders',
  components: {
    OrderEdit,
    OrderAdd,
    ChangeStatus,
    changeDescription,
    changeAlreadyPaid,
    userSettings,
    editBouquets,
  },
  data() {
    return {
      filter: {
        order_status: '',
        client_id: null,
        user_id: null,
        times_of_day: 0,
        start_date: null,
        end_date: null,
      },
      loadingData: [
        {
          title: 'Получение заказов',
          error: false,
          loading: false,
          color: 'amber',
          id: 'orders',
        },
      ],
      dateNowStr: '',
      dataStartPicker: false,
      dataEndPicker: false,
      search: '',
      dialogForm: false,
      ordersList: [],
      statusList: [
        {
          name: 'Все',
          id: '',
        },
        {
          name: 'Принят',
          id: 'accept',
        },
        {
          name: 'Выполнен',
          id: 'completed',
        },
        {
          name: 'Дозаказ',
          id: 'additionalOrder',
        },
        {
          name: 'Доставлен',
          id: 'delivered',
        },
        {
          name: 'Отдан в доставку',
          id: 'deliveredForDelivery',
        },
        {
          name: 'Отменен',
          id: 'canceled',
        },
        {
          name: 'Завершен',
          id: 'ended',
        },
      ],
      clientsList: [],
      usersList: [],
      editedId: 0,
      copyElem: false,
      editStatus: false,
      editDescription: false,
      editSettings: false,
      editOrderBouquets: false,
      dataNowStr: '',
      todayDeliveriesCount: 0,
      ordersCount: 0,
      deliveryPrinted: [],
      floristPrinted: [],
      selectedOrders: [],
      deliveryTimeOfDayList: {
        1: "Утро",
        2: "День",
        3: "Вечер"
      },
      userSettings: [],
      pagination: {
        sortBy: "id",
        rowsPerPage: -1,
        descending: false
      },
      deliveryTimeOfDayFilter: [
        {
          name: 'Все',
          id: '',
        },
        {
          name: 'Утро',
          id: 'morning',
        },
        {
          name: 'День',
          id: 'noon',
        },
        {
          name: 'Вечер',
          id: 'evening',
        },
      ],
      take: 20,
      page: 1,
      tableLoading: false,
      skipQuery: false,
      orderSourceTypeIds: [],
      clientSuggestions: [],
      skipClientsQuery: true,
      clientsQueryName: "",

      headersTable: [
        {
          text: '№',
          align: 'left',
          value: 'id',
          sortable: false,
        },
        {
          text: 'Заказчик',
          align: 'left',
          value: 'id',
          sortable: false,
        },
        {
          text: 'Состав',
          align: 'left',
          value: 'id',
          sortable: false,
        },
        {
          text: 'Адрес',
          align: 'left',
          value: 'id',
          sortable: false,
        },
        {
          text: 'Оплата',
          align: 'left',
          value: 'id',
          sortable: false,
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
    };
  },
  watch: {
    dialogForm(newValue) {
      if (!newValue) {
        this.closeDialog();
      }
    },
    updateOrderList(newValue) {
      if (newValue) {
        this.$store.commit("setUpdateOrderList", false);
        this.getOrdersList(false);
      }
    }
  },
  computed: {
    updateOrderList() {
      return this.$store.getters.getUpdateOrderList;
    },
    loadingDialog() {
      const loadData = this.loadingData.filter(
        item => !item.error && !item.loading
      );
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    orderSourceTypeEditElem() {
      const editElem = this.ordersList.find(item => item.id === this.editedId);
      return editElem ? editElem.orderSourceTypeIds : [];
    },
    // headersTable() {
    //   const cols = this.userSettings.map(item => {
    //     const elem = {
    //       text: item.columnName,
    //       align: "left",
    //       value: item.sortField,
    //       width: item.width
    //     };

    //     return elem;
    //   });

    //   const colAction = {
    //     text: "",
    //     align: "right",
    //     sortable: false,
    //     value: "action"
    //   };

    //   cols.push(colAction);

    //   return cols;
    // },
    printOrdersIds() {
      return this.selectedOrders.map(item => item.id);
    }
  },
  methods: {
    getClients() {
      const url = 'clients';

      axios
        .get(url)
        .then((response) => {
          const items = response.data;
          this.clientsList = items;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getUsers() {
      const url = 'users';

      axios
        .get(url)
        .then((response) => {
          const items = response.data;
          this.usersList = items;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getOrdersList() {
      const loadData = this.loadingData.find(item => item.id === 'orders');
      const url = 'orders';

      const propsItem = {
        page: this.page,
        page_limit: this.take,
      };

      Object.keys(this.filter).forEach((key) => {
        if (this.filter[key]) {
          propsItem[key] = this.filter[key];
        }
      });

      axios
        .get(url, {
          params: propsItem,
        })
        .then((response) => {
          const items = response.data;
          this.ordersList = items;

          loadData.title = 'Заказы получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения заказов!';
          loadData.error = true;
          console.log(error);
        });
    },
    onClientSelect(item) {
      this.filter.clientItem = item;
    },
    onClientsInputChange(text) {
      this.clientsQueryName = `%${text}%`;
      this.skipClientsQuery = false;

      if (text === "") {
        this.filter.clientItem = null;
      }
    },
    printOrders(type) {
      const arId = this.selectedOrders.map(item => item.id);
      if (type === "delivery") {
        this.$router.push({ name: "ordersDelivery", params: { ids: arId } });
      } else if (type === "florist") {
        this.$router.push({ name: "ordersFlorist", params: { ids: arId } });
      }
    },
    printDoc(id, type) {
      const { protocol, hostname } = window.location;
      const url = `${protocol}//${hostname}/print/order/${id}/${type}`;
      window.open(url, "_blank");
    },
    printDayOrders() {
      const dateNow = new Date();
      const dateNowStr = dateNow.toISOString().split("T")[0];
      const { protocol, hostname } = window.location;
      const url = `${protocol}//${hostname}/print/day-orders/${dateNowStr}`;
      window.open(url, "_blank");
    },
    customFilter() {
      this.page = 1;
      this.getOrdersList();
    },
    changeShowElem() {
      localStorage.setItem("countElemPage", this.take);
      this.$store.commit("setCountElemPage", this.take);
      this.page = 1;
      this.getOrdersList();
    },
    prevPage() {
      this.page -= 1;
      this.getOrdersList();
    },
    nextPage() {
      this.page += 1;
      this.getOrdersList();
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, "");
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    closeDialog() {
      this.getOrdersList();
      this.dialogForm = false;
      this.copyElem = false;
      this.editedId = 0;
      setTimeout(() => {
        this.editStatus = false;
        this.editDescription = false;
        this.editSettings = false;
        this.editOrderBouquets = false;
      }, 300);
    },
    editItem(id, copy = false) {
      this.editedId = +id;
      this.copyElem = copy;
      this.dialogForm = true;
    },
    changeStatus(id) {
      this.editedId = +id;
      this.editStatus = true;
      this.dialogForm = true;
    },
    changeDescription(id) {
      this.editedId = +id;
      this.editDescription = true;
      this.dialogForm = true;
    },
    changeBouquets(id) {
      this.editedId = +id;
      this.editOrderBouquets = true;
      this.dialogForm = true;
    },
    changeSettings() {
      this.editSettings = true;
      this.dialogForm = true;
    },
    createdBouquet: function createdBouquet(item) {
      let cardsList = JSON.parse(localStorage.getItem("cardsList"));
      cardsList = cardsList !== null ? cardsList : [];

      const index = cardsList.findIndex(card => card.props.order === item.id);
      if (index === -1) {
        cardsList.push({
          sum: 0,
          success: false,
          props: {
            floristId: null,
            orderId: item.id,
            client: item.client,
            clientId: item.client.id,
            decorPercent: 20,
            deliveryCost: item.deliveryCost,
            salePercent: '',
            sumDecorAdditional: 0
          },
          goods: []
        });
      } else {
        cardsList[index].props.clientId = item.client.id;
      }
      localStorage.setItem("cardsList", JSON.stringify(cardsList));
      const routeData = this.$router.resolve({ path: "/", query: { selectOrder: item.id } });
      window.open(routeData.href, '_blank');
    },
    getWeekEndDate() {
      const date = new Date();
      let diff = 7 - date.getDay();
      if (diff < 0) {
        diff += 6;
      }
      date.setDate(date.getDate() + 1 * diff);
      return date.toISOString().split("T")[0];
    },
    getWeekStartDate() {
      const date = new Date();
      let diff = date.getDay() - 8;
      if (diff < 0) {
        diff += 7;
      }
      date.setDate(date.getDate() + -1 * diff);
      return date.toISOString().split("T")[0];
    },
    setFilterDateNow() {
      this.filter.start_date = this.dateNowStr;
      this.filter.end_date = this.dateNowStr;

      this.customFilter();
    },
    setFilterDateWeek() {
      this.filter.start_date = this.getWeekStartDate();
      this.filter.end_date = this.getWeekEndDate();

      this.customFilter();
    },
    setFilterDateMonth() {
      const date = new Date();
      const firstDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        1,
        date.getUTCHours()
      );
      const lastDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        0,
        23,
        59,
        59,
      );
      const dateStart = firstDay.toISOString().split("T")[0];
      const dateEnd = lastDay.toISOString().split("T")[0];

      this.filter.start_date = dateStart;
      this.filter.end_date = dateEnd;

      this.customFilter();
    },
    setFilter14February() {
      const date = new Date();
      this.filter.start_date = `${date.getFullYear()}-03-06`;
      this.filter.end_date = `${date.getFullYear()}-03-06`;

      this.customFilter();
    },
    setFilter8March() {
      const date = new Date();
      this.filter.start_date = `${date.getFullYear()}-03-08`;
      this.filter.end_date = `${date.getFullYear()}-03-08`;

      this.customFilter();
    },
    setFilterNewOrderSite() {
      this.filter.start_date = '';
      this.filter.end_date = '';

      this.filter.order_status = 'accept';

      this.customFilter();
    },
    toggleAll() {
      if (this.selectedOrders.length) {
        this.selectedOrders = [];
      } else {
        this.selectedOrders = this.ordersList.slice();
      }
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }

      const sort = {
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending
      };

      this.$store.commit("setOrderSort", sort);
    }
  },
  mounted() {
    this.getOrdersList();
    this.getClients();
    this.getUsers();

    const dateNow = new Date();
    const year = dateNow.getFullYear();
    let month = dateNow.getMonth() + 1;
    month = `0${month}`.slice(-2);
    const day = dateNow.getDate();

    this.dateNowStr = `${year}-${month}-${day}`;
  },
};
</script>

<style land="scss">
.orders-table .theme--light.v-table tbody tr:not(:last-child).top-line {
  border-top: 4px solid #404040 !important;
}
.orders-table .theme--light.v-table tbody tr:not(:last-child) {
  border-bottom: none;
  border-top: 1px solid #9c9c9c !important;
}
.orders-table table.v-table thead th:first-child,
.orders-table table.v-table thead th:not(:first-child) {
  padding: 0 4px;
}
.orders-table table.v-table tbody td:first-child,
.orders-table table.v-table tbody td:not(:first-child),
.orders-table table.v-table tbody th:first-child,
.orders-table table.v-table tbody th:not(:first-child),
.orders-table table.v-table thead td:first-child,
.orders-table table.v-table thead td:not(:first-child),
.orders-table table.v-table thead th:first-child,
.orders-table table.v-table thead th:not(:first-child) {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.theme--light.v-table thead tr:first-child {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.orders-table .v-datatable thead th.column.sortable .v-icon {
  display: block;
  width: 16px;
}
</style>
