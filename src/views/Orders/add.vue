<template>
  <v-card class="order">
    <v-alert :value="createdSuccess" type="success" class="my-0"
      >Заказ создан</v-alert
    >
    <v-form ref="form" lazy-validation>
      <v-card-title class="px-4 py-2">
        <span class="headline">Создание заказа</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-4 pt-1" @click="autocompleteClose">
        <v-layout row wrap>
          <v-flex
            :xs7="editedItem.deliveryType === 2"
            style="padding-right: 15px;"
          >
            <v-layout row wrap>
              <v-flex :xs6="editedItem.deliveryType === 2">
                <v-select
                  label="КТО"
                  :items="[userInfo]"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.createdBy"
                  hide-details
                  readonly
                  @change="handleDirty"
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
                  chips
                  multiple
                  @change="handleDirty"
                ></v-select>

                <!-- <v-text-field
                  label="Т/С другой вариант"
                  v-model="editedItem.tsText"
                  hide-details
                  class="mb-4"
                  v-if="editedItem.ts === 7"
                ></v-text-field> -->

                <!-- <v-text-field
                  label="Д/П"
                  v-model="editedItem.date"
                  hide-details
                  class="mb-4"
                  readonly
                ></v-text-field> -->

                <v-select
                  label="Способ доставки"
                  :items="deliveryList"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.deliveryType"
                  hide-details
                  class="mb-4"
                  @change="
                    editedItem.delivery = $event === 2;
                    handleDirty();
                  "
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
                  @change="handleDirty"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата доставки"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.deliveryDate"
                    prepend-icon="event"
                    hide-details
                    readonly
                    @change="handleDirty"
                  ></v-text-field>
                  <v-date-picker
                    v-model="editedItem.deliveryDate"
                    @input="dataPicker = false"
                    no-title
                    scrollable
                    locale="ru-ru"
                    first-day-of-week="1"
                    @change="handleDirty"
                  ></v-date-picker>
                </v-menu>

                <v-layout row wrap>
                  <v-flex xs7>
                    <v-text-field
                      label="Время доставки"
                      :rules="[v => !!v || 'Заполните поле']"
                      v-model="editedItem.deliveryTime"
                      hide-details
                      class="mb-4"
                      v-if="editedItem.deliveryType !== 2"
                      @change="handleDirty"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs5>
                    <v-select
                      label="Время суток"
                      :items="deliveryTimeOfDayList"
                      :rules="[v => !!v || 'Заполните поле']"
                      item-text="name"
                      item-value="id"
                      v-model.number="editedItem.deliveryTimeOfDay"
                      hide-details
                      class="mb-4"
                      v-if="editedItem.deliveryType !== 2"
                      @change="handleDirty"
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
                  @change="handleDirty"
                ></v-select>

                <v-autocomplete
                  ref="clientSelect"
                  label="Клиент"
                  :items="clientsList"
                  :filter="clientsFilter"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.client"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  clearable
                  @change="
                  handleDirty();
                    setDataClient();

                  "
                  :search-input.sync="clientName"
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
                  @change="handleDirty"
                ></v-select>

                <v-text-field
                  label="Имя"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="editedItem.clientName"
                  hide-details
                  class="mb-4"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Телефон"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="editedItem.clientPhone"
                  hide-details
                  class="mb-4"
                  @change="handleDirty"
                ></v-text-field>

                <v-autocomplete
                  label="Ответственный"
                  ref="responsibleSelect"
                  :items="responsibleList"
                  :filter="clientsFilter"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.responsible"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  clearable
                  @change="
                    setDataResponsible();
                    handleDirty();
                  "
                  v-if="editedItem.clientType === 2"
                ></v-autocomplete>

                <v-select
                  label="Тип клиента"
                  :items="typeClient"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="responsible.type"
                  hide-details
                  class="mb-4"
                  readonly
                  v-if="!!responsible"
                  @change="handleDirty"
                ></v-select>

                <v-text-field
                  label="Имя"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="responsible.name"
                  hide-details
                  class="mb-4"
                  readonly
                  v-if="!!responsible"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Телефон"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="responsible.phone"
                  hide-details
                  class="mb-4"
                  readonly
                  v-if="!!responsible"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Сумма"
                  v-model="editedItem.orderCost"
                  hide-details
                  placeholder="0"
                  class="mb-4"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Стоимость доствки"
                  v-model="editedItem.deliveryCost"
                  hide-details
                  placeholder="0"
                  class="mb-4"
                  v-if="editedItem.deliveryType !== 1"
                  @change="handleDirty"
                />

                <v-text-field
                  label="Предоплата"
                  v-model.number="editedItem.prePayment"
                  hide-details
                  class="mb-4"
                  type="text"
                  @change="handleDirty"
                />

                <v-select
                  label="Канал поступления предоплаты"
                  :items="paymentTypesList"
                  class="mb-4"
                  v-model="editedItem.prePaymentSource"
                  item-value="id"
                  item-text="name"
                  :rules="[
                    v =>
                      (!!editedItem.prePayment || editedItem.alreadyPaid) && !v
                        ? 'Заполните поле'
                        : false
                  ]"
                  @change="
                    handlePrePaymentSource;
                    handleDirty();
                  "
                />

                <v-checkbox
                  label="Оплачен"
                  v-model="editedItem.alreadyPaid"
                  color="primary"
                  hide-details
                  class="mb-4"
                  @change="handleDirty()"
                ></v-checkbox>
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
                  v-if="editedItem.orderStatus === 3"
                  @change="handleDirty"
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
                    @change="handleDirty"
                  ></v-text-field>
                  <v-date-picker
                    v-model="editedItem.deliveryDate"
                    @input="dataPicker = false"
                    @change="
                      skipQuery = false;
                      handleDirty();
                    "
                    no-title
                    scrollable
                    locale="ru-ru"
                    first-day-of-week="1"
                  ></v-date-picker>
                </v-menu>

                <v-layout row wrap>
                  <v-flex xs7>
                    <v-text-field
                      label="Время доставки"
                      :rules="[v => !!v || 'Заполните поле']"
                      v-model="editedItem.deliveryTime"
                      hide-details
                      class="mb-4"
                      @change="handleDirty"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs5>
                    <v-select
                      label="Время суток"
                      :items="deliveryTimeOfDayList"
                      :rules="[v => !!v || 'Заполните поле']"
                      item-text="name"
                      item-value="id"
                      v-model.number="editedItem.deliveryTimeOfDay"
                      @change="
                        handleDirty();
                      "
                      hide-details
                      class="mb-4"
                    ></v-select>
                  </v-flex>
                </v-layout>

                <v-checkbox
                  label="Инкогнито"
                  v-model="editedItem.incognito"
                  color="primary"
                  hide-details
                  class="mb-4"
                ></v-checkbox>

                <v-checkbox
                  label="Заказчик-получатель"
                  v-model="editedItem.isCustomerRecipient"
                  color="primary"
                  hide-details
                  class="mb-4"
                ></v-checkbox>

                <v-autocomplete
                  ref="addresseeSelect"
                  label="Получатель"
                  :items="clientsList"
                  :filter="clientsFilter"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.addressee"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  clearable
                  @change="
                    setDataAddressee();
                    handleDirty();
                  "
                  v-if="!editedItem.isCustomerRecipient"
                  :search-input.sync="addresseeName"
                ></v-autocomplete>

                <v-text-field
                  label="Имя получателя"
                  v-model="editedItem.addresseeName"
                  hide-details
                  class="mb-4"
                  v-if="!editedItem.isCustomerRecipient"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Телефон получателя"
                  v-model="editedItem.addresseePhone"
                  hide-details
                  class="mb-4"
                  v-if="!editedItem.isCustomerRecipient"
                  @change="handleDirty"
                ></v-text-field>

                <autocomplete-address
                  :value="editedItem.address"
                  @change="
                    updateAddress($event);
                    handleDirty();
                  "
                  :readonly="false"
                ></autocomplete-address>

                <v-text-field
                  label="Квартира"
                  v-model="editedItem.flat"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Подъезд"
                  v-model="editedItem.entrance"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Этаж"
                  v-model="editedItem.floor"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                  @change="handleDirty"
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
              <v-flex xs9 class="pr-3">
                <!-- <v-text-field
                  label="Название"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="bouquet.name"
                  hide-details
                  class="mb-4"
                ></v-text-field> -->

                <v-textarea
                  label="Название"
                  :rules="[v => !!v || 'Заполните поле']"
                  auto-grow
                  v-model="bouquet.name"
                  row-height="6"
                  hide-details
                  class="mb-4"
                  @change="handleDirty"
                ></v-textarea>
              </v-flex>
              <v-flex xs2 class="pr-3">
                <v-text-field
                  label="Кол-во"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model.number="bouquet.count"
                  hide-details
                  class="mb-4"
                  @change="handleDirty; checkNumber(index)"
                ></v-text-field>
              </v-flex>
              <v-flex xs2 class="pr-3">
                <v-text-field
                  label="Место"
                  hide-details
                  class="mb-4"
                  v-model="bouquet.place"
                  @change="handleDirty"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-icon @click="bouquetDelete(index)">
                  delete
                </v-icon>
              </v-flex>
            </v-layout>
            <v-icon @click="bouquetAdd()">
              add
            </v-icon>

            <v-textarea
              label="Комментарий"
              auto-grow
              v-model="editedItem.description"
              row-height="12"
              hide-details
              class="my-4"
              @change="handleDirty"
            ></v-textarea>
          </v-flex>

          <v-flex xs5 v-if="editedItem.deliveryType === 2">
            <div style="position: relative; height: 100%; overflow: hidden;">
              <delivery-map
                :delivery-time-of-day-list="this.deliveryTimeOfDayList"
                :edited-item="editedItem"
                :zones="deliveryZones"
                :placemarks="placemarks"
              />
            </div>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions class="px-4 py-2">
        <v-btn @click.native="cancel()">Отмена</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="submitForm">Сохранить</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import { yandexMap, ymapMarker } from "vue-yandex-maps";
