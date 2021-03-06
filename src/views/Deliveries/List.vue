<template>
  <v-container
    fluid
    class="pa-0"
  >
    <div class="hidden-sm-and-down">
      <template>
        <v-dialog
          v-model="dialogForm"
          fullscreen
        >
          <template
            v-if="dialogForm"
          >
            <user-settings
              v-if="editSettings"
              :userSettings="userSettings"
              @cancel="closeDialog()"
            ></user-settings>
            <order-show
              v-if="showOrder"
              :order="orderSelect"
              @cancel="closeDialog()"
            ></order-show>
            <edit-bouquets
              v-if="editOrderBouquets"
              :order="orderSelect"
              @cancel="closeDialog()"
            ></edit-bouquets>
            <map-show
              v-if="showMap"
              :order="orderSelect"
              @cancel="closeDialog()"
            ></map-show>
          </template>
        </v-dialog>
        <v-card v-if="this.widthWindow >= 960">
          <v-layout
            row
            wrap
          >
            <v-flex
              xs7
            >
              <v-card-title>
                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    xs3
                    class="px-2"
                  >
                    <v-select
                      label="Курьер"
                      :items="[{id: '', name: 'Все'}].concat(couriersList)"
                      item-text="name"
                      item-value="id"
                      v-model="filter.courier"
                      hide-details
                    ></v-select>
                  </v-flex>
                  <v-flex
                    xs3
                    class="px-2"
                  >
                    <v-select
                      label="Время суток"
                      :items="[{id: '', name: 'Все'}].concat(deliveryTimeOfDayFilter)"
                      item-text="name"
                      item-value="id"
                      v-model="filter.deliveryTimeOfDay"
                      hide-details
                    ></v-select>
                  </v-flex>
                  <v-flex
                    xs3
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
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex
                    xs3
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
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-card-title>

              <v-layout
                row
                wrap
                align-center
              >
                <v-flex
                  xs12
                  class="px-1"
                >
                  Доставок: {{ ordersList.length }}

                  <v-btn
                    color="primary"
                    dark
                    @click.prevent="changeSettings()"
                  >Настройки</v-btn>
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
                item-key="id"
              >
                <template slot="headers" slot-scope="props">
                  <tr>
                    <th
                      v-for="header in props.headers"
                      class="px-1 text-xs-left"
                      :key="header.deliveryDate"
                      :class="[
                        'column sortable', pagination.descending ? 'desc' : 'asc',
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
                    :class="[props.item.orderStatus.color, (props.item.topLine) ? 'top-line' : '']"
                    @click.prevent="zoomOrderMap(props.item.coordinates)"
                  >
                    <template v-for="(col, colIndex) in colsTable">
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
                            <template v-if="
                              props.item[prop.field]
                              || prop.field === 'incognito'
                              || prop.field === 'description'
                            ">
                              <template v-if="prop.field === 'deliveryTimeOfDay'">
                                {{ deliveryTimeOfDayList[props.item[prop.field]] }}
                              </template>
                              <template v-else-if="prop.field === 'createdBy'">
                                {{ props.item[prop.field].name }}
                              </template>
                              <template v-else-if="prop.field === 'orderSourceType'">
                                <template v-for="(item, index) in props.item[prop.field]">
                                  <template v-if="item">
                                    <br :key="index" v-if="index">{{ item.name }}
                                  </template>
                                </template>
                              </template>
                              <template v-else-if="prop.field === 'incognito'">
                                {{ (props.item[prop.field]) ? 'Да' : 'Нет' }}
                              </template>
                              <template v-else-if="prop.field === 'description'">
                                <div
                                  :style="
                                    (!props.item[prop.field])
                                    ? 'min-height: 20px; box-shadow: 0 0 0 1px rgba(0,0,0,.12);'
                                    : ''
                                  "
                                >
                                  {{ props.item[prop.field] }}
                                </div>
                              </template>
                              <template v-else-if="prop.field === 'bouquets'">
                                <template v-for="(item, key) in props.item[prop.field]">
                                  {{ item.name }} - {{ item.count }}
                                  <template v-if="item.place">
                                    ({{ item.place }})
                                  </template>
                                  <br :key="key">
                                </template>
                              </template>
                              <template v-else-if="prop.field === 'orderStatus'">
                                <div style="display: inline">
                                  {{ props.item[prop.field].name }}
                                </div>
                              </template>
                              <template v-else-if="prop.field === 'deliveryType'">
                                {{ props.item[prop.field].name }}
                              </template>
                              <template v-else-if="prop.field === 'deliveryDate'">
                                {{ props.item[`${prop.field}Str`] }}
                              </template>
                              <template v-else-if="prop.field === 'courier'">
                                {{ props.item[prop.field].name }}
                              </template>
                              <template v-else-if="prop.field === 'clientType'">
                                {{ props.item[prop.field].name }}
                              </template>
                              <template v-else>
                                {{ props.item[prop.field] }}
                              </template>
                            </template>
                          </div>
                        </template>
                      </td>
                    </template>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
            <v-flex
              xs5
            >
              <div style="position: relative; height: 100%; min-height: 600px; overflow: hidden;">
                <yandex-map
                  :coords="coordsMap"
                  :zoom="zoomMap"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                  :controls="['trafficControl']"
                >
                  <template v-for="(courier, index) in couriersGpsList">
                    <ymap-marker
                      :key="`courier-${index}`"
                      :marker-id="`courier-${courier.id}`"
                      marker-type="placemark"
                      :coords="[courier.gps.y, courier.gps.x]"
                      :icon="{color: 'green', content: courier.name}"
                    ></ymap-marker>
                  </template>

                  <template v-for="(item, index) in placemarks">
                    <ymap-marker
                      :key="`order-${index}`"
                      :marker-id="`order-${item.id}`"
                      marker-type="placemark"
                      :coords="item.coords"
                      :balloon="item.balloon"
                      :icon="{color: 'blue'}"
                      :cluster-name="item.clusterName"
                    ></ymap-marker>
                  </template>
                </yandex-map>
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </template>
    </div>
    <div class="hidden-md-and-up" v-if="this.widthWindow < 960">
      <div>
        <v-btn
          exact
          @click="setFilterProp('courier', $store.getters.getAuthUser)"
          :color="(filter.courier !== '') ? 'info' : ''"
          style="min-width: 90px;"
        >
          Мои
        </v-btn>
        <v-btn
          exact
          @click="setFilterProp('courier', '')"
          :color="(filter.courier === '') ? 'info' : ''"
          style="min-width: 90px;"
        >
          Все
        </v-btn>
        <v-btn
          @click="logout()"
          exact
          style="min-width: 90px;"
        >
          Выход
        </v-btn>
      </div>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs6
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
            class="mb-1"
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
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex
          xs6
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
            class="mb-1"
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
            ></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
      <div>
        <v-btn
          exact
          @click="setFilterProp('deliveryTimeOfDay', 1)"
          :color="(filter.deliveryTimeOfDay === 1) ? 'info' : ''"
          class="px-1"
          style="min-width: 64px;"
        >
          Утро
        </v-btn>
        <v-btn
          exact
          @click="setFilterProp('deliveryTimeOfDay', 2)"
          :color="(filter.deliveryTimeOfDay === 2) ? 'info' : ''"
          class="px-1"
          style="min-width: 64px;"
        >
          День
        </v-btn>
        <v-btn
          exact
          @click="setFilterProp('deliveryTimeOfDay', 3)"
          :color="(filter.deliveryTimeOfDay === 3) ? 'info' : ''"
          class="px-1"
          style="min-width: 64px;"
        >
          Вечер
        </v-btn>
        <v-btn
          exact
          @click="setFilterProp('deliveryTimeOfDay', '')"
          :color="(filter.deliveryTimeOfDay === '') ? 'info' : ''"
          class="px-1"
          style="min-width: 64px;"
        >
          Все
        </v-btn>
      </div>
      <div>
        <v-btn
          exact
          @click="setFilterProp('deliveryType', 2)"
          :color="(filter.deliveryType === 2) ? 'info' : ''"
          class="px-1"
          style="min-width: 144px;"
        >
          Доставка
        </v-btn>
        <v-btn
          exact
          @click="setFilterProp('deliveryType', '')"
          :color="(filter.deliveryType === '') ? 'info' : ''"
          class="px-1"
          style="min-width: 144px;"
        >
          Все
        </v-btn>
      </div>
      <v-data-table
        :headers="headersTableMobile"
        :items="ordersList"
        hide-actions
        no-data-text="Заказов не найдено"
        no-results-text="Заказов не найдено"
        :pagination.sync="pagination"
        class="orders-table"
        item-key="id"
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th
              v-for="header in props.headers"
              class="px-1 text-xs-left"
              :key="header.text"
              :class="[
                'column sortable', pagination.descending ? 'desc' : 'asc',
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
            :class="[props.item.orderStatus.color, (props.item.topLine) ? 'top-line' : '']"
          >
            <td
              class="px-1"
              @click.prevent="viewOrder(props.item.id)"
            >
              {{ props.item.id }}
            </td>
            <td
              class="px-1"
              @click.prevent="viewOrder(props.item.id)"
            >
              {{ props.item.address }},
              кв. {{ props.item.flat }},
              подъезд {{ props.item.entrance }},
              этаж {{ props.item.floor }},
            </td>
            <td
              class="px-1"
              @click.prevent="viewOrder(props.item.id)"
            >
              {{ props.item.deliveryTime }}
              <br>{{ deliveryTimeOfDayList[props.item.deliveryTimeOfDay] }}
            </td>
            <td
              class="px-1"
              @click.prevent="viewOrder(props.item.id)"
            >
              <template v-for="(elem, index) in props.item.bouquets">
                <div
                  :class="elem.isReady ? 'green' : ''"
                  :key="index"
                >
                  {{ elem.name }} - {{ elem.count }}
                </div>
              </template>
            </td>
            <td
              class="px-1"
              @click.prevent="editBouquets(props.item.id)"
            >
              <template v-for="(item, key) in props.item.bouquets">
                <!-- {{ item.name }} - {{ item.count }} -->
                <template v-if="item.place">
                  ({{ item.place }})
                  <br :key="key">
                </template>
              </template>
            </td>
            <td class="px-1 text-xs-center" style="width: 40px;">
              <v-icon
                left
                @click.prevent="viewMap(props.item.id)"
                class="mr-0"
                title="Карта"
              >
                my_location
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";
import isAfter from "date-fns/isAfter";
import parse from "date-fns/parse";
import { yandexMap, ymapMarker } from 'vue-yandex-maps';
import userSettings from './userSettings.vue';
import orderShow from './showOrder.vue';
import mapShow from './showMap.vue';
import editBouquets from './editOrderBouquets.vue';

