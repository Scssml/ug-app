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
              <order-edit
                v-if="editedId && !editStatus && !editDescription"
                :id="editedId"
                :copy="copyElem"
                :orderSourceType="orderSourceTypeEditElem"
                @cancel="closeDialog()"
              ></order-edit>
              <order-add
                v-if="
                  !editedId && !editStatus && !editDescription && !editSettings
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
            <v-flex xs2 class="px-2 py-3">
              <v-select
                label="Статус"
                :items="[{ id: 0, name: 'Все' }].concat(statusList)"
                item-text="name"
                item-value="id"
                v-model="filter.orderStatus"
                hide-details
                @change="customFilter()"
              ></v-select>
            </v-flex>
            <v-flex class="px-2 py-3">
              <autosuggest
                :suggestions="clientSuggestions"
                placeholder="Клиенты"
                :value="filter.client"
                @onChange="onClientsInputChange"
                @onSelect="onClientSelect"
              />
            </v-flex>

            <v-flex
              xs2
              class="px-2"
              v-if="$store.getters.getAuthUserGroup.code === 'admin'"
            >
              <v-select
                label="Менеджер"
                :items="[{ id: 0, name: 'Все' }].concat(usersList)"
                item-text="name"
                item-value="id"
                v-model="filter.createdBy"
                hide-details
                @change="customFilter()"
              ></v-select>
            </v-flex>

            <v-flex xs2 class="px-2">
              <v-select
                label="Время суток"
                :items="
                  [{ id: 0, name: 'Все' }].concat(deliveryTimeOfDayFilter)
                "
                item-text="name"
                item-value="id"
                v-model="filter.deliveryTimeOfDay"
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
                  :max="!!filter.dateEnd ? filter.dateEnd : undefined"
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
                  :min="!!filter.dateStart ? filter.dateStart : undefined"
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
            Доставок на сегодня: {{ todayDeliveriesCount }}

            <v-btn color="primary" dark @click.prevent="changeSettings()"
              >Настройки</v-btn
            >
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
          item-key="id"
          :loading="$apollo.queries.ordersList.loading"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th class="px-1 text-xs-left">
                <v-checkbox
                  :input-value="props.all"
                  :indeterminate="props.indeterminate"
                  color="primary"
                  hide-details
                  @click.stop="toggleAll"
                ></v-checkbox>
              </th>
              <th
                v-for="header in props.headers"
                class="px-1 text-xs-left"
                :key="header.text"
                :class="[
                  'column sortable',
                  pagination.descending ? 'desc' : 'asc',
                  header.value === pagination.sortBy ? 'active' : ''
                ]"
                :style="{
                  width: `${header.width}px`,
                  maxWidth: `${header.width}px`,
                  minWidth: `${header.width}px`
                }"
                @click="changeSort(header.value)"
              >
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr
              :class="[
                props.item.orderStatus.color,
                props.item.isTopLine ? 'top-line' : ''
              ]"
            >
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
              <template v-for="(col, colIndex) in userSettings">
                <td
                  class="px-1"
                  :style="{
                    width: `${col.width}px`,
                    maxWidth: `${col.width}px`,
                    minWidth: `${col.width}px`
                  }"
                  :key="`col-${colIndex}`"
                >
                  <template v-for="(prop, propIndex) in col.dataFields">
                    <div :key="`prop-${colIndex}-${propIndex}`">
                      <template v-if="prop.displayName">
                        {{ prop.displayName }}:
                      </template>
                      <template
                        v-if="
                          props.item[prop.field] ||
                            prop.field === 'incognito' ||
                            prop.field === 'description' ||
                            prop.field === 'alreadyPaid' ||
                            prop.field === 'orderSourceType'
                        "
                      >
                        <template v-if="prop.field === 'deliveryTimeOfDay'">
                          {{ deliveryTimeOfDayList[props.item[prop.field]] }}
                        </template>
                        <template v-else-if="prop.field === 'createdAt'">
                          {{ formatDate(props.item[prop.field], "dd.LL") }}
                        </template>
                        <template v-else-if="prop.field === 'createdBy'">
                          {{ props.item[prop.field].name }}
                        </template>
                        <template v-else-if="prop.field === 'orderSourceType'">
                          {{
                            props.item["orderSourceTypeIds"]
                              .map(
                                st =>
                                  orderSourceTypes.find(t => t.id === st).name
                              )
                              .join(", ")
                          }}
                        </template>
                        <template v-else-if="prop.field === 'incognito'">
                          {{ props.item[prop.field] ? "Да" : "Нет" }}
                        </template>
                        <template v-else-if="prop.field === 'alreadyPaid'">
                          <change-already-paid
                            :order="props.item"
                          ></change-already-paid>
                          <!-- {{ (props.item[prop.field]) ? 'Да' : 'Нет' }} -->
                        </template>
                        <template v-else-if="prop.field === 'description'">
                          <div
                            @click="changeDescription(props.item.id)"
                            :style="
                              !props.item[prop.field]
                                ? 'min-height: 20px; box-shadow: 0 0 0 1px rgba(0,0,0,.12);'
                                : ''
                            "
                          >
                            {{ props.item[prop.field] }}
                          </div>
                        </template>
                        <template v-else-if="prop.field === 'bouquets'">
                          <template
                            v-for="(item, key) in props.item[prop.field]"
                          >
                            <div
                              :class="
                                item.readyBouquetCount.aggregate.count !== 0
                                  ? 'green'
                                  : ''
                              "
                            >
                              {{ item.name }} - {{ item.count }}
                              <template v-if="item.place">
                                ({{ item.place }})
                              </template>
                            </div>
                            <br :key="key" />
                          </template>
                        </template>
                        <template v-else-if="prop.field === 'orderStatus'">
                          <div
                            @click="changeStatus(props.item.id)"
                            style="display: inline"
                          >
                            {{ props.item[prop.field].name }}
                          </div>
                        </template>
                        <template v-else-if="prop.field === 'deliveryType'">
                          {{ props.item[prop.field].name }}
                        </template>
                        <template v-else-if="prop.field === 'deliveryDate'">
                          {{ formatDate(props.item[prop.field], "eee dd.MM") }}
                        </template>
                        <template v-else-if="prop.field === 'courier'">
                          {{ props.item[prop.field].name }}
                        </template>
                        <template v-else-if="prop.field === 'responsible'">
                          {{ props.item[prop.field].name }}
                          <br />{{ props.item[prop.field].phone }}
                        </template>
                        <template v-else-if="prop.field === 'clientType'">
                          {{ props.item[prop.field].name }}
                        </template>
                        <template v-else-if="prop.field === 'orderCost'">
                          <div :class="props.item.alreadyPaid ? 'green' : ''">
                            {{ props.item[prop.field] }}
                          </div>
                        </template>
                        <template v-else-if="prop.field === 'prePayment'">
                          <div
                            :class="
                              !props.item.alreadyPaid &&
                              props.item.prePayment > 0
                                ? 'orange'
                                : ''
                            "
                          >
                            {{ props.item[prop.field] }}
                          </div>
                        </template>
                        <template v-else>
                          {{ props.item[prop.field] }}
                        </template>
                      </template>
                    </div>
                  </template>
                </td>
              </template>
              <td
                class="text-xs-right px-1"
                style="width: 100px; max-width: 100px; min-width: 100px;"
              >
                <v-icon
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

                <br />

                <v-icon left @click="editItem(props.item.id)" title="Изменить">
                  edit
                </v-icon>

                <v-menu style="vertical-align: top;">
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
                </v-menu>
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
              :disabled="page === 0"
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
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";
import isAfter from "date-fns/isAfter";
import parse from "date-fns/parse";
import OrderEdit from "./edit.vue";
import OrderAdd from "./add.vue";
import ChangeStatus from "./changeStatus.vue";
import changeDescription from "./changeDescription.vue";
import changeAlreadyPaid from "./changeAlreadyPaid.vue";
import userSettings from "./userSettings.vue";
import Autosuggest from "../../components/Autosuggest";

