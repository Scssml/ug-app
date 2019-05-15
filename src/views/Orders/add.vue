<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Заказ создан</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4 py-2"
      >
        <span class="headline">Создание заказа</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4 py-1"
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
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.orderSourceType"
                  hide-details
                  class="mb-4"
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
                  ></v-date-picker>
                </v-menu>

                <v-text-field
                  label="Время доставки"
                  v-model="editedItem.deliveryTime"
                  hide-details
                  class="mb-4"
                  v-if="editedItem.deliveryType !== 2"
                ></v-text-field>

                <v-select
                  label="Статус"
                  :items="statusList"
                  :rules="[v => !!v || 'Заполните поле']"
                  item-text="name"
                  item-value="id"
                  v-model.number="editedItem.orderStatus"
                  hide-details
                  class="mb-4"
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
                ></v-select>

                <v-text-field
                  label="Имя"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="editedItem.clientName"
                  hide-details
                  class="mb-4"
                ></v-text-field>

                <v-text-field
                  label="Телефон"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="editedItem.clientPhone"
                  hide-details
                  class="mb-4"
                ></v-text-field>

                <v-textarea
                  label="Состав заказа"
                  auto-grow
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="editedItem.description"
                  row-height="12"
                  hide-details
                  class="mb-4"
                ></v-textarea>

                <v-text-field
                  label="Сумма"
                  v-model.number="editedItem.orderCost"
                  hide-details
                  class="mb-4"
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
                  v-if="editedItem.orderStatus === 3"
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
                  ></v-date-picker>
                </v-menu>

                <v-text-field
                  label="Время доставки"
                  v-model="editedItem.deliveryTime"
                  hide-details
                  class="mb-4"
                ></v-text-field>

                <v-checkbox
                  label="Инкогнито"
                  v-model="editedItem.incognito"
                  color="primary"
                  hide-details
                  class="mb-4"
                ></v-checkbox>

                <v-checkbox
                  label="Заказчик-получатель"
                  v-model="clientAddressee"
                  color="primary"
                  hide-details
                  class="mb-4"
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
                  clearable
                  @change="setDataAddressee()"
                  v-if="!clientAddressee"
                ></v-autocomplete>

                <v-text-field
                  label="Имя получателя"
                  v-model="editedItem.addresseeName"
                  hide-details
                  class="mb-4"
                  v-if="!clientAddressee"
                ></v-text-field>

                <v-text-field
                  label="Телефон получателя"
                  v-model="editedItem.addresseePhone"
                  hide-details
                  class="mb-4"
                  v-if="!clientAddressee"
                ></v-text-field>

                <autocomplete-address
                  :value="editedItem.address"
                  @change="updateAddress($event)"
                  :readonly="false"
                ></autocomplete-address>

                <v-text-field
                  label="Квартира"
                  v-model="editedItem.flat"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>

                <v-text-field
                  label="Подъезд"
                  v-model="editedItem.entrance"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>

                <v-text-field
                  label="Этаж"
                  v-model="editedItem.floor"
                  hide-details
                  class="mb-4"
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- <p class="mb-0">Букеты</p>
            <v-layout
              row
              wrap
              v-for="(bouquet, index) in orderBouquets"
              :key="'bouquet-' + index"
              align-center
            >
              <v-flex
                xs9
                class="pr-3"
              >
                <v-text-field
                  label="Название"
                  :rules="[v => !!v || 'Заполните поле']"
                  v-model="bouquet.name"
                  hide-details
                  class="mb-4"
                  :readonly="editedItemReadOnly"
                ></v-text-field>
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
            </v-icon> -->
          </v-flex>

          <v-flex
            xs5
            v-if="editedItem.deliveryType === 2"
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
        </v-layout>
      </v-card-text>
      <v-card-actions
        class="px-4 pb-4"
      >
        <v-btn
          @click.native="cancel()"
        >Отмена</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="submitForm"
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
  data() {
    return {
      clientAddressee: false,
      dataPicker: false,
      editedItem: {
        client: 0,
        clientName: '',
        clientPhone: '',
        courier: null,
        delivery: false,
        deliveryDate: '',
        deliveryTime: '',
        createdBy: 0,
        orderSourceType: 0,
        description: '',
        orderCost: 0,
        addressee: null,
        addresseeName: '',
        addresseePhone: '',
        address: '',
        entrance: '',
        flat: '',
        floor: '',
        orderStatus: 1,
        clientType: 0,
        deliveryType: 1,
        incognito: false,
        coordinates: [],
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
    };
  },
  computed: {
    placemarks() {
      const placemarks = [];

      this.ordersList.forEach((item) => {
        placemarks.push({
          coords: item.coordinates,
          properties: {
            balloonContent: `${item.deliveryDate}, ${item.deliveryTime}<br>${item.address}`,
          },
          options: {},
          clusterName: '1',
        });
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
    getUsersList() {
      const itemParams = {
        type: 'login',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.userInfo = response;
        this.userInfo.id = +this.userInfo.id;
        this.editedItem.createdBy = +this.userInfo.id;
      }).catch(() => {
        console.log('error');
      });
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
          isActive: true,
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
          status: [1, 2, 3],
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.ordersList = response;
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

        this.$store.dispatch('addItem', itemParams).then(() => {
          this.createdSuccess = true;
          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        });
      }
    },
  },
  mounted() {
    this.getUsersList();
    this.getTsList();
    this.getDeliveryList();
    this.getStatusList();
    this.getClientsList();
    this.getClientTypeList();
    this.getCouriersList();
  },
};
</script>
