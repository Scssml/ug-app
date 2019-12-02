<template>
  <v-card class="order">
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Заказ изменен</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4 py-2"
      >
        <span class="headline">Изменение заказа</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4 pt-1"
      >
        <v-layout
          row
          wrap
        >
          <v-flex
            :xs7="editedItem.deliveryType === 2"
            style="padding-right: 15px;"
          >
            <v-layout
              row
              wrap
            >
              <v-flex
                :xs6="editedItem.deliveryType === 2"
              >
                <v-select
                  label="КТО"
                  :items="[userInfo]"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.createdBy"
                  hide-details
                  readonly
                ></v-select>

                <v-select
                  label="Т/С"
                  :items="tsList"
                  :rules="[v => v.length > 0 || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model="editedItem.orderSourceType"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                  chips
                  multiple
                ></v-select>

                <!-- <v-text-field
                  label="Т/С другой вариант"
                  v-model="editedItem.tsText"
                  hide-details
                  class="mb-4"
                  v-if="editedItem.ts === 7"
                ></v-text-field> -->

                <v-text-field
                  label="Д/П"
                  v-model="editedItem.createdAt"
                  hide-details
                  class="mb-4"
                  readonly
                ></v-text-field>

                <v-select
                  label="Способ доставки"
                  :items="deliveryList"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.deliveryType"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                  @change="editedItem.delivery = ($event === 2)"
                ></v-select>

                <v-menu
                  :close-on-content-click="false"
                  v-model="dataPicker"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                  class="mb-2"
                  v-if="editedItem.deliveryType !== 2"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата доставки"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.deliveryDate"
                    prepend-icon="event"
                    hide-details
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="editedItem.deliveryDate"
                    @input="dataPicker = false"
                    no-title
                    scrollable
                    locale="ru-ru"
                    first-day-of-week="1"
                    :readonly="editedItemReadOnly"
                  ></v-date-picker>
                </v-menu>

                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    xs7
                  >
                    <v-text-field
                      label="Время доставки"
                      :rules="[v => !!v || 'Заполните поле']"
                      v-model="editedItem.deliveryTime"
                      hide-details
                      class="mb-4"
                      :readonly="editedItemReadOnly"
                      v-if="editedItem.deliveryType !== 2"
                    ></v-text-field>
                  </v-flex>

                  <v-flex
                    xs5
                  >
                    <v-select
                      label="Время дня"
                      :items="deliveryTimeOfDayList"
                      :rules="[v => !!v || 'Заполните поле']"
                      item-text="name"
                      item-value="id"
                      v-model.number="editedItem.deliveryTimeOfDay"
                      hide-details
                      class="mb-4"
                      :readonly="editedItemReadOnly"
                      v-if="editedItem.deliveryType !== 2"
                    ></v-select>
                  </v-flex>
                </v-layout>

                <v-select
                  label="Статус"
                  :items="statusList"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.orderStatus"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-select>

                <v-autocomplete
                  label="Клиент"
                  :items="clientsList"
                  :filter="clientsFilter"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.client"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  :readonly="editedItemReadOnly"
                  clearable
                  @change="setDataClient()"
                ></v-autocomplete>

                <v-select
                  label="Тип клиента"
                  :items="typeClient"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.clientType"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-select>

                <v-text-field
                  label="Имя"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="editedItem.clientName"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-text-field>

                <v-text-field
                  label="Телефон"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="editedItem.clientPhone"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-text-field>

                <v-text-field
                  label="Сумма"
                  v-model="editedItem.orderCost"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                  type="text"
                ></v-text-field>
              </v-flex>

              <v-flex
                xs6
                v-if="editedItem.deliveryType === 2"
                style="padding-left: 15px;"
              >
                <v-select
                  label="Курьер"
                  :items="couriersList"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.courier"
                  no-data-text="Не надено"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                  v-if="editedItem.orderStatus === 3 || editedItem.orderStatus === 6"
                ></v-select>

                <v-menu
                  :close-on-content-click="false"
                  v-model="dataPicker"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                  class="mb-2"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата доставки"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.deliveryDate"
                    prepend-icon="event"
                    hide-details
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="editedItem.deliveryDate"
                    @input="dataPicker = false"
                    @change="getOrdersList()"
                    no-title
                    scrollable
                    locale="ru-ru"
                    first-day-of-week="1"
                    :readonly="editedItemReadOnly"
                  ></v-date-picker>
                </v-menu>

                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    xs7
                  >
                    <v-text-field
                      label="Время доставки"
                      :rules="[v => !!v || 'Заполните поле']"
                      v-model="editedItem.deliveryTime"
                      hide-details
                      class="mb-4"
                      :readonly="editedItemReadOnly"
                    ></v-text-field>
                  </v-flex>

                  <v-flex
                    xs5
                  >
                    <v-select
                      label="Время дня"
                      :items="deliveryTimeOfDayList"
                      :rules="[v => !!v || 'Заполните поле']"
                      item-text="name"
                      item-value="id"
                      v-model.number="editedItem.deliveryTimeOfDay"
                      hide-details
                      class="mb-4"
                      :readonly="editedItemReadOnly"
                    ></v-select>
                  </v-flex>
                </v-layout>

                <v-checkbox
                  label="Инкогнито"
                  v-model="editedItem.incognito"
                  color="primary"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-checkbox>

                <v-checkbox
                  label="Заказчик-получатель"
                  v-model="clientAddressee"
                  color="primary"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-checkbox>

                <v-autocomplete
                  label="Получатель"
                  :items="clientsList"
                  :filter="clientsFilter"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.addressee"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  :readonly="editedItemReadOnly"
                  clearable
                  @change="setDataAddressee()"
                  v-if="!clientAddressee"
                ></v-autocomplete>

                <v-text-field
                  label="Имя получателя"
                  v-model="editedItem.addresseeName"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                  v-if="!clientAddressee"
                ></v-text-field>

                <v-text-field
                  label="Телефон получателя"
                  v-model="editedItem.addresseePhone"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                  v-if="!clientAddressee"
                ></v-text-field>

                <autocomplete-address
                  :value="editedItem.address"
                  :readonly="editedItemReadOnly"
                  @change="updateAddress($event)"
                ></autocomplete-address>

                <v-text-field
                  label="Квартира"
                  v-model="editedItem.flat"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                  :readonly="editedItemReadOnly"
                ></v-text-field>

                <v-text-field
                  label="Подъезд"
                  v-model="editedItem.entrance"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                  :readonly="editedItemReadOnly"
                ></v-text-field>

                <v-text-field
                  label="Этаж"
                  v-model="editedItem.floor"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                  :readonly="editedItemReadOnly"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <p class="mb-0">Букеты</p>
            <v-layout
              row
              wrap
              v-for="(bouquet, index) in editedItem.bouquets"
              :key="'bouquet-' + index"
              align-center
            >
              <v-flex
                xs9
                class="pr-3"
              >
                <!-- <v-text-field
                  label="Название"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="bouquet.name"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-text-field> -->

                <v-textarea
                  label="Название"
                  :rules="[v => !!v || 'Заполните поле']"
                  auto-grow
                  v-model="bouquet.name"
                  row-height="6"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-textarea>
              </v-flex>
              <v-flex
                xs2
                class="pr-3"
              >
                <v-text-field
                  label="Кол-во"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="bouquet.count"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-text-field>
              </v-flex>
              <v-flex
                xs1
              >
                <v-icon
                  @click="bouquetDelete(index)"
                >
                  delete
                </v-icon>
              </v-flex>
            </v-layout>
            <v-icon
              @click="bouquetAdd()"
            >
              add
            </v-icon>

            <v-textarea
              label="Комментарий"
              auto-grow
              v-model="editedItem.description"
              row-height="12"
              hide-details
              class="my-4"
              :readonly="editedItemReadOnly"
            ></v-textarea>
          </v-flex>

          <v-flex
            xs5
            v-if="editedItem.deliveryType === 2 && !loadOrder"
          >
            <yandex-map
              :coords="[53.05, 50.101783]"
              zoom="10"
              style="height: 100%;"
              :controls="['trafficControl']"
              :placemarks="placemarks"
            >
            </yandex-map>
          </v-flex>
          <v-flex
            xs12
            my-4
          >
            <v-btn
              @click.native="showHistory = !showHistory"
            >Показать историю</v-btn>
            <template v-if="showHistory">
              <v-data-table
                :headers="headersTableHistory"
                :items="history"
                hide-actions
                item-key="updated_at"
                :pagination.sync="pagination"
                no-data-text="Изменений не найдено"
                no-results-text="Изменений не найдено"
              >
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.updated_atStr }}</td>
                    <td>
                      <template v-if="props.item.updatedBy">
                        {{ props.item.updatedBy.name }}
                      </template>
                    </td>
                  </tr>
                </template>
                <template slot="expand" slot-scope="props">
                  <v-card flat>
                    <v-card-text>
                      <b>Активность:</b> {{ (props.item.active) ? 'Да': 'Нет' }}
                      <br><b>Адрес:</b> {{ props.item.address }}
                      <br><b>Получатель:</b> {{ props.item.addresseeId }}
                      <br><b>Имя получателя:</b> {{ props.item.addresseeName }}
                      <br><b>Телефон получателя:</b> {{ props.item.addresseePhone }}
                      <br><b>Клиент:</b> {{ props.item.clientId }}
                      <br><b>Имя клиента:</b> {{ props.item.clientName }}
                      <br><b>Телефон клиента:</b> {{ props.item.clientPhone }}
                      <br><b>Тип клиента:</b> {{ props.item.clientTypeStr }}
                      <br><b>Координаты:</b> {{ props.item.coordinates }}
                      <br><b>Курьер:</b> {{ props.item.courierStr }}
                      <br><b>Кто создал:</b> {{ props.item.createdById }}
                      <br><b>Дата создания:</b> {{ props.item.created_atStr }}
                      <br><b>Доставка:</b> {{ (props.item.delivery) ? 'Да': 'Нет' }}
                      <br><b>Дата доставки:</b> {{ props.item.deliveryDateStr }}
                      <br><b>Время доставки:</b> {{ props.item.deliveryTime }}
                      <br><b>Тип доставки:</b> {{ props.item.deliveryTypeStr }}
                      <br><b>Комментарий:</b> {{ props.item.description }}
                      <br><b>Подъезд:</b> {{ props.item.entrance }}
                      <br><b>Квартира:</b> {{ props.item.flat }}
                      <br><b>Этаж:</b> {{ props.item.floor }}
                      <br><b>№ заказа:</b> {{ props.item.id }}
                      <br><b>Инкогнито:</b> {{ (props.item.incognito) ? 'Да': 'Нет' }}
                      <br><b>Стоимость:</b> {{ props.item.orderCost }}
                      <br><b>Т/С:</b> {{ props.item.orderSourceTypesStr }}
                      <br><b>Статус:</b> {{ props.item.orderStatusStr }}
                    </v-card-text>
                  </v-card>
                </template>
              </v-data-table>
            </template>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions
        class="px-4 py-2"
      >
        <v-btn
          @click.native="cancel()"
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
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';
import AutocompleteAddress from '../../components/AutocompleteAddress.vue';