export default {
  name: 'Orders',
  components: {
    autosuggest: Autosuggest,
    OrderEdit,
    OrderAdd,
    ChangeStatus,
    changeDescription,
    changeAlreadyPaid,
    userSettings,
  },
  data() {
    return {
      filter: {
        orderStatus: 0,
        client: null,
        clientItem: null,
        deliveryTimeOfDay: 0,
        dateStart: null,
        dateEnd: null,
        createdBy: 0
      },
      loadingData: [
        {
          title: 'Получение заказов',
          error: false,
          loading: true,
          color: "amber",
          id: "orders"
        }
      ],
      dateNowStr: '',
      dataStartPicker: false,
      dataEndPicker: false,
      search: '',
      dialogForm: false,
      ordersList: [],
      statusList: [],
      clientsList: [],
      usersList: [],
      editedId: 0,
      copyElem: false,
      editStatus: false,
      editDescription: false,
      editSettings: false,
      dataNowStr: "",
      todayDeliveriesCount: 0,
      deliveryPrinted: [],
      floristPrinted: [],
      selectedOrders: [],
      deliveryTimeOfDayList: {
        1: 'Утро',
        2: 'День',
        3: 'Вечер',
      },
      userSettings: [],
      pagination: {
        sortBy: 'id',
        rowsPerPage: -1,
        descending: false,
      },
      deliveryTimeOfDayFilter: [
        {
          name: 'Утро',
          id: 1,
        },
        {
          name: 'День',
          id: 2,
        },
        {
          name: 'Вечер',
          id: 3,
        },
      ],
      take: 20,
      page: 0,
      tableLoading: false,
      skipQuery: false,
      orderSourceTypeIds: [],
      clientSuggestions: [],
      skipClientsQuery: true,
      clientsQueryName: ""
    };
  },
  apollo: {
    ordersList: {
      query: function() {
        return gql`
        query OrderList(
          $limit: Int
          $offset: Int
          $startDate: date
          $endDate: date
          $orderStatus: bigint
          $createdBy: bigint
          $deliveryTimeOfDay: bigint
          $clientId: bigint
        ) {
          ordersList: orders(
            limit: $limit
            offset: $offset
            where: {
              _and: [
                { deliveryDate: { _gte: $startDate } }
                { deliveryDate: { _lte: $endDate } }
                { orderStatusId: { _eq: $orderStatus } }
                { createdById: { _eq: $createdBy } }
                { deliveryTimeOfDay: { _eq: $deliveryTimeOfDay } }
                { clientId: { _eq: $clientId } }
              ]
            }
            order_by: { ${this.pagination.sortBy}: ${
          this.pagination.descending ? "desc" : "asc"
        } }
          ) {
            id
            deliveryTimeOfDay
            orderSourceTypeIds
            incognito
            alreadyPaid
            prePayment
            description
            clientName
            clientPhone
            coordinates
            address
            entrance
            flat
            floor
            addresseeName
            addresseePhone
            deliveryCost
            isAlreadyPrinted
            deliveryType {
              id
              name
            }
            deliveryDate
            deliveryTime
            clientType {
              name
            }
            orderCost
            responsible {
              name
              phone
            }
            clientTypeId
            courier {
              name
            }
            client {
              id
              name
            }
            bouquets: orderBouquets {
              name
              count
              place
              readyBouquetCount: bouquets_aggregate {
                aggregate {
                  count
                }
              }
            }
            createdAt: created_at
            createdBy {
              name
            }
            orderStatus {
              id
              name
              color
            }
          }
        }
      `;
      },
      variables() {
        return {
          offset: +this.page * +this.take,
          limit: +this.take,
          startDate: this.filter.dateStart,
          endDate: this.filter.dateEnd,
          clientId: this.filter.clientItem
            ? this.filter.clientItem.id
            : undefined,
          orderStatus:
            this.filter.orderStatus !== 0 ? this.filter.orderStatus : undefined,
          createdBy:
            this.filter.createdBy !== 0 ? this.filter.createdBy : undefined,
          deliveryTimeOfDay:
            this.filter.deliveryTimeOfDay !== 0
              ? this.filter.deliveryTimeOfDay
              : undefined
        };
      },
      update({ ordersList }) {
        const parseDateFormat = "yyyy-LL-dd";
        let prevItem = null;

        for (let order of ordersList) {
          order.isTopLine =
            prevItem &&
            isAfter(
              parse(order.deliveryDate, parseDateFormat, new Date()),
              parse(prevItem, parseDateFormat, new Date())
            );

          prevItem = order.deliveryDate;
        }

        return ordersList;
      },
      skip() {
        return this.skipQuery;
      },
      result() {
        const loadData = this.loadingData.find(item => item.id === "orders");
        loadData.title = "Заказы получены!";
        loadData.loading = false;
      }
    },
    orderSourceTypes: {
      query: gql`
        query {
          orderSourceTypes {
            id
            name
          }
        }
      `
    },
    statusList: {
      query: gql`
        query {
          statusList: orderStatuses {
            id
            name
          }
        }
      `
    },
    usersList: {
      query: gql`
        query {
          usersList: users(
            where: { _or: [{ groupId: { _eq: 1 } }, { groupId: { _eq: 2 } }] }
          ) {
            id
            name
          }
        }
      `
    },
    clientsList: {
      query: gql`
        query ClientsList($name: String) {
          clientsList: clients(where: { name: { _ilike: $name } }, limit: 50) {
            id
            name
          }
        }
      `,
      update({ clientsList: data }) {
        this.clientSuggestions = [{ data }];

        return data;
      },
      variables() {
        return {
          name: this.clientsQueryName
        };
      },
      skip() {
        return this.skipClientsQuery;
      }
    },
    userSettings: {
      query: gql`
        query UserSettings($userId: bigint) {
          userSettings: users(where: { id: { _eq: $userId } }) {
            userSettings: settings
          }
        }
      `,
      variables() {
        return {
          userId: this.$store.getters.getAuthUser
        };
      },
      update({ userSettings: [{ userSettings: { orderSettings } = {} }] }) {
        const userSort = this.$store.getters.getOrderSort;

        this.userSettings = orderSettings || [];

        if (userSort.sortBy) {
          this.pagination.sortBy = userSort.sortBy;
          this.pagination.descending = userSort.descending;
          this.getOrdersList();
        } else if (orderSettings) {
          const colSort = this.userSettings.find(item => item.sortOrder);

          if (colSort) {
            this.pagination.sortBy = colSort.sortField;
            this.pagination.descending = colSort.sortOrder === "desc";

            const sort = {
              sortBy: this.pagination.sortBy,
              descending: this.pagination.descending
            };

            this.$store.commit("setOrderSort", sort);
          }
        }

        return orderSettings;
      }
    },
    todayDeliveriesCount: {
      query: gql`
        query TodayDeliveriesCount($currentDate: date) {
          orders_aggregate(where: { deliveryDate: { _eq: $currentDate } }) {
            aggregate {
              count
            }
          }
        }
      `,
      variables() {
        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();

        return {
          currentDate: `${year}-${month}-${date}`
        };
      },
      update({
        orders_aggregate: {
          aggregate: { count }
        }
      }) {
        return count;
      }
    }
  },
  watch: {
    dialogForm(newValue) {
      if (!newValue) {
        this.closeDialog();
      }
    },
    updateOrderList(newValue) {
      if (newValue) {
        this.$store.commit('setUpdateOrderList', false);
        this.getOrdersList(false);
      }
    },
  },
  computed: {
    updateOrderList() {
      return this.$store.getters.getUpdateOrderList;
    },
    loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    orderSourceTypeEditElem() {
      const editElem = this.ordersList.find(item => item.id === this.editedId);
      return editElem ? editElem.orderSourceType : [];
    },
    headersTable() {
      const cols = this.userSettings.map((item) => {
        const elem = {
          text: item.columnName,
          align: 'left',
          value: item.sortField,
          width: item.width,
        };

        return elem;
      });

      const colAction = {
        text: '',
        align: 'right',
        sortable: false,
        value: 'action',
      };

      cols.push(colAction);

      return cols;
    },
    printOrdersIds() {
      return this.selectedOrders.map(item => item.id);
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
    onClientSelect(item) {
      this.filter.clientItem = item;
    },
    onClientsInputChange(text) {
      this.clientsQueryName = `%${text}%`;
      this.skipClientsQuery = false;
    },
    printOrders(type) {
      const arId = this.selectedOrders.map(item => item.id);
      if (type === 'delivery') {
        this.$router.push({ name: 'ordersDelivery', params: { ids: arId } });
      } else if (type === 'florist') {
        this.$router.push({ name: 'ordersFlorist', params: { ids: arId } });
      }
    },
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
      this.page = 0;

      if (this.$route.query.client === undefined) {
        this.$store.commit('setOrderFilter', this.filter);
      }
      this.getOrdersList();
    },
    changeShowElem() {
      localStorage.setItem('countElemPage', this.take);
      this.$store.commit('setCountElemPage', this.take);
      this.page = 0;
      this.getOrdersList();
    },
    prevPage() {
      this.page -= 1;
    },
    nextPage() {
      this.page += 1;
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    getOrdersList() {
      this.$apollo.queries.ordersList.refresh();
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
    changeSettings() {
      this.editSettings = true;
      this.dialogForm = true;
    },
    createdBouquet: function createdBouquet(item) {
      let cardsList = JSON.parse(localStorage.getItem('cardsList'));
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
            salePercent: 0,
            sumDecorAdditional: 0,
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
      date.setDate(date.getDate() + 1 * diff);
      return date.toISOString().split('T')[0];
    },
    getWeekStartDate() {
      const date = new Date();
      let diff = date.getDay() - 8;
      if (diff < 0) {
        diff += 7;
      }
      date.setDate(date.getDate() + -1 * diff);
      return date.toISOString().split('T')[0];
    },
    setFilterDateNow() {
      this.filter.dateStart = this.dateNowStr;
      this.filter.dateEnd = this.dateNowStr;
      this.page = 0;
    },
    setFilterDateWeek() {
      this.filter.dateStart = this.getWeekStartDate();
      this.filter.dateEnd = this.getWeekEndDate();
      this.page = 0;
    },
    setFilterDateMonth() {
      const date = new Date();
      const firstDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        1,
        date.getUTCHours(),
      );
      const lastDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        0,
        23,
        59,
        59,
      );
      const dateStart = firstDay.toISOString().split('T')[0];
      const dateEnd = lastDay.toISOString().split('T')[0];

      this.filter.dateStart = dateStart;
      this.filter.dateEnd = dateEnd;
      this.page = 0;
    },
    setFilter14February() {
      const date = new Date();
      this.filter.dateStart = `${date.getFullYear()}-03-06`;
      this.filter.dateEnd = `${date.getFullYear()}-03-06`;
      this.page = 0;
    },
    setFilter8March() {
      const date = new Date();
      this.filter.dateStart = `${date.getFullYear()}-03-08`;
      this.filter.dateEnd = `${date.getFullYear()}-03-08`;
      this.page = 0;
    },
    setFilterNewOrderSite() {
      this.filter.dateStart = '';
      this.filter.dateEnd = '';
      this.filter.orderSourceType = 2;
      this.filter.orderStatus = 1;
      this.page = 0;
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
        descending: this.pagination.descending,
      };

      this.$store.commit("setOrderSort", sort);
    }
  },
  mounted() {
    const userFilter = this.$store.getters.getOrderFilter;

    const date = new Date();
    const dateNowStr = date.toISOString().split('T')[0];
    this.dateNowStr = dateNowStr;

    const dateStart = dateNowStr;

    date.setDate(date.getDate() + 7);
    const dateEnd = date.toISOString().split('T')[0];

    this.take = localStorage.getItem("countElemPage") || this.$store.getters.getCountElemPage;

    if (this.$route.query.client !== undefined) {
      this.filter.client = +this.$route.query.client;
    } else if (Object.keys(userFilter).length !== 0) {
      this.filter = userFilter;
    } else {
      this.filter.dateStart = dateStart;
      this.filter.dateEnd = dateEnd;
    }
  }
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
