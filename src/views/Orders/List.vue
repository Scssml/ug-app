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
      <v-card>
        <v-card-title>
          <v-dialog
            v-model="dialogForm"
            :max-width="(editStatus || editDescription) ? '420px' : '1200px'"
            :fullscreen="(editStatus || editDescription) ? false : true"
          >
            <v-btn slot="activator" color="primary" dark class="mb-2">Добавить</v-btn>
            <template
              v-if="dialogForm"
            >
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
              <order-edit
                v-if="editedId && !editStatus && !editDescription"
                :id="editedId"
                :copy="copyElem"
                :orderSourceType="orderSourceTypeEditElem"
                @cancel="closeDialog()"
              ></order-edit>
              <order-add
                v-if="!editedId && !editStatus && !editDescription"
                @cancel="closeDialog()"
              ></order-add>
            </template>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-layout
            row
            wrap
            justify-space-around
          >
            <!-- <v-flex
              xs2
              class="px-3"
            >
              <v-text-field
                v-model="search"
                prepend-icon="search"
                label="Поиск"
                hide-details
              ></v-text-field>
            </v-flex> -->
            <v-flex
              xs2
              class="px-2"
            >
              <v-select
                label="Статус"
                :items="[{id: '', name: 'Все'}].concat(statusList)"
                item-text="name"
                item-value="id"
                v-model="filter.orderStatus"
                hide-details
                @change="customFilter()"
              ></v-select>
            </v-flex>
            <v-flex
              xs2
              class="px-2"
            >
              <v-autocomplete
                label="Клиент"
                :items="[{id: '', name: 'Все', phone: ''}].concat(clientsList)"
                :filter="clientsFilter"
                item-text="name"
                item-value="id"
                v-model="filter.client"
                hide-details
                class="mb-4"
                no-data-text="Не надено"
                @change="customFilter()"
              ></v-autocomplete>
            </v-flex>
            <v-flex
              xs2
              class="px-2"
            >
              <v-select
                label="Тип клиента"
                :items="[{id: '', name: 'Все'}].concat(typeClient)"
                item-text="name"
                item-value="id"
                v-model="filter.clientType"
                hide-details
                @change="customFilter()"
              ></v-select>
            </v-flex>
            <v-flex
              xs2
              class="pl-2"
            >
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
                  v-model="filter.dateStart"
                  prepend-icon="event"
                  hide-details
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="filter.dateStart"
                  @input="dataStartPicker = false"
                  no-title
                  scrollable
                  locale="ru-ru"
                  first-day-of-week="1"
                  :max="(!!filter.dateEnd) ? filter.dateEnd : undefined"
                  @change="customFilter()"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex
              xs2
              class="pl-2"
            >
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
                  v-model="filter.dateEnd"
                  prepend-icon="event"
                  hide-details
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="filter.dateEnd"
                  @input="dataEndPicker = false"
                  no-title
                  locale="ru-ru"
                  scrollable
                  first-day-of-week="1"
                  :min="(!!filter.dateStart) ? filter.dateStart : undefined"
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
          >Заказы за день</v-btn>
        </v-card-title>

        <v-layout
          row
          wrap
          align-center
        >
          <v-flex
            xs3
            class="px-1"
          >
            Доставок на сегодня: {{ deliveryNow }}
          </v-flex>
          <v-flex
            xs9
            class="px-1 text-xs-right"
          >
            <v-btn
              color="primary"
              dark
              @click.prevent="setFilterDateNow()"
            >За сегодня</v-btn>

            <v-btn
              color="primary"
              dark
              @click.prevent="setFilterDateWeek()"
            >За неделю</v-btn>

            <v-btn
              color="primary"
              dark
              @click.prevent="setFilterDateMonth()"
            >За месяц</v-btn>
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
        >
          <template slot="items" slot-scope="props">
            <tr
              :class="[props.item.orderStatus.color, (props.item.topLine) ? 'top-line' : '']"
            >
              <td class="px-1">
                <b>{{ props.item.deliveryDateStr }}</b>
                <template v-if="props.item.deliveryTime">
                  <br><b>{{ props.item.deliveryTime }}</b>
                </template>
                <template v-if="props.item.addresseeName">
                  <br>{{ props.item.addresseeName }}
                </template>
                <template v-if="props.item.addresseePhone">
                  <br>{{ props.item.addresseePhone }}
                </template>
                <template v-if="!props.item.addresseeName && !props.item.addresseePhone">
                  <br>{{ props.item.clientName }}
                  <br>{{ props.item.clientPhone }}
                </template>
                <template v-if="props.item.address">
                  <br>{{ props.item.address }}
                </template>
                <template v-if="props.item.flat">
                  , кв. {{ props.item.flat }}
                </template>
                <template v-if="props.item.entrance">
                  <br>Подъезд: {{ props.item.entrance }}
                </template>
                <template v-if="props.item.floor">
                  <br>Этаж: {{ props.item.floor }}
                </template>
              </td>
              <td class="px-1">
                {{ props.item.createdAt }}
                <br>{{ props.item.createdBy.name }}
                <template v-for="(item, index) in props.item.orderSourceType">
                  <template v-if="item">
                    <br :key="index">{{ item.name }}
                  </template>
                </template>
              </td>
              <td style="width: 30px;" class="px-1">{{ props.item.id }}</td>
              <td class="px-1">
                {{ props.item.clientName }}
                <br>{{ props.item.clientPhone }}
                <br>Инкогнито : {{ (props.item.incognito) ? 'Да' : 'Нет' }}
              </td>
              <td
                class="px-1"
                style="cursor: pointer; width: 30%;"
                @click="changeDescription(props.item.id)"
              >{{ props.item.description }}</td>
              <td class="px-1">
                <template v-for="(item, key) in props.item.bouquets">
                  {{ item.name }} - {{ item.count }}
                  <br :key="key">
                </template>
              </td>
              <td class="px-1">{{ props.item.deliveryType.name }}</td>
              <td class="px-1">{{ props.item.orderCost }}</td>
              <td
                @click="changeStatus(props.item.id)"
                style="cursor: pointer"
                class="px-1"
              >
                {{ props.item.orderStatus.name }}
                <br>{{ (props.item.courier) ? props.item.courier.name : '' }}
              </td>
              <td class="text-xs-right px-1" style="width: 100px;">
                <v-icon
                  left
                  @click="createdBouquet(props.item)"
                  v-if="props.item.orderStatus.id === 1 || props.item.orderStatus.id === 7"
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

                <br>

                <v-icon
                  left
                  @click="editItem(props.item.id)"
                  title="Изменить"
                >
                  edit
                </v-icon>

                <v-menu
                  style="vertical-align: top;"
                >
                  <v-icon
                    left
                    slot="activator"
                    title="Печать"
                    @click="isAlreadyPrinted(props.item.id)"
                  >
                    insert_drive_file
                  </v-icon>

                  <v-list>
                    <v-list-tile
                      :to="`/print/order/delivery/${props.item.id}/`"
                      v-if="props.item.deliveryType.id === 2"
                      target="_blank"
                      :class="(deliveryPrinted.find(item => item === props.item.id)) ? 'teal lighten-2' : '123'"
                    >
                      <v-list-tile-title>Печать бланка заказа на доставку</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      :to="`/print/order/florist/${props.item.id}/`"
                      target="_blank"
                    >
                      <v-list-tile-title>Печать бланка флориста</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <!-- <v-btn
                  small
                  outline
                  color="grey darken-3"
                  @click="createdBouquet(props.item)"
                  v-if="props.item.orderStatus.id === 1"
                >
                  <v-icon
                    left
                  >
                    playlist_add
                  </v-icon>
                  Собрать
                </v-btn>

                <v-btn
                  small
                  outline
                  color="grey darken-3"
                  @click="editItem(props.item.id, true)"
                >
                  <v-icon
                    left
                  >
                    add_to_photos
                  </v-icon>
                  Скопировать
                </v-btn>

                <v-btn
                  small
                  outline
                  color="grey darken-3"
                  @click="editItem(props.item.id)"
                >
                  <v-icon
                    left
                  >
                    edit
                  </v-icon>
                  Изменить
                </v-btn>

                <v-menu
                  style="vertical-align: top;"
                >
                  <v-btn
                    small
                    outline
                    color="grey darken-3"
                    slot="activator"
                  >
                    <v-icon
                      left
                    >
                      insert_drive_file
                    </v-icon>
                    Печать
                  </v-btn>

                  <v-list>
                    <v-list-tile
                      @click.prevent="printDoc(props.item.id, 'florist')"
                      target="_blank"
                    >
                      <v-list-tile-title>Печать бланка флориста</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      @click.prevent="printDoc(props.item.id, 'delivery')"
                      target="_blank"
                      v-if="props.item.deliveryType.id === 2"
                    >
                      <v-list-tile-title>Печать бланка заказа на доставку</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu> -->
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <v-btn
        fab
        color="info"
        class="mx-4"
        @click="dialogForm = true"
      >
        <v-icon dark>add</v-icon>
      </v-btn>
    </template>
  </v-container>