export default {
  components: {
    yandexMap,
    ymapMarker,
    AutocompleteAddress,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    editedItemReadOnly: {
      type: Boolean,
      default: false,
    },
    copy: {
      type: Boolean,
      default: false,
    },
    orderSourceType: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      clientAddressee: false,
      dataPicker: false,
      editedItem: {},
      createdSuccess: false,
      userInfo: {},
      tsList: [],
      deliveryList: [],
      statusList: [],
      clientsList: [],
      typeClient: [],
      couriersList: [],
      ordersList: [],
      history: [],
      showHistory: false,
      headersTableHistory: [
        {
          text: 'Дата',
          align: 'left',
          value: 'updated_at',
        },
        {
          text: 'Пользователь',
          align: 'left',
          value: 'user',
        },
      ],
      pagination: {
        sortBy: 'updated_at',
        descending: true,
        rowsPerPage: -1,
      },
      expand: false,
      loadOrder: true,
      deliveryTimeOfDayList: [
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
    };
  },
  computed: {
    placemarks() {
      const placemarks = [];

      this.ordersList.forEach((item) => {
        if (item.coordinates.length === 2) {
          placemarks.push({
            coords: item.coordinates,
            properties: {
              balloonContent: `${item.deliveryDate}, ${item.deliveryTime}<br>${item.address}`,
            },
            options: {},
            clusterName: '1',
          });
        }
      });

      return placemarks;
    },
  },
  methods: {
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1;
    },
    setDataClient() {
      const clientId = this.editedItem.client;
      const findClient = this.clientsList.find(item => item.id === clientId);

      if (findClient !== undefined) {
        this.editedItem.clientName = findClient.name;
        this.editedItem.clientPhone = findClient.phone;
        if (findClient.type !== undefined) {
          this.editedItem.clientType = findClient.type;
        }
      } else {
        this.editedItem.clientName = '';
        this.editedItem.clientPhone = '';
        this.editedItem.clientType = '';
      }
    },
    setDataAddressee() {
      const clientId = this.editedItem.addressee;
      const findClient = this.clientsList.find(item => item.id === clientId);

      if (findClient !== undefined) {
        this.editedItem.addresseeName = findClient.name;
        this.editedItem.addresseePhone = findClient.phone;
      } else {
        this.editedItem.addresseeName = '';
        this.editedItem.addresseePhone = '';
      }
    },
    updateAddress(data) {
      this.editedItem.address = data.address;
      this.editedItem.coordinates = data.geo;
    },
    getItem() {
      if (this.id) {
        const itemParams = {
          type: 'orders',
          id: this.id,
        };

        this.$store.dispatch('getItem', itemParams).then((response) => {
          const props = response;
          this.usersList = props.createdBy;
          // props.orderCost = +props.orderCost;

          // props.orderSourceType = [props.orderSourceType];

          let orderSourceTypeId = [];

          if (Array.isArray(this.orderSourceType)) {
            orderSourceTypeId = this.orderSourceType.map(item => item.id);
          }

          props.orderSourceType = orderSourceTypeId;

          // props.orderSourceType = (props.orderSourceType) ? +props.orderSourceType.id : 0];
          // props.orderSourceType = [(props.orderSourceType) ? +props.orderSourceType.id : 0];

          props.addressee = (props.addressee) ? +props.addressee.id : null;
          props.client = (props.client) ? +props.client.id : 0;
          props.courier = (props.courier) ? +props.courier.id : null;
          props.createdBy = (props.createdBy) ? +props.createdBy.id : 0;
          props.orderStatus = (props.orderStatus) ? +props.orderStatus.id : 0;
          props.clientType = (props.clientType) ? +props.clientType.id : 0;
          props.deliveryType = (props.deliveryType) ? +props.deliveryType.id : 0;
          props.bouquets = (props.bouquets) ? props.bouquets : [];
          props.deliveryTimeOfDay = +props.deliveryTimeOfDay;

          if (this.copy) {
            props.bouquets = props.bouquets.map((item) => {
              const elem = item;
              delete elem.id;

              return elem;
            });

            props.courier = null;
          }

          this.editedItem = props;
          this.getOrdersList();
          this.getUsersList();

          this.loadOrder = false;
        }).catch(() => {
          console.log('error');
        });
      }
    },
    getItemHistory() {
      if (this.id) {
        const itemParams = {
          type: 'orders',
          id: `${this.id}/history`,
        };

        this.$store.dispatch('getItem', itemParams).then((response) => {
          this.history = response.map((item) => {
            const elem = item;
            let date = new Date(elem.updated_at);
            elem.updated_atStr = date.toLocaleString('ru', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            });

            date = new Date(elem.created_at);
            elem.created_atStr = date.toLocaleString('ru', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            });

            date = new Date(elem.deliveryDate);
            elem.deliveryDateStr = date.toLocaleString('ru', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            const clientType = this.typeClient.find(item => item.id === +elem.clientTypeId);
            elem.clientTypeStr = (clientType) ? clientType.name : elem.clientTypeId;

            const courier = this.couriersList.find(item => item.id === +elem.courierId);
            elem.courierStr = (courier) ? courier.name : elem.courierId;

            const deliveryType = this.deliveryList.find(item => item.id === +elem.deliveryTypeId);
            elem.deliveryTypeStr = (deliveryType) ? deliveryType.name : elem.deliveryTypeId;

            const status = this.statusList.find(item => item.id === +elem.orderStatusId);
            elem.orderStatusStr = (status) ? status.name : elem.orderStatusId;

            elem.orderSourceTypesStr = elem.orderSourceTypeIds.map((itemId) => {
              const ts = this.tsList.find(item => item.id === +itemId);
              return (ts) ? ts.name : itemId;
            });

            return elem;
          });
        }).catch(() => {
          console.log('error');
        });
      }
    },
    getTsList() {
      const itemParams = {
        type: 'order-source',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.tsList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    getDeliveryList() {
      const itemParams = {
        type: 'delivery-type',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.deliveryList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
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
    getCouriersList() {
      const itemParams = {
        type: 'couriers',
        filter: {
          isActive: true,
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.couriersList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    getOrdersList: function getOrdersList() {
      const itemParams = {
        type: 'orders',
        filter: {
          deliveryDate: this.editedItem.deliveryDate,
          deliveryType: 2,
          orderStatus: [1, 2, 3],
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.ordersList = response.orders;
      }).catch(() => {
        console.log('error');
      });
    },
    getUsersList() {
      const itemParams = {
        type: 'users',
        filter: {
          id: +this.editedItem.createdBy,
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        const [user] = response;
        this.userInfo = user;
        this.userInfo.id = +this.userInfo.id;
        this.editedItem.createdBy = +this.userInfo.id;
      }).catch(() => {
        console.log('error');
      });
    },
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsItem = Object.assign({}, this.editedItem);
        delete propsItem.id;

        propsItem.delivery = false;

        const itemParams = {
          type: 'orders',

          props: propsItem,
        };

        let methods = 'updateItem';

        if (this.copy) {
          methods = 'addItem';
        } else {
          itemParams.id = this.id;
        }

        this.$store.dispatch(methods, itemParams).then(() => {
          this.createdSuccess = true;
          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        });
      }
    },
    bouquetAdd() {
      this.editedItem.bouquets.push({
        name: null,
        count: null,
      });
    },
    bouquetDelete(index) {
      this.editedItem.bouquets.splice(index, 1);
    },
  },
  mounted() {
    this.getClientsList();
    this.getTsList();
    this.getDeliveryList();
    this.getStatusList();
    this.getClientTypeList();
    this.getCouriersList();
    this.getItem();
    this.getItemHistory();
  },
};
</script>

<style lang="scss">
  .order.v-card {
    position: relative;
  }
  .order .v-card__text {
    padding-bottom: 52px;
  }
  .order .v-card__actions {
    position: fixed;
    width: 100%;
    bottom: 0;
    background: #fff;
    box-shadow: 0 0 5px;
  }
</style>
