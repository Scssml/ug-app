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
        >Печать бланков на доставку</v-btn>

        <v-btn
          dark
          flat
          depressed
          :to="`/print/orders/florist/${printOrdersIds}/`"
          target="_blank"
        >Печать бланков флористов</v-btn>
      </v-snackbar>
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
                v-if="!editedId && !editStatus && !editDescription && !editSettings"
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
              v-if="$store.getters.getAuthUserGroup.code === 'admin'"
            >
              <v-select
                label="Менеджер"
                :items="[{id: '', name: 'Все'}].concat(usersList)"
                item-text="name"
                item-value="id"
                v-model="filter.createdBy"
                hide-details
                @change="customFilter()"
              ></v-select>
            </v-flex>

            <v-flex
              xs2
              class="px-2"
            >
              <v-select
                label="Время суток"
                :items="[{id: '', name: 'Все'}].concat(deliveryTimeOfDayFilter)"
                item-text="name"
                item-value="id"
                v-model="filter.deliveryTimeOfDay"
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

            <v-btn
              color="primary"
              dark
              @click.prevent="changeSettings()"
            >Настройки</v-btn>
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
          select-all
          v-model="selectedOrders"
          item-key="id"
          :loading="tableLoading"
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
                style="width: 30px; max-width: 30px; min-width: 30px;"
                class="px-1"
              >
                <v-checkbox
                  v-model="props.selected"
                  color="primary"
                  hide-details
                ></v-checkbox>
              </td>
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
                        || prop.field === 'alreadyPaid'
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
                            <br :key="key">
                          </template>
                        </template>
                        <template v-else-if="prop.field === 'orderStatus'">
                          <div @click="changeStatus(props.item.id)" style="display: inline">
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
                        <template v-else-if="prop.field === 'responsible'">
                          {{ props.item[prop.field].name }}
                          <br>{{ props.item[prop.field].phone }}
                        </template>
                        <template v-else-if="prop.field === 'clientType'">
                          {{ props.item[prop.field].name }}
                        </template>
                        <template v-else-if="prop.field === 'orderCost'">
                          <div :class="(props.item.alreadyPaid) ? 'green' : ''">
                            {{ props.item[prop.field] }}
                          </div>
                        </template>
                        <template v-else-if="prop.field === 'prePayment'">
                          <div :class="(!props.item.alreadyPaid && props.item.prePayment > 0) ? 'orange' : ''">
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
              <!-- <td class="px-1">
                <b>{{ props.item.deliveryDateStr }}</b>
                <template v-if="props.item.deliveryTime">
                  <br>
                  <b>
                    {{ props.item.deliveryTime }}
                    <template v-if="props.item.deliveryTimeOfDay">
                      ({{ deliveryTimeOfDayList[props.item.deliveryTimeOfDay] }})
                    </template>
                  </b>
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
              </td> -->
              <td
                class="text-xs-right px-1"
                style="width: 100px; max-width: 100px; min-width: 100px;"
              >
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
                    :color="(props.item.isAlreadyPrinted) ? 'teal darken-3' : ''"
                  >
                    insert_drive_file
                  </v-icon>

                  <v-list>
                    <v-list-tile
                      :to="`/print/order/delivery/${props.item.id}/`"
                      v-if="props.item.deliveryType.id === 2"
                      target="_blank"
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
        <v-layout
          row
          wrap
          justify-space-around
          class="py-2"
        >
          <v-flex
            xs2
            class="px-3"
          >
            <v-text-field
              label="Количество на странице"
              v-model.number="take"
              hide-details
              @change="changeShowElem()"
            ></v-text-field>
          </v-flex>
          <v-flex
            xs10
            class="text-xs-right px-3"
          >
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
import changeAlreadyPaid from './changeAlreadyPaid.vue';
import userSettings from './userSettings.vue';

export default {
  name: 'Orders',
  components: {
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
        orderStatus: '',
        client: '',
        deliveryTimeOfDay: '',
        dateStart: null,
        dateEnd: null,
        createdBy: '',
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
      dialogForm: false,
      ordersList: [],
      statusList: [],
      clientsList: [],
      usersList: [],
      typeClient: [],
      editedId: 0,
      copyElem: false,
      editStatus: false,
      editDescription: false,
      editSettings: false,
      dataNowStr: '',
      deliveryNow: 0,
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
        rowsPerPage: -1,
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
      tsList: [],
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
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
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

      const colAction = {
        text: '',
        align: 'right',
        sortable: false,
        value: 'action',
      };

      cols.push(colAction);

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
    printOrdersIds() {
      return this.selectedOrders.map(item => item.id);
    },
  },
  methods: {
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
      this.page = 0;

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
      this.getOrdersList();
    },
    nextPage() {
      this.page += 1;
      this.getOrdersList();
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1;
    },
    getOrdersList(loading = true) {
      if (loading) {
        this.tableLoading = true;
        this.ordersList = [];
      }

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
          deliveryDate: 'asc',
          deliveryTimeOfDay: 'asc',
        },
        filter: orderFilter,
        skip: this.page * this.take,
        take: this.take,
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
              // year: 'numeric',
              weekday: 'long',
            });
          }

          if (elem.orderSourceType) {
            elem.orderSourceType = elem.orderSourceType.map((tsId) => {
              const findElem = this.tsList.find(tsElem => tsElem.id === tsId);
              return findElem;
            });
          }

          elem.deliveryTimeOfDay = +elem.deliveryTimeOfDay;

          return elem;
        });

        const { settings } = response;

        this.userSettings = (settings) ? settings : [];

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

        this.tableLoading = false;

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
        this.deliveryNow = response.orders.length;
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
    getUsersList() {
      const itemParams = {
        type: 'users',
        filter: {
          active: true,
          group: [1, 2],
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.usersList = response;
      }).catch(() => {
        console.log('error');
      });
    },
    getTsList() {
      const itemParams = {
        type: 'order-source',
      };

      this.$store
        .dispatch('getItemsList', itemParams)
        .then((response) => {
          this.tsList = response.map((item) => {
            item.id = +item.id;
            return item;
          });
        })
        .catch(() => {
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
            decorPercent: 20,
            deliveryCost: item.deliveryCost,
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
      this.page = 0;
      this.getOrdersList();
    },
    setFilterDateWeek() {
      this.filter.dateStart = this.getWeekStartDate();
      this.filter.dateEnd = this.getWeekEndDate();
      this.page = 0;
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
      this.page = 0;
      this.getOrdersList();
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
    },
  },
  mounted() {
    const date = new Date();
    const dateNowStr = date.toISOString().split('T')[0];
    this.dateNowStr = dateNowStr;

    const dateStart = dateNowStr;

    date.setDate(date.getDate() + 7);
    const dateEnd = date.toISOString().split('T')[0];

    this.take = this.$store.getters.getCountElemPage;

    if (this.$route.query.client !== undefined) {
      this.filter.client = +this.$route.query.client;
    } else {
      this.filter.dateStart = dateStart;
      this.filter.dateEnd = dateEnd;
    }

    this.getTsList();
    this.getStatusList();
    this.getClientsList();
    this.getClientTypeList();
    this.getUsersList();
    this.getOrdersList();
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
