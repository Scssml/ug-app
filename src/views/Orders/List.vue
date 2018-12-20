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
            persistent
            max-width="1200px"
          >
            <v-btn slot="activator" color="primary" dark class="mb-2">Добавить</v-btn>
            <v-card>
              <v-alert
                :value="createdSuccess"
                type="success"
                class="my-0"
              >
                {{ formAlertTitle }}
              </v-alert>
              <v-form
                ref="form"
                lazy-validation
              >
                <v-card-title
                  class="px-4 py-2"
                >
                  <span class="headline">{{ formTitle }}</span>
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
                      :xs7="editedItem.delivery != 1"
                      style="padding-right: 15px;"
                    >
                      <v-layout
                        row
                        wrap
                      >
                        <v-flex
                          :xs6="editedItem.delivery != 1"
                        >
                          <v-text-field
                            label="КТО"
                            v-model="editedItem.kto"
                            hide-details
                            class="mb-4"
                            readonly
                          ></v-text-field>

                          <v-select
                            label="Т/С"
                            :items="tsList"
                            item-text="name"
                            item-value="id"
                            v-model="editedItem.ts"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-select>

                          <v-text-field
                            label="Д/П"
                            v-model="editedItem.date"
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
                            v-model="editedItem.delivery"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-select>

                          <v-select
                            label="Статус"
                            :items="statusList"
                            :rules="[v => !!v || 'Заполните поле']"
                            item-text="name"
                            item-value="id"
                            v-model="editedItem.status"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-select>

                          <v-autocomplete
                            label="Клиент"
                            :items="clientsList"
                            :filter="clientsFilter"
                            :rules="[v => !!v || 'Заполните поле']"
                            item-text="name"
                            item-value="id"
                            v-model="editedItem.client"
                            hide-details
                            class="mb-4"
                            no-data-text="Не надено"
                            :readonly="editedItemReadOnly"
                          ></v-autocomplete>
                          <!-- <v-select
                            label="Клиент"
                            :items="clientsList"
                            :rules="[v => !!v || 'Заполните поле']"
                            item-text="name"
                            item-value="id"
                            v-model="editedItem.client"
                          ></v-select> -->

                          <v-text-field
                            label="Телефон"
                            :rules="[v => !!v || 'Заполните поле']"
                            v-model="editedItem.phone"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-text-field>

                          <v-textarea
                            label="Состав заказа"
                            auto-grow
                            :rules="[v => !!v || 'Заполните поле']"
                            v-model="editedItem.orderText"
                            row-height="12"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-textarea>

                          <v-text-field
                            label="Сумма"
                            v-model="editedItem.sum"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-text-field>
                        </v-flex>

                        <v-flex
                          xs6
                          v-if="editedItem.delivery != 1"
                          style="padding-left: 15px;"
                        >
                          <v-text-field
                            label="Курьер"
                            v-model="editedItem.courier"
                            v-if="editedItem.status === 3"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-text-field>

                          <v-menu
                            :close-on-content-click="false"
                            v-model="dataPicker"
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
                              :readonly="editedItemReadOnly"
                            ></v-date-picker>
                          </v-menu>

                          <v-text-field
                            label="Время доставки"
                            v-model="editedItem.deliveryTime"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-text-field>

                          <v-checkbox
                            label="Доставлен"
                            v-model="editedItem.delivered"
                            color="primary"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-checkbox>

                          <v-text-field
                            label="Получатель"
                            v-model="editedItem.addresseeName"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-text-field>

                          <v-text-field
                            label="Телефон получателя"
                            v-model="editedItem.addresseePhone"
                            hide-details
                            class="mb-4"
                            :readonly="editedItemReadOnly"
                          ></v-text-field>

                          <v-text-field
                            label="Адрес"
                            v-model="editedItem.address"
                            hide-details
                            class="mb-4"
                            :rules="[v => !!v || 'Заполните поле']"
                            :readonly="editedItemReadOnly"
                          ></v-text-field>

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
                    </v-flex>

                    <v-flex
                      xs5
                      v-if="editedItem.delivery != 1"
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
                    @click.native="closeDialog()"
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
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="ordersList"
          hide-actions
          no-data-text="Заказов не найдено"
          no-results-text="Заказов не найдено"
          :search="search"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props">
            <tr @dblclick="editItem(props.item, true)">
              <td style="width: 8%;">{{ props.item.date }}</td>
              <td style="width: 9%;">{{ props.item.id }}</td>
              <td style="width: 10%;">
                {{ clientsList.find(item => item.id === props.item.client).name }}
              </td>
              <td style="width: 10%;">{{ props.item.phone }}</td>
              <td style="width: 12%;">{{ props.item.orderText }}</td>
              <td style="width: 9%;" class="text-xs-right">{{ props.item.deliveryDate }}</td>
              <td style="width: 9%;" class="text-xs-right">{{ props.item.deliveryTime }}</td>
              <td class="text-xs-right" style="width: 9%;">{{ props.item.sum }}</td>
              <td class="text-xs-right" style="width: 15%;">
                <v-select
                  label="Статус"
                  :items="statusList"
                  item-text="name"
                  item-value="id"
                  v-model="props.item.status"
                ></v-select>
              </td>
              <td class="text-xs-right" style="width: 15%;">
                <v-icon
                  class="mr-2"
                  @click="createdBouquet(props.item)"
                  v-if="props.item.status === 1"
                >
                  playlist_add
                </v-icon>
                <v-icon
                  class="mr-2"
                  @click="editItem(props.item)"
                >
                  edit
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
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