</template>

<script>
import OrderEdit from './edit.vue';
import OrderAdd from './add.vue';
import ChangeStatus from './changeStatus.vue';
import changeDescription from './changeDescription.vue';

export default {
  name: 'Orders',
  components: {
    OrderEdit,
    OrderAdd,
    ChangeStatus,
    changeDescription,
  },
  data() {
    return {
      filter: {
        orderStatus: '',
        client: '',
        clientType: '',
        dateStart: null,
        dateEnd: null,
      },
      loadingData: [
        {
          title: 'Получение заказов',
          error: false,
          loading: true,
          color: 'amber',
          id: 'orders',
        },
      ],
      dataStartPicker: false,
      dataEndPicker: false,
      search: '',
      headersTable: [
        {
          text: 'Дата доставки',
          align: 'left',
          value: 'deliveryDate',
        },
        {
          text: 'Дата',
          align: 'left',
          value: 'createdAt',
        },
        {
          text: '№ заказа',
          align: 'left',
          value: 'id',
        },
        {
          text: 'Клиент',
          align: 'left',
          value: 'client.clientName',
        },
        {
          text: 'Комментарий',
          align: 'left',
          value: 'description',
        },
        {
          text: 'Букеты',
          align: 'left',
          value: 'bouquets',
          sortable: false,
        },
        {
          text: 'Тип доставки',
          align: 'left',
          value: 'deliveryType.name',
        },
        {
          text: 'Сумма',
          align: 'left',
          value: 'orderCost',
        },
        {
          text: 'Статус',
          align: 'left',
          value: 'orderStatus.name',
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      pagination: {
        sortBy: 'deliveryDate',
        descending: false,
        rowsPerPage: -1,
      },
      dialogForm: false,
      ordersList: [],
      statusList: [],
      clientsList: [],
      typeClient: [],
      editedId: 0,
      copyElem: false,
      editStatus: false,
      editDescription: false,
      dataNowStr: '',
      deliveryNow: 0,
      deliveryPrinted: [],
      floristPrinted: [],
    };
  },
  watch: {
    dialogForm(newValue) {
      if (!newValue) {
        this.closeDialog();
      }
    },
  },
  computed: {
    loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    orderSourceTypeEditElem() {
      const editElem = this.ordersList.find(item => item.id === this.editedId);
      return (editElem) ? editElem.orderSourceType : [];
    },
  },
  methods: {
    printDoc(id, type) {
      const { protocol, hostname } = window.location;
      const url = `${protocol}//${hostname}/print/order/${id}/${type}`;
      window.open(url, '_blank');
    },
    printDayOrders() {
      const dateNow = new Date();
      const dateNowStr = dateNow.toISOString().split('T')[0];
      const { protocol, hostname } = window.location;
      const url = `${protocol}//${hostname}/print/day-orders/${dateNowStr}`;
      window.open(url, '_blank');
    },
    customFilter() {
      // const filterProps = this.filter;
      // let itemsFind = [];

      // itemsFind = items.filter((item) => {
      //   let find = false;
      //   if (+item.orderStatus.id === filterProps.status || filterProps.status === '') {
      //     find = true;
      //   }

      //   return find;
      // });

      // itemsFind = itemsFind.filter((item) => {
      //   let find = false;
      //   if (+item.clientType.id === filterProps.typeClient || filterProps.typeClient === '') {
      //     find = true;
      //   }

      //   return find;
      // });

      // itemsFind = itemsFind.filter((item) => {
      //   let find = false;
      //   if (+item.client.id === filterProps.client || filterProps.client === '') {
      //     find = true;
      //   }

      //   return find;
      // });

      // itemsFind = itemsFind.filter((item) => {
      //   let find = false;
      //   if (
      //     (item.createdAt >= filterProps.dateStart || filterProps.dateStart === null)
      //     && (item.createdAt <= filterProps.dateEnd || filterProps.dateEnd === null)
      //   ) {
      //     find = true;
      //   }

      //   return find;
      // });

      // return itemsFind;
      this.getOrdersList();
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1;
    },
    getOrdersList() {
      const orderFilter = {
        deliveryDate: [],
      };

      Object.keys(this.filter).forEach((key) => {
        const val = this.filter[key];

        if (val) {
          if (key === 'dateStart') {
            orderFilter.deliveryDate[0] = `${val}`;
          } else if (key === 'dateEnd') {
            orderFilter.deliveryDate[1] = `${val}`;
          } else {
            orderFilter[key] = val;
          }
        }
      });

      const itemParams = {
        type: 'orders',
        sort: {
          deliveryDate: 'desc',
        },
        filter: orderFilter,
      };

      const successData = 'Заказы получены!';
      const errorData = 'Ошибка получения заказов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        let deliveryDay = '';

        this.ordersList = response.map((item) => {
          const elem = item;

          if (deliveryDay !== elem.deliveryDate) {
            elem.topLine = true;
            deliveryDay = elem.deliveryDate;
          } else {
            elem.topLine = false;
          }

          if (elem.createdAt) {
            const date = new Date(elem.createdAt);
            elem.createdAt = date.toLocaleString('ru', {
              day: 'numeric',
              month: 'numeric',
              // year: 'numeric',
            });
          }

          if (elem.deliveryDate) {
            const date = new Date(elem.deliveryDate);
            elem.deliveryDateStr = date.toLocaleString('ru', {
              day: 'numeric',
              month: 'numeric',
              // year: 'numeric',
              weekday: 'long',
            });
          }

          return elem;
        });

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;

        this.getDeliveryNow();
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getDeliveryNow() {
      const orderFilter = {
        deliveryDate: [this.dateNowStr, this.dateNowStr],
        deliveryType: 2,
      };

      const itemParams = {
        type: 'orders',
        sort: {
          deliveryDate: 'desc',
        },
        filter: orderFilter,
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.deliveryNow = response.length;
      }).catch(() => {
        console.log('error');
      });
    },
    getStatusList() {
      const itemParams = {
        type: 'order-status',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.statusList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    getClientsList() {
      const itemParams = {
        type: 'clients',
        filter: {
          active: true,
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.clientsList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    getClientTypeList() {
      const itemParams = {
        type: 'client-type',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.typeClient = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    closeDialog() {
      this.getOrdersList();
      this.dialogForm = false;
      this.copyElem = false;
      this.editedId = 0;
      setTimeout(() => {
        this.editStatus = false;
        this.editDescription = false;
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
    createdBouquet: function createdBouquet(item) {
      let cardsList = JSON.parse(localStorage.getItem('cardsList'));
      cardsList = (cardsList !== null) ? cardsList : [];

      const index = cardsList.findIndex(card => card.props.order === item.id);
      if (index === -1) {
        cardsList.push({
          sum: 0,
          success: false,
          props: {
            floristId: null,
            orderId: item.id,
            clientId: item.client.id,
            decorPercent: 10,
            deliveryCost: 0,
            salePercent: 0,
          },
          goods: [],
        });
      } else {
        cardsList[index].props.clientId = item.client.id;
      }
      localStorage.setItem('cardsList', JSON.stringify(cardsList));
      this.$router.push({ path: '/', query: { selectOrder: item.id } });
    },
    getWeekEndDate() {
      const date = new Date();
      let diff = 7 - date.getDay();
      if (diff < 0) {
        diff += 6;
      }
      date.setDate(date.getDate() + (1 * diff));
      return date.toISOString().split('T')[0];
    },
    getWeekStartDate() {
      const date = new Date();
      let diff = date.getDay() - 8;
      if (diff < 0) {
        diff += 7;
      }
      date.setDate(date.getDate() + (-1 * diff));
      return date.toISOString().split('T')[0];
    },
    setFilterDateNow() {
      this.filter.dateStart = this.dateNowStr;
      this.filter.dateEnd = this.dateNowStr;
      this.getOrdersList();
    },
    setFilterDateWeek() {
      this.filter.dateStart = this.getWeekStartDate();
      this.filter.dateEnd = this.getWeekEndDate();
      this.getOrdersList();
    },
    setFilterDateMonth() {
      const date = new Date();
      const firstDay = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1, date.getUTCHours());
      const lastDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59);
      const dateStart = firstDay.toISOString().split('T')[0];
      const dateEnd = lastDay.toISOString().split('T')[0];

      this.filter.dateStart = dateStart;
      this.filter.dateEnd = dateEnd;
      this.getOrdersList();
    },
    isAlreadyPrinted() {
      // if (!this.deliveryPrinted.find(item => item === id)) {
      //   const itemParams = {
      //     type: 'print/order',
      //   };

      //   itemParams.id = `${id}/delivery`;

      //   this.$store.dispatch('getItem', itemParams).then((response) => {
      //     if (response.isAlreadyPrinted) {
      //       this.deliveryPrinted.push(id);
      //     }
      //   }).catch(() => {
      //     console.log('error');
      //   });
      // }

      // itemParams.id = `${id}/florist`;

      // this.$store.dispatch('getItem', itemParams).then((response) => {
      //   this.floristPrinted = response.isAlreadyPrinted;
      // }).catch(() => {
      //   console.log('error');
      // });
    },
  },
  mounted() {
    const date = new Date();
    const dateNowStr = date.toISOString().split('T')[0];
    this.dateNowStr = dateNowStr;

    const dateStart = dateNowStr;

    date.setDate(date.getDate() + 7);
    const dateEnd = date.toISOString().split('T')[0];

    this.filter.dateStart = dateStart;
    this.filter.dateEnd = dateEnd;

    this.getOrdersList();
    this.getStatusList();
    this.getClientsList();
    this.getClientTypeList();
    if (this.$route.query.client !== undefined) {
      this.filter.client = +this.$route.query.client;
    }
  },
};
</script>

<style land="scss">
  .orders-table .theme--light.v-table tbody tr:not(:last-child).top-line {
    border-top: 4px solid #404040!important;
  }
  .orders-table .theme--light.v-table tbody tr:not(:last-child) {
    border-bottom: none;
    border-top: 1px solid #9c9c9c!important;
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
    border-right: 1px solid rgba(0,0,0,.12);
  }

  .theme--light.v-table thead tr:first-child {
    border-top: 1px solid rgba(0,0,0,.12);
  }
</style>
