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
                  class="px-4"
                >
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text
                  class="px-4"
                >
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      xs7
                      style="padding-right: 15px;"
                    >
                      <v-select
                        label="Статус"
                        :items="statusList"
                        :rules="[v => !!v || 'Заполните поле']"
                        item-text="name"
                        item-value="id"
                        v-model="editedItem.status"
                      ></v-select>
                      <v-select
                        label="Клиент"
                        :items="clientsList"
                        :rules="[v => !!v || 'Заполните поле']"
                        item-text="name"
                        item-value="id"
                        v-model="editedItem.client"
                      ></v-select>
                      <v-text-field
                        label="Телефон"
                        :rules="[v => !!v || 'Заполните поле']"
                        v-model="editedItem.phone"
                      ></v-text-field>
                      <v-text-field
                        label="Курьер"
                        v-model="editedItem.courier"
                      ></v-text-field>
                      <v-text-field
                        label="Дата доставки"
                        :rules="[v => !!v || 'Заполните поле']"
                        v-model="editedItem.deliveryDate"
                      ></v-text-field>
                      <v-text-field
                        label="Время доставки"
                        v-model="editedItem.deliveryTime"
                      ></v-text-field>
                      <v-checkbox
                        label="Доставлен"
                        v-model="editedItem.delivered"
                        color="primary"
                      ></v-checkbox>
                      <v-text-field
                        label="КТО"
                        v-model="editedItem.kto"
                      ></v-text-field>
                      <v-text-field
                        label="Т/С"
                        v-model="editedItem.ts"
                      ></v-text-field>
                      <v-text-field
                        label="Д/П"
                        v-model="editedItem.dp"
                      ></v-text-field>
                      <v-textarea
                        label="Состав заказа"
                        auto-grow
                        :rules="[v => !!v || 'Заполните поле']"
                        v-model="editedItem.orderText"
                      ></v-textarea>
                      <v-text-field
                        label="Сумма"
                        v-model="editedItem.sum"
                      ></v-text-field>
                      <v-text-field
                        label="Получатель"
                        v-model="editedItem.addresseeName"
                      ></v-text-field>
                      <v-text-field
                        label="Телефон получателя"
                        v-model="editedItem.addresseePhone"
                      ></v-text-field>
                      <v-text-field
                        label="Адрес"
                        v-model="editedItem.address"
                      ></v-text-field>
                    </v-flex>

                    <v-flex
                      xs5
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
            <td style="width: 5%;">{{ props.item.date }}</td>
            <td style="width: 9%;">{{ props.item.id }}</td>
            <td style="width: 15%;">
              {{ clientsList.find(item => item.id === props.item.client).name }}
            </td>
            <td style="width: 10%;">{{ props.item.phone }}</td>
            <td style="width: 15%;">{{ props.item.orderText }}</td>
            <td style="width: 9%;" class="text-xs-right">{{ props.item.deliveryDate }}</td>
            <td style="width: 9%;" class="text-xs-right">{{ props.item.deliveryTime }}</td>
            <td class="text-xs-right" style="width: 9%;">{{ props.item.sum }}</td>
            <td class="text-xs-right" style="width: 9%;">
              {{ statusList.find(item => item.id === props.item.status).name }}
            </td>
            <td class="text-xs-right" style="width: 10%;">
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
          </template>
        </v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

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
          name: 'Доставка',
        },
        {
          id: 4,
          name: 'Отменен',
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
      editedItem: {
        id: 0,
        date: '',
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
        status: '',
      },
      defaultItem: {
        id: 0,
        date: '',
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
        status: '',
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
      return this.editedIndex === -1 ? 'Новый заказ' : 'Изменение заказа';
    },
    formAlertTitle: function formTitle() {
      return this.editedIndex === -1 ? 'Заказ создан' : 'Заказ изменен';
    },
  },
  methods: {
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
          this.editedItem.date = new Date().toLocaleString('ru', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          });
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
      }, 300);
    },
    editItem: function editItem(item) {
      this.editedIndex = this.ordersList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogForm = true;
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
  },
  mounted() {
    this.getDataProps();
  },
};
</script>
