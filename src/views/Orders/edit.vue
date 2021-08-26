<template>
  <v-card class="order">
    <v-alert :value="createdSuccess" type="success" class="my-0"
      >Заказ изменен</v-alert
    >
    <v-form ref="form" lazy-validation>
      <v-card-title class="px-4 py-2">
        <span class="headline">Изменение заказа</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-4 pt-1" @click="autocompleteClose">
        <v-layout row wrap>
          <v-flex
            :xs7="editedItem.delivery_type === 'delivery'"
            style="padding-right: 15px;"
          >
            <v-layout row wrap>
              <v-flex :xs6="editedItem.delivery_type === 'delivery'">
                <v-select
                  label="Т/С"
                  :items="tsList"
                  :rules="[v => v.length > 0 || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model="editedItem.order_source_type"
                  hide-details
                  class="mb-4"
                  chips
                  multiple
                  @change="handleDirty"
                ></v-select>

                <v-select
                  label="Способ доставки"
                  :items="deliveryList"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model="editedItem.delivery_type"
                  hide-details
                  class="mb-4"
                  @change="handleDirty();"
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
                  v-if="editedItem.delivery_type !== 'delivery'"
                  @change="handleDirty"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата доставки"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.date"
                    prepend-icon="event"
                    hide-details
                    readonly
                    @change="handleDirty"
                  ></v-text-field>
                  <v-date-picker
                    v-model="editedItem.date"
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
                      v-model="editedItem.delivery_time"
                      hide-details
                      class="mb-4"
                      v-if="editedItem.delivery_type !== 'delivery'"
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
                      v-model="editedItem.times_of_day"
                      hide-details
                      class="mb-4"
                      v-if="editedItem.delivery_type !== 'delivery'"
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
                  v-model="editedItem.order_status"
                  hide-details
                  class="mb-4"
                  @change="handleDirty"
                ></v-select>

                <v-autocomplete
                  ref="clientSelect"
                  label="Клиент"
                  :items="clientsList"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.client_id"
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
                  v-model="editedItem.client_type"
                  hide-details
                  class="mb-4"
                  @change="handleDirty"
                ></v-select>

                <v-text-field
                  label="Имя"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="editedItem.client_name"
                  hide-details
                  class="mb-4"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Телефон"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="editedItem.client_phone"
                  hide-details
                  class="mb-4"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Сумма"
                  v-model.number="editedItem.cost"
                  hide-details
                  placeholder="0"
                  class="mb-4"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Стоимость доствки"
                  v-model.number="editedItem.delivery_cost"
                  hide-details
                  placeholder="0"
                  class="mb-4"
                  v-if="editedItem.delivery_type !== 'pickup'"
                  @change="handleDirty"
                />

                <v-text-field
                  label="Предоплата"
                  v-model.number="editedItem.pre_payment"
                  hide-details
                  class="mb-4"
                  type="text"
                  @change="handleDirty"
                />

                <v-select
                  label="Канал поступления предоплаты"
                  :items="paymentTypesList"
                  class="mb-4"
                  v-model="editedItem.pay_channel"
                  item-value="id"
                  item-text="name"
                  :rules="[
                    v =>
                      (!!editedItem.pre_payment || editedItem.already_paid) && !v
                        ? 'Заполните поле'
                        : false
                  ]"
                  @change="handleDirty();"
                />

                <v-checkbox
                  label="Оплачен"
                  v-model="editedItem.already_paid"
                  color="primary"
                  hide-details
                  class="mb-4"
                  @change="handleDirty()"
                ></v-checkbox>
              </v-flex>

              <v-flex
                xs6
                v-if="editedItem.delivery_type === 'delivery'"
                style="padding-left: 15px;"
              >
                <!-- <v-select
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
                ></v-select> -->

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
                    v-model="editedItem.date"
                    prepend-icon="event"
                    hide-details
                    readonly
                    @change="handleDirty"
                  ></v-text-field>
                  <v-date-picker
                    v-model="editedItem.date"
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
                      v-model="editedItem.delivery_time"
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
                      v-model="editedItem.times_of_day"
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
                  v-model="editedItem.is_recipient_client"
                  color="primary"
                  hide-details
                  class="mb-4"
                ></v-checkbox>

                <v-autocomplete
                  ref="addresseeSelect"
                  label="Получатель"
                  :items="clientsList"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.recipient_id"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  clearable
                  @change="
                    setDataAddressee();
                    handleDirty();
                  "
                  v-if="!editedItem.is_recipient_client"
                  :search-input.sync="addresseeName"
                ></v-autocomplete>

                <v-text-field
                  label="Имя получателя"
                  v-model="editedItem.recipient_name"
                  hide-details
                  class="mb-4"
                  v-if="!editedItem.is_recipient_client"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Телефон получателя"
                  v-model="editedItem.recipient_phone"
                  hide-details
                  class="mb-4"
                  v-if="!editedItem.is_recipient_client"
                  @change="handleDirty"
                ></v-text-field>

                <autocomplete-address
                  :value="editedItem.recipient_address"
                  @change="
                    updateAddress($event);
                    handleDirty();
                  "
                  :readonly="false"
                ></autocomplete-address>

                <v-text-field
                  label="Квартира"
                  v-model="editedItem.recipient_flat_number"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                  @change="handleDirty"
                ></v-text-field>

                <v-text-field
                  label="Этаж"
                  v-model="editedItem.recipient_floor"
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
              <v-flex xs7 class="pr-3">
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
              v-model="editedItem.comment"
              row-height="12"
              hide-details
              class="my-4"
              @change="handleDirty"
            ></v-textarea>
          </v-flex>

          <v-flex xs5 v-if="editedItem.delivery_type === 'delivery'">
            <div style="position: relative; height: 100%; overflow: hidden;">
              <!-- <delivery-map
                :delivery-time-of-day-list="this.deliveryTimeOfDayList"
                :edited-item="editedItem"
                :zones="deliveryZones"
                :placemarks="placemarks"
              /> -->
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
import axios from 'axios';
import { yandexMap, ymapMarker } from 'vue-yandex-maps';
import AutocompleteAddress from '../../components/AutocompleteAddressYandex.vue';
import inside from 'point-in-geopolygon';
import DeliveryMap from './deliveryMap.vue';
import { getDistance } from 'geolib';
import geocoder from 'geocoder';