const dateNow = new Date().toLocaleString('ru', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});

export default {
  name: 'Orders',
  components: {
    yandexMap,
    ymapMarker,
  },
  data() {
    return {
      placemarks: [
        {
          coords: [53.195538, 50.101783],
          properties: {},
          options: {},
          clusterName: '1',
        },
        {
          coords: [53.224519, 50.174861],
          properties: {},
          options: {},
          clusterName: '1',
        },
        {
          coords: [53.233279, 50.270361],
          properties: {},
          options: {},
          clusterName: '1',
        },
        {
          coords: [53.216179, 50.196250],
          properties: {},
          options: {},
          clusterName: '1',
        },
      ],
      statusList: [
        {
          id: 1,
          name: 'Принят',
        },
        {
          id: 2,
          name: 'Выполнен',
        },
        {
          id: 3,
          name: 'Отдан в доставку',
        },
        {
          id: 4,
          name: 'Доставлен',
        },
        {
          id: 5,
          name: 'Отменен',
        },
      ],
      tsList: [
        {
          id: 1,
          name: 'Телефон',
        },
        {
          id: 2,
          name: 'Сайт',
        },
        {
          id: 3,
          name: 'Чаты',
        },
        {
          id: 4,
          name: 'Инстаграм',
        },
        {
          id: 5,
          name: 'Вайбер',
        },
        {
          id: 6,
          name: 'Whatsapp',
        },
      ],
      deliveryList: [
        {
          id: 1,
          name: 'Самовывоз',
        },
        {
          id: 2,
          name: 'Доставка',
        },
      ],
      loadingData: [
        {
          title: 'Получение клиентов',
          error: false,
          loading: true,
          color: 'indigo',
          id: 'clients',
        },
        {
          title: 'Получение заказов',
          error: false,
          loading: true,
          color: 'amber',
          id: 'orders',
        },
      ],
      dataPicker: false,
      search: '',
      headersTable: [
        {
          text: 'Дата',
          align: 'left',
          value: 'date',
        },
        {
          text: '№ заказа',
          align: 'left',
          value: 'id',
        },
        {
          text: 'Клиент',
          align: 'left',
          value: 'client',
        },
        {
          text: 'Телефон',
          align: 'left',
          value: 'phone',
        },
        {
          text: 'Состав заказа',
          align: 'left',
          value: 'orderText',
        },
        {
          text: 'Дата доставки',
          align: 'right',
          value: 'deliveryDate',
        },
        {
          text: 'Дата время',
          align: 'right',
          value: 'deliveryTime',
        },
        {
          text: 'Сумма',
          align: 'right',
          value: 'sumPay',
        },
        {
          text: 'Статус',
          align: 'right',
          value: 'status',
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      dialogForm: false,
      clientsList: [],
      ordersList: [],
      editedIndex: -1,
      editedItemReadOnly: false,
      editedItem: {
        id: 0,
        date: dateNow,
        client: '',
        phone: '',
        courier: '',
        deliveryDate: '',
        deliveryTime: '',
        delivered: false,
        kto: '',
        ts: '',
        dp: '',
        orderText: '',
        sum: 0,
        addresseeName: '',
        addresseePhone: '',
        address: '',
        status: 1,
        delivery: '',
        entrance: '',
        flat: '',
        floor: '',
      },
      defaultItem: {
        id: 0,
        date: dateNow,
        client: '',
        phone: '',
        courier: '',
        deliveryDate: '',
        deliveryTime: '',
        delivered: false,
        kto: '',
        ts: '',
        dp: '',
        orderText: '',
        sum: 0,
        addresseeName: '',
        addresseePhone: '',
        address: '',
        status: 1,
        delivery: '',
        entrance: '',
        flat: '',
        floor: '',
      },
      createdSuccess: false,
      dialogDeleted: false,
      deletedIndex: -1,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    formTitle: function formTitle() {
      let title = '';
      if (this.editedIndex === -1) {
        title = 'Новый заказ';
      } else if (this.editedItemReadOnly) {
        title = 'Просмотр заказа';
      } else {
        title = 'Изменение заказа';
      }
      return title;
    },
    formAlertTitle: function formTitle() {
      return this.editedIndex === -1 ? 'Заказ создан' : 'Заказ изменен';
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
    getDataProps: function getDataProps() {
      this.getClientsList();
      this.getOrdersList();
    },
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        if (this.editedIndex > -1) {
          Object.assign(this.ordersList[this.editedIndex], this.editedItem);
        } else {
          // this.editedItem.date = new Date().toLocaleString('ru', {
          //   day: 'numeric',
          //   month: 'numeric',
          //   year: 'numeric',
          // });
          this.editedItem.id = this.ordersList.sort((a, b) => b.id - a.id)[0].id + 1;

          this.ordersList.push(this.editedItem);
        }

        this.createdSuccess = true;

        setTimeout(() => {
          this.closeDialog();
        }, 1000);
      }
    },
    closeDialog: function closeDialog() {
      this.dialogForm = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.createdSuccess = false;
        this.editedItemReadOnly = false;
      }, 300);
    },
    editItem: function editItem(item, readonly = false) {
      this.editedIndex = this.ordersList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogForm = true;
      this.editedItemReadOnly = readonly;
    },
    confirmDeleted: function confirmDeleted(item) {
      this.dialogDeleted = true;
      this.deletedIndex = this.ordersList.indexOf(item);
    },
    deletedItem: function deletedItem(index) {
      this.ordersList.splice(index, 1);
      this.closeConfirm();
    },
    closeConfirm: function closeDialog() {
      this.dialogDeleted = false;
      setTimeout(() => {
        this.deletedIndex = -1;
      }, 300);
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
            florist: null,
            order: item.id,
            client: item.client,
            decorPersent: 10,
            delivery: 0,
            salePersent: 0,
          },
          goods: [],
        });
      } else {
        cardsList[index].props.client = item.client;
      }

      localStorage.setItem('cardsList', JSON.stringify(cardsList));
      this.$router.push('/');
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
        background: #fbfbfb;
      }

      &:hover {

        td {
          background: #eee;
        }
      }
    }
  }
</style>