export default {
  name: 'Deliveries',
  components: {
    yandexMap,
    ymapMarker,
    userSettings,
    orderShow,
    mapShow,
    editBouquets,
  },
  data() {
    return {
      filter: {
        orderStatus: [1, 2, 3, 7],
        deliveryTimeOfDay: '',
        dateStart: null,
        dateEnd: null,
        courier: '',
        deliveryType: 2,
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
      ordersList: [],
      statusList: [],
      // clientsList: [],
      couriersList: [],
      // typeClient: [],
      dialogForm: false,
      editSettings: false,
      showOrder: false,
      dataNowStr: '',
      deliveryTimeOfDayList: {
        1: 'Утро',
        2: 'День',
        3: 'Вечер',
      },
      userSettings: [],
      pagination: {
        sortBy: "id",
        rowsPerPage: -1,
        descending: false
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
      headersTableMobile: [
        {
          text: '№',
          value: 'id',
        },
        {
          text: 'Адрес',
          value: 'address',
        },
        {
          text: 'Время',
          value: 'deliveryTime',
        },
        {
          text: 'Букеты',
          value: 'bouquets',
        },
        {
          text: 'Место',
          value: 'place',
        },
        {
          text: '',
          value: 'action',
        },
      ],
      orderSelect: {},
      coordsMap: [53.05, 50.101783],
      zoomMap: 10,
      widthWindow: 0,
      showOrderMap: false,
      showMap: false,
      editOrderBouquets: false,
      skipQuery: false,
    };
  },
  apollo: {
    couriersList: {
      query: gql`
        query  {
          couriersList: users(
            where: { groupId: { _eq: "4" } }
          ) {
            id
            name
          }
        }
      `,
    },
    statusList: {
      query: gql`
        query {
          statusList: orderStatuses {
            id
            name
          }
        }
      `,
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
    ordersList: {
      query: function() {
        return gql`
        query OrderList(
          $startDate: date
          $endDate: date
          $orderStatus: [bigint!]
          $deliveryTimeOfDay: bigint
          $courierId: bigint
          $deliveryTypeId: bigint
        ) {
          ordersList: orders(
            where: {
              _and: [
                { deliveryDate: { _gte: $startDate } }
                { deliveryDate: { _lte: $endDate } }
                { orderStatusId: { _in: $orderStatus } }
                { deliveryTimeOfDay: { _eq: $deliveryTimeOfDay } }
                { deliveryTypeId: { _eq: $deliveryTypeId } }
                { courierId: { _eq: $courierId } }
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
              bill
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
          startDate: this.filter.dateStart
            ? this.filter.dateStart
            : undefined,
          endDate: this.filter.dateEnd
            ? this.filter.dateEnd
            : undefined,
          orderStatus:
            this.filter.orderStatus ? this.filter.orderStatus : undefined,
          deliveryTimeOfDay:
            this.filter.deliveryTimeOfDay
              ? this.filter.deliveryTimeOfDay
              : undefined,
          courierId:
            this.filter.courier
              ? this.filter.courier
              : undefined,
          deliveryTypeId:
            this.filter.deliveryType
              ? this.filter.deliveryType
              : undefined,
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
      // result() {
      //   const loadData = this.loadingData.find(item => item.id === "orders");
      //   loadData.title = "Заказы получены!";
      //   loadData.loading = false;
      // }
    },
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
        this.getOrdersList();
      }
    },
  },
  computed: {
    updateOrderList() {
      return this.$store.getters.getUpdateOrderList;
    },
    couriersGpsList() {
      return this.$store.getters.getCouriersGps;
    },
    placemarks() {
      const placemarks = [];

      this.ordersList.forEach((item) => {
        if (item.coordinates && item.coordinates[0] && item.coordinates[1]) {
          placemarks.push({
            id: item.id,
            coords: item.coordinates,
            balloon: {
              header: `${item.deliveryDate},
                ${item.deliveryTime}
                (${this.deliveryTimeOfDayList[+item.deliveryTimeOfDay]})
              `,
              body: `${item.address}`,
              footer: '',
            },
            clusterName: 'orders',
          });
        }
      });

      return placemarks;
    },
    // loadingDialog() {
    //   const loadData = this.loadingData.filter(item => !item.error && !item.loading);
    //   return (loadData.length === this.loadingData.length) ? 0 : 1;
    // },
    orderSourceTypeEditElem() {
      const editElem = this.ordersList.find(item => item.id === this.editedId);
      return (editElem) ? editElem.orderSourceType : [];
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

      return cols;
    },
    colsTable() {
      const cols = this.userSettings.map((item) => {
        const elem = {
          width: item.width,
          dataFields: item.dataFields,
        };

        return elem;
      });

      return cols;
    },
  },
  methods: {
    updateWidthWindow() {
      this.widthWindow = window.innerWidth;
    },
    customFilter() {
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
          deliveryTimeOfDay: 'asc',
        },
        filter: orderFilter,
      };

      const successData = 'Заказы получены!';
      const errorData = 'Ошибка получения заказов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        let deliveryDay = '';

        this.ordersList = response.orders.map((item) => {
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
              year: 'numeric',
              // weekday: 'long',
            });
          }

          elem.deliveryTimeOfDay = +elem.deliveryTimeOfDay;

          return elem;
        });

        const { settings } = response;

        this.userSettings = (settings) || [];

        if (settings) {
          const colSort = this.userSettings.find(item => item.sortOrder);

          if (colSort) {
            this.pagination.sortBy = colSort.sortField;
            this.pagination.descending = (colSort.sortOrder === 'desc');
          }
        }

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;

        // this.getDeliveryNow();
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    // getCouriersList() {
    //   const itemParams = {
    //     type: 'users',
    //     filter: {
    //       isActive: true,
    //       group: 4,
    //     },
    //   };

    //   this.$store.dispatch('getItemsList', itemParams).then((response) => {
    //     this.couriersList = response.map((item) => {
    //       item.id = +item.id;
    //       return item;
    //     });
    //   }).catch(() => {
    //     console.log('error');
    //   });
    // },
    // getDeliveryNow() {
    //   const orderFilter = {
    //     deliveryDate: [this.dateNowStr, this.dateNowStr],
    //     deliveryType: 2,
    //   };

    //   const itemParams = {
    //     type: 'orders',
    //     sort: {
    //       deliveryDate: 'desc',
    //     },
    //     filter: orderFilter,
    //   };

    //   this.$store.dispatch('getItemsList', itemParams).then((response) => {
    //     this.deliveryNow = response.orders.length;
    //   }).catch(() => {
    //     console.log('error');
    //   });
    // },
    // getStatusList() {
    //   const itemParams = {
    //     type: 'order-status',
    //   };

    //   this.$store.dispatch('getItemsList', itemParams).then((response) => {
    //     this.statusList = response.map((item) => {
    //       item.id = +item.id;
    //       return item;
    //     });
    //   }).catch(() => {
    //     console.log('error');
    //   });
    // },
    // getClientsList() {
    //   const itemParams = {
    //     type: 'clients',
    //     filter: {
    //       active: true,
    //     },
    //   };

    //   this.$store.dispatch('getItemsList', itemParams).then((response) => {
    //     this.clientsList = response.map((item) => {
    //       item.id = +item.id;
    //       return item;
    //     });
    //   }).catch(() => {
    //     console.log('error');
    //   });
    // },
    // getClientTypeList() {
    //   const itemParams = {
    //     type: 'client-type',
    //   };

    //   this.$store.dispatch('getItemsList', itemParams).then((response) => {
    //     this.typeClient = response.map((item) => {
    //       item.id = +item.id;
    //       return item;
    //     });
    //   }).catch(() => {
    //     console.log('error');
    //   });
    // },
    closeDialog() {
      this.$apollo.queries.ordersList.refetch();
      this.dialogForm = false;
      setTimeout(() => {
        this.editSettings = false;
        this.showOrder = false;
        this.showMap = false;
        this.editOrderBouquets = false;
        this.orderSelect = {};
      }, 300);
    },
    changeSettings() {
      this.editSettings = true;
      this.dialogForm = true;
    },
    viewOrder(id) {
      this.orderSelect = this.ordersList.find(item => item.id === id);
      this.showOrder = true;
      this.dialogForm = true;
    },
    editBouquets(id) {
      this.orderSelect = this.ordersList.find(item => item.id === id);
      this.editOrderBouquets = true;
      this.dialogForm = true;
    },
    viewMap(id) {
      this.orderSelect = this.ordersList.find(item => item.id === id);
      this.showMap = true;
      this.dialogForm = true;
    },
    zoomOrderMap(coordinates) {
      if (coordinates && coordinates.length === 2) {
        this.zoomMap = 15;
        setTimeout(() => {
          this.coordsMap = coordinates;
        }, 300);
      }
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    getDeliveries() {
      const itemParams = {
        type: 'deliveries',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        console.log(response);
      });
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login');
      });
    },
    setFilterProp(code, value) {
      this.filter[code] = value;
    },
    setCoordsMap() {
      // this.coordsMap = e.get('coords');
    },
  },
  mounted() {
    window.addEventListener('resize', this.updateWidthWindow);
    this.widthWindow = window.innerWidth;

    const date = new Date();
    const dateNowStr = date.toISOString().split('T')[0];
    this.dateNowStr = dateNowStr;

    const dateStart = dateNowStr;

    // date.setDate(date.getDate() + 7);
    // const dateEnd = date.toISOString().split('T')[0];

    this.filter.dateStart = dateStart;
    this.filter.dateEnd = dateStart;

    // this.getOrdersList();
    // this.getStatusList();
    // this.getCouriersList();
    // this.getClientsList();
    // this.getClientTypeList();

    // this.getDeliveries();
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

  .orders-table .v-datatable thead th.column.sortable .v-icon {
    display: block;
    width: 16px;
  }
</style>