const baseCoordinates = [53.186104, 50.1602];
const unSaveChangesText =
  'На форме есть несохраненные данные. Вы уверены, что хотите закрыть форму?';

export default {
  components: {
    yandexMap,
    ymapMarker,
    AutocompleteAddress,
    DeliveryMap,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editedItem: {
        already_paid: false,
        bouquets: [],
        client_id: 0,
        client_name: '',
        client_phone: '',
        client_type: '',
        comment: '',
        cost: 0,
        date: '',
        delivery_cost: 0,
        delivery_time: '',
        delivery_type: 'pickup',
        incognito: false,
        is_recipient_client: false,
        order_source_type: '',
        order_status: 'accept',
        pay_channel: '',
        pre_payment: 0,
        recipient_address: '',
        recipient_client_type: 'individual',
        recipient_flat_number: 0,
        recipient_floor: 0,
        recipient_id: 0,
        recipient_name: '',
        recipient_phone: '',
        times_of_day: '',
      },
      paymentTypesList: [
        {
          id: 'Комиссия',
          name: 'Комиссия',
        },
        {
          id: 'cashless',
          name: 'Газпром',
        },
        {
          id: 'cashless',
          name: 'Тинькофф',
        },
        {
          id: 'terminal',
          name: 'Терминал юг-2',
        },
        {
          id: 'Расходы',
          name: 'Расходы',
        },
        {
          id: 'Инкассация',
          name: 'Инкассация',
        },
        {
          id: 'return',
          name: 'Возврат',
        },
        {
          id: 'cashless',
          name: 'Безнал',
        },
        {
          id: 'terminal',
          name: 'Терминал',
        },
        {
          id: 'cart',
          name: 'Карта',
        },
        {
          id: 'yandex',
          name: 'Яндекс',
        },
        {
          id: 'cash',
          name: 'Наличные',
        },
      ],
      tsList: [
        {
          id: 'phone',
          name: 'Телефон',
        },
        {
          id: 'site',
          name: 'Сайт',
        },
        {
          id: 'chat',
          name: 'Чаты',
        },
        {
          id: 'myself',
          name: 'Сам',
        },
        {
          id: 'viber',
          name: 'Вайбер',
        },
        {
          id: 'whatsApp',
          name: 'Whatsapp',
        },
        {
          id: 'Инстаграм',
          name: 'Инстаграм',
        },
        {
          id: 'Другое',
          name: 'Другое',
        },
      ],
      deliveryList: [
        {
          id: 'pickup',
          name: 'Самовывоз',
        },
        {
          id: 'delivery',
          name: 'Доставка',
        },
      ],
      statusList: [
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
      typeClient: [
        {
          id: 'individual',
          name: 'Физ. лицо',
        },
        {
          id: 'legal',
          name: 'Юр. лицо',
        },
        {
          id: 'counter_party',
          name: 'Контрагент',
        },
        {
          id: 'our',
          name: 'Наш',
        },
      ],
      deliveryTimeOfDayList: [
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
      couriersList: [],
      clientsList: [],

      createdSuccess: false,
      userInfo: {},
      dataPicker: false,
      ordersList: [],
      coordsMap: [53.05, 50.101783],
      responsible: undefined,
      clientName: '',
      addresseeName: '',
      isDirty: false,
      skipQuery: true,
    };
  },
  computed: {
    deliveryZones() {
      return this.$store.state.deliveryZones;
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
    getItem() {
      const url = `orders/${this.id}`;

      axios
        .get(url)
        .then((response) => {
          const item = response.data;

          this.editedItem = {
            already_paid: item.already_paid,
            bouquets: [],
            client_id: item.client_id,
            client_name: '',
            client_phone: '',
            client_type: '',
            comment: item.comment,
            cost: item.cost,
            date: item.date,
            delivery_cost: item.delivery_cost,
            delivery_time: item.delivery_time,
            delivery_type: item.delivery_type,
            incognito: item.incognito,
            is_recipient_client: item.is_recipient_client,
            order_source_type: item.order_source,
            order_status: item.status,
            pay_channel: item.pay_channel,
            pre_payment: item.pre_payment,
            recipient_address: '',
            recipient_client_type: 'individual',
            recipient_flat_number: 0,
            recipient_floor: 0,
            recipient_id: item.recipient_id,
            recipient_name: '',
            recipient_phone: '',
            times_of_day: item.times_of_day,
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
    setDataClient() {
      const clientId = this.editedItem.client_id;
      const findClient = this.clientsList.find(item => item.id === clientId);

      if (findClient !== undefined) {
        this.editedItem.client_name = findClient.name;
        this.editedItem.client_phone = findClient.phone;
        this.editedItem.client_type = findClient.client_type;
        this.editedItem.recipient_address = findClient.address;
        this.editedItem.recipient_flat_number = findClient.flat_number;
        this.editedItem.recipient_floor = findClient.floor;
      } else {
        this.editedItem.client_name = '';
        this.editedItem.client_phone = '';
        this.editedItem.client_type = '';
        this.editedItem.recipient_address = '';
        this.editedItem.recipient_flat_number = 0;
        this.editedItem.recipient_floor = 0;
      }
    },
    setDataAddressee() {
      const clientId = this.editedItem.recipient_id;
      const findClient = this.clientsList.find(item => item.id === clientId);

      if (findClient) {
        this.editedItem.recipient_name = findClient.name;
        this.editedItem.recipient_phone = findClient.phone;
        this.editedItem.recipient_address = findClient.address;
        this.editedItem.recipient_flat_number = findClient.flat_number;
        this.editedItem.recipient_floor = findClient.floor;
      } else {
        this.editedItem.recipient_name = '';
        this.editedItem.recipient_phone = '';
        this.editedItem.recipient_address = '';
        this.editedItem.recipient_flat_number = 0;
        this.editedItem.recipient_floor = 0;
      }
    },
    setPointByClientAddress(address) {
      geocoder.geocode(
        address,
        (
          _,
          {
            results: [
              { geometry: { location: { lat, lng } = {} } = {} } = {},
            ] = [],
          } = {},
        ) => {
          this.updateAddress({
            geo: [lat, lng],
            address,
          });
        },
        { language: 'ru', key: window.GOOGLE_API_KEY },
      );
    },
    updateAddress(data) {
      this.editedItem.recipient_address = data.address;

      if (data && data.geo[0] && data.geo[1] && this.editedItem) {
        // this.editedItem.coordinates = data.geo;
        // this.editedItem.coordsMap = data.geo;
        this.calculateAndSetDeliveryCost(data.geo);
      }
    },
    calculateAndSetDeliveryCost(geo) {
      for (const zone of this.deliveryZones) {
        if (inside.polygon(zone.coordinates, geo)) {
          this.editedItem.delivery_cost = zone.priceForKm
            ? (getDistance(
              { longitude: geo[0], latitude: geo[1] },
              { longitude: baseCoordinates[0], latitude: baseCoordinates[1] },
              1000,
            ) *
                zone.priceForKm) /
              1000
            : zone.price;

            this.editedItem.delivery_cost += this.editedItem.delivery_cost;
          break;
        }
      }
    },
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
        if (this.editedItem.client_id) {
          this.addOrder();
        } else {
          this.addClient();
        }
      }
    },
    addOrder() {
      const propsItem = Object.assign({}, this.editedItem);

      const url = 'orders';

      if (propsItem.delivery_type === 'pickup') {
        propsItem.recipient_address = '';
        propsItem.recipient_flat_number = 0;
        propsItem.recipient_floor = 0;
      }

      propsItem.order_source_type = propsItem.order_source_type.join(', ');

      // if (!propsItem.coordinates) {
      //   propsItem.coordinates = [];
      // }

      axios
        .post(url, propsItem)
        .then(() => {
          this.createdSuccess = true;

          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addClient() {
      const url = 'clients';
      const propsItem = {
        active: true,
        address: this.editedItem.recipient_address,
        bill: 0,
        birth_day: '1900-01-01',
        client_type: this.editedItem.client_type,
        flat_number: this.editedItem.recipient_flat_number,
        floor: this.editedItem.recipient_floor,
        limit: 0,
        name: this.editedItem.client_name,
        phone: this.editedItem.client_phone,
        sale: 0,
      };

      axios
        .post(url, propsItem)
        .then((response) => {
          this.editedItem.client_id = response.data.id;
          this.addOrder();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    bouquetAdd() {
      this.editedItem.bouquets.push({
        name: '',
        count: null,
        place: '',
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
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  mounted() {
    this.getClients();
    this.getItem();
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