import AutocompleteAddress from "../../components/AutocompleteAddressYandex.vue";
import inside from "point-in-geopolygon";
import DeliveryMap from "./deliveryMap.vue";
import { getDistance } from "geolib";
import geocoder from "geocoder";
import { PaymentTypes } from "../../constants";

const baseCoordinates = [53.186104, 50.1602];
const unSaveChangesText =
  "На форме есть несохраненные данные. Вы уверены, что хотите закрыть форму?";

export default {
  components: {
    yandexMap,
    ymapMarker,
    AutocompleteAddress,
    DeliveryMap,
  },
  data() {
    return {
      // clientAddressee: false,
      dataPicker: false,
      paymentTypesList: [],
      editedItem: {
        id: -1,
        isCustomerRecipient: false,
        client: 0,
        clientName: '',
        clientPhone: '',
        courier: null,
        delivery: false,
        deliveryDate: '',
        deliveryTime: '',
        deliveryTimeOfDay: null,
        createdBy: 0,
        orderSourceType: [],
        description: '',
        orderCost: '',
        addressee: null,
        addresseeName: '',
        addresseePhone: '',
        address: '',
        entrance: '',
        flat: '',
        floor: '',
        orderStatus: 1,
        clientType: 1,
        deliveryType: 1,
        deliveryCost: 0,
        incognito: false,
        coordsMap: [53.05, 50.101783],
        coordinates: [],
        bouquets: [
          {
            count: null,
            name: null,
            place: "",
            isReady: false
          }
        ],
        responsible: null,
        prePaymentSource: null,
        prePayment: 0
      },
      createdSuccess: false,
      userInfo: {},
      tsList: [],
      deliveryList: [],
      statusList: [],
      clientsList: [],
      typeClient: [],
      couriersList: [],
      ordersList: [],
      deliveryTimeOfDayList: [
        {
          name: "Утро",
          id: 1
        },
        {
          name: "День",
          id: 2
        },
        {
          name: "Вечер",
          id: 3
        }
      ],
      coordsMap: [53.05, 50.101783],
      responsible: undefined,
      clientName: "",
      addresseeName: "",
      isDirty: false,
      skipQuery: true,
    };
  },
  apollo: {
    clients: {
      query: gql`
        query clients(
          $limit: Int
          $offset: Int
          $orderBy: [clients_order_by!]
        ) {
          clients: clients(
            where: {
              deleted_at: { _is_null: true }
            }
          ) {
            id
            name
            phone
            typeId
            address
            entrance
            flat
            floor
          }
        }
      `,
      update({ clients }) {
        // this.clientsList = this.clientsList.concat(clients);
        const findIndex = clients.findIndex(item => item.id === 0);
        clients.splice(findIndex, 1);
        this.clientsList = clients;
      },
    },
    typeClient: {
      query: gql`
        query {
          typeClient: clientTypes {
            id
            name
          }
        }
      `
    },
    tsList: {
      query: gql`
        query {
          tsList: orderSourceTypes {
            id
            name
          }
        }
      `
    },
    deliveryList: {
      query: gql`
        query {
          deliveryList: deliveryTypes {
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
        query usersList(
          $id: bigint
        ) {
          usersList: users(
            where: { id: { _eq: $id } }
          ) {
            id
            name
          }
        }
      `,
      variables() {
        return {
          id: this.$store.getters.getAuthUser,
        };
      },
      update({ usersList }) {
        this.userInfo = usersList.shift();
        this.editedItem.createdBy = this.$store.getters.getAuthUser
      },
    },
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
    paymentTypesList: {
      query: gql`
        query {
          paymentTypesList: paymentTypes {
            id
            name
          }
        }
      `
    },
    ordersList: {
      query: gql`
        query ordersList(
          $date: date,
          $deliveryTimeOfDay: bigint
        ) {
          ordersList: orders(
            where: {
              deliveryTypeId: { _eq: "2" },
              orderStatusId: { _in: [1, 2, 3] },
              deliveryTimeOfDay: { _eq: $deliveryTimeOfDay },
              deliveryDate: { _eq: $date }
            }
          ) {
            id
            coordinates
          }
        }
      `,
      variables() {
        return {
          date: this.editedItem.deliveryDate,
          deliveryTimeOfDay: (this.editedItem.deliveryTimeOfDay)
            ? this.editedItem.deliveryTimeOfDay
            : undefined,
        };
      },
      skip() {
        return this.skipQuery;
      },
    },
  },
  watch: {
    clientName(val) {
      const clientId = this.editedItem.client;
      // if (clientId === undefined || (!Number.isNaN(+val) && val)) {
      if (clientId === undefined && val) {
        this.editedItem.clientPhone = val;
      }
    },
    addresseeName(val) {
      const addresseeId = this.editedItem.addressee;
      if (addresseeId === undefined && val) {
        this.editedItem.addresseePhone = val;
      }
    }
  },
  computed: {
    deliveryZones() {
      return this.$store.state.deliveryZones;
    },
    responsibleList() {
      return this.clientsList.filter(
        item => +item.referenceId === +this.editedItem.client
      );
    },
    placemarks() {
      return this.ordersList
        .filter(item => item.coordinates && item.coordinates.length === 2)
        .map(order => ({
          id: order.id,
          coordinates: order.coordinates,
        }));
    },
  },
  methods: {
    handleBeforeUnload(e) {
      if (this.isDirty) {
        e.returnValue = unSaveChangesText;
      }
    },
    checkNumber(index) {
      let val = this.editedItem.bouquets[index].count;
      val = (!isNaN(val)) ? +val : 0;
      this.editedItem.bouquets[index].count = val;
    },
    handleDirty() {
      if (!this.isDirty) {
        this.isDirty = true;
      }
    },
    handlePrePaymentSource(id) {
      this.editedItem.prePaymentSource = id;
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    setDataClient() {
      const clientId = this.editedItem.client;
      const findClient = this.clientsList.find(item => item.id === clientId);

      if (findClient !== undefined) {
        this.editedItem.clientName = findClient.name;
        this.editedItem.clientPhone = findClient.phone;
        if (findClient.type !== undefined) {
          this.editedItem.clientType = findClient.typeId;
        }

        this.editedItem.address = findClient.address;
        this.editedItem.entrance = findClient.entrance;
        this.editedItem.flat = findClient.flat;
        this.editedItem.floor = findClient.floor;

        findClient.address && this.setPointByClientAddress(findClient.address);
      } else {
        this.editedItem.clientName = '';
        this.editedItem.clientPhone = '';
        this.editedItem.clientType = '';
        this.editedItem.address = '';
        this.editedItem.entrance = '';
        this.editedItem.flat = '';
        this.editedItem.floor = '';
      }
    },
    setDataAddressee() {
      const clientId = this.editedItem.addressee;
      const findClient = this.clientsList.find(item => item.id === clientId);

      if (findClient) {
        this.editedItem.addresseeName = findClient.name;
        this.editedItem.addresseePhone = findClient.phone;
        this.editedItem.address = findClient.address;
        this.editedItem.entrance = findClient.entrance;
        this.editedItem.flat = findClient.flat;
        this.editedItem.floor = findClient.floor;

        findClient.address && this.setPointByClientAddress(findClient.address);
      } else {
        this.editedItem.addresseeName = '';
        this.editedItem.addresseePhone = '';
        this.editedItem.address = '';
        this.editedItem.entrance = '';
        this.editedItem.flat = '';
        this.editedItem.floor = '';
      }
    },
    setPointByClientAddress(address) {
      geocoder.geocode(
        address,
        (
          _,
          {
            results: [
              { geometry: { location: { lat, lng } = {} } = {} } = {}
            ] = []
          } = {}
        ) => {
          this.updateAddress({
            geo: [lat, lng],
            address
          });
        },
        { language: "ru", key: window.GOOGLE_API_KEY }
      );
    },
    setDataResponsible() {
      const clientId = this.editedItem.responsible;
      const findClient = this.clientsList.find(item => item.id === clientId);

      this.responsible = findClient;
    },
    updateAddress(data) {
      this.editedItem.address = data.address;

      if (data && data.geo[0] && data.geo[1]  && this.editedItem) {
        this.editedItem.coordinates = data.geo;
        this.editedItem.coordsMap = data.geo;
        this.calculateAndSetDeliveryCost(data.geo);
      }
    },
    calculateAndSetDeliveryCost(geo) {
      for (const zone of this.deliveryZones) {
        if (inside.polygon(zone.coordinates, geo)) {
          this.editedItem.deliveryCost = zone.priceForKm
            ? (getDistance(
              { longitude: geo[0], latitude: geo[1] },
              { longitude: baseCoordinates[0], latitude: baseCoordinates[1] },
              1000,
            ) *
                zone.priceForKm) /
              1000
            : zone.price;
          break;
        }
      }
    },
    // getPaymentTypesList() {
    //   const itemParams = {
    //     type: 'paymentTypes',
    //     filter: {
    //       isActive: true,
    //     },
    //   };

    //   this.$store
    //     .dispatch("getItemsList", itemParams)
    //     .then(response => {
    //       this.paymentTypesList = response.filter(
    //         pt => pt.id !== PaymentTypes.BALANCE
    //       );
    //     })
    //     .catch(() => {
    //       console.log('error');
    //     });
    // },
    // getUsersList() {
    //   const itemParams = {
    //     type: 'login',
    //   };

    //   this.$store
    //     .dispatch('getItemsList', itemParams)
    //     .then((response) => {
    //       this.userInfo = response;
    //       this.userInfo.id = +this.userInfo.id;
    //       this.editedItem.createdBy = +this.userInfo.id;
    //     })
    //     .catch(() => {
    //       console.log('error');
    //     });
    // },
    // getTsList() {
    //   const itemParams = {
    //     type: 'order-source',
    //   };

    //   this.$store
    //     .dispatch('getItemsList', itemParams)
    //     .then((response) => {
    //       this.tsList = response.map((item) => {
    //         item.id = +item.id;
    //         return item;
    //       });
    //     })
    //     .catch(() => {
    //       console.log('error');
    //     });
    // },
    // getDeliveryList() {
    //   const itemParams = {
    //     type: 'delivery-type',
    //   };

    //   this.$store
    //     .dispatch('getItemsList', itemParams)
    //     .then((response) => {
    //       this.deliveryList = response.map((item) => {
    //         item.id = +item.id;
    //         return item;
    //       });
    //     })
    //     .catch(() => {
    //       console.log('error');
    //     });
    // },
    // getStatusList() {
    //   const itemParams = {
    //     type: 'order-status',
    //   };

    //   this.$store
    //     .dispatch('getItemsList', itemParams)
    //     .then((response) => {
    //       this.statusList = response.map((item) => {
    //         item.id = +item.id;
    //         return item;
    //       });
    //     })
    //     .catch(() => {
    //       console.log('error');
    //     });
    // },
    // getClientsList() {
    //   const itemParams = {
    //     type: 'clients',
    //     filter: {
    //       isActive: true,
    //     },
    //   };

    //   this.$store
    //     .dispatch("getItemsList", itemParams)
    //     .then(response => {
    //       this.clientsList = response
    //         .map(item => {
    //           item.id = +item.id;
    //           return item;
    //         })
    //         .filter(i => i.id !== 0);
    //     })
    //     .catch(() => {
    //       console.log('error');
    //     });
    // },
    // getClientTypeList() {
    //   const itemParams = {
    //     type: 'client-type',
    //   };

    //   this.$store
    //     .dispatch('getItemsList', itemParams)
    //     .then((response) => {
    //       this.typeClient = response.map((item) => {
    //         item.id = +item.id;
    //         return item;
    //       });
    //     })
    //     .catch(() => {
    //       console.log('error');
    //     });
    // },
    // getCouriersList() {
    //   const itemParams = {
    //     type: 'users',
    //     filter: {
    //       isActive: true,
    //       group: 4,
    //     },
    //   };

    //   this.$store
    //     .dispatch('getItemsList', itemParams)
    //     .then((response) => {
    //       this.couriersList = response.map((item) => {
    //         item.id = +item.id;
    //         return item;
    //       });
    //     })
    //     .catch(() => {
    //       console.log('error');
    //     });
    // },
    // getOrdersList: function getOrdersList() {
    //   const itemParams = {
    //     type: 'orders',
    //     filter: {
    //       deliveryDate: this.editedItem.deliveryDate,
    //       deliveryTimeOfDay: this.editedItem.deliveryTimeOfDay,
    //       deliveryType: 2,
    //       status: [1, 2, 3],
    //     },
    //   };

    //   Object.keys(itemParams.filter).forEach(key => itemParams.filter[key] == null && delete itemParams.filter[key]);

    //   this.$store
    //     .dispatch('getItemsList', itemParams)
    //     .then((response) => {
    //       this.ordersList = response.orders;
    //     })
    //     .catch(() => {
    //       console.log('error');
    //     });
    // },
    cancel() {
      if (this.isDirty) {
        const exitConfirmation = confirm(unSaveChangesText);

        if (!exitConfirmation) {
          return;
        }
      }

      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        if (this.editedItem.client) {
          this.addOrder();
        } else {
          this.addClient();
        }
      }
    },
    addOrder() {
      const propsItem = Object.assign({}, this.editedItem);
      delete propsItem.id;

      propsItem.delivery = false;

      if (propsItem.deliveryType === 1) {
        propsItem.address = "";
        propsItem.entrance = "";
        propsItem.flat = "";
        propsItem.floor = "";
      }

      if (!propsItem.coordinates) {
        propsItem.coordinates = [];
      }

      if (!propsItem.description) {
        propsItem.description = "";
      }

      const itemParams = {
        type: "orders",
        props: propsItem
      };

      this.$store.dispatch("addItem", itemParams).then(() => {
        this.createdSuccess = true;
        setTimeout(() => {
          this.$emit("cancel");
        }, 1000);
      });
    },
    addClient() {
      const itemParams = {
        type: "clients",
        props: {
          name: this.editedItem.clientName,
          birthDay: "1900-01-01",
          bill: 0,
          sale: 0,
          phone: this.editedItem.clientPhone,
          isActive: true,
          type: this.editedItem.clientType,
          address: this.editedItem.address,
          entrance: this.editedItem.entrance,
          flat: this.editedItem.flat,
          floor: this.editedItem.floor
        }
      };

      this.$store.dispatch('addItem', itemParams).then((client) => {
        this.editedItem.client = client.id;
        this.addOrder();
      });
    },
    bouquetAdd() {
      this.editedItem.bouquets.push({
        name: null,
        count: null,
        place: "",
        isReady: false
      });
    },
    bouquetDelete(index) {
      this.editedItem.bouquets.splice(index, 1);
    },
    autocompleteClose(e) {
      const selects = document.querySelectorAll('.v-autocomplete');
      const { target } = e;
      let isFind = false;

      for (let i = 0; i < selects.length; i += 1) {
        if (target === selects[i] || selects[i].contains(target)) {
          isFind = true;
        }
      }

      if (!isFind) {
        this.$refs.clientSelect.blur();
        if (this.$refs.responsibleSelect) {
          this.$refs.responsibleSelect.blur();
        }
        if (this.$refs.addresseeSelect) {
          this.$refs.addresseeSelect.blur();
        }
      }
    },
  },
  created() {
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },
  mounted() {
    // this.getUsersList();
    // this.getTsList();
    // this.getDeliveryList();
    // this.getStatusList();
    // this.getCouriersList();
    // this.getPaymentTypesList();
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
