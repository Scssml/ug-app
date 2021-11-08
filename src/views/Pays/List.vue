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
      <v-card>
        <v-card-title>
          <v-flex>
            <v-layout row wrap>
              <v-flex xs2 class="px-2">
                <v-select
                  label="Тип"
                  :items="[{ id: null, name: 'Все' }].concat(paymentTypes)"
                  item-text="name"
                  item-value="id"
                  v-model="filter.payment_type"
                  hide-details
                  @change="customFilter()"
                ></v-select>
              </v-flex>
              <v-flex xs2 class="px-2">
                <v-menu
                  :close-on-content-click="false"
                  v-model="dataStartPicker"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата (с)"
                    v-model="filter.start_date"
                    prepend-icon="event"
                    hide-details
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="filter.start_date"
                    @input="dataStartPicker = false"
                    no-title
                    scrollable
                    locale="ru-ru"
                    first-day-of-week="1"
                    :max="!!filter.end_date ? filter.end_date : undefined"
                    @change="customFilter()"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs2 class="px-2">
                <v-menu
                  :close-on-content-click="false"
                  v-model="dataEndPicker"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата (по)"
                    v-model="filter.end_date"
                    prepend-icon="event"
                    hide-details
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="filter.end_date"
                    @input="dataEndPicker = false"
                    no-title
                    locale="ru-ru"
                    scrollable
                    first-day-of-week="1"
                    :min="!!filter.start_date ? filter.start_date : undefined"
                    @change="customFilter()"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs2 class="px-2">
                <v-select
                  label="Менеджер"
                  :items="[{ id: null, name: 'Все' }].concat(usersList)"
                  item-text="name"
                  item-value="id"
                  v-model="filter.manager_id"
                  hide-details
                  @change="customFilter()"
                ></v-select>
              </v-flex>
              <v-flex xs3 class="px-2">
                <v-select
                  label="Клиент"
                  :items="[{ id: null, name: 'Все' }].concat(clientsList)"
                  item-text="name"
                  item-value="id"
                  v-model="filter.client_id"
                  hide-details
                  @change="customFilter()"
                ></v-select>
                <!-- <v-autocomplete
                  label="Клиент"
                  :items="[{id: null, name: 'Все', phone: ''}].concat(clientsList)"
                  :filter="clientsFilter"
                  item-text="name"
                  item-value="id"
                  v-model="filter.client"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  @change="customFilter()"
                ></v-autocomplete> -->
              </v-flex>
            </v-layout>
          </v-flex>

          <v-spacer></v-spacer>

          <v-dialog v-model="dialogForm" persistent max-width="420px">
            <payment-edit
              v-if="editedItem"
              :item="editedItem"
              @cancel="closeDialog()"
            ></payment-edit>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="paymentsList"
          hide-actions
          no-data-text="Оплат не найдено"
          no-results-text="Оплат не найдено"
          :search="search"
          :pagination.sync="pagination"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">
              {{ props.item.id }}
            </td>
            <td>{{ new Date(props.item.created_at).toLocaleString() }}</td>
            <td>
              <template v-if="props.item.client">
                {{ props.item.client && props.item.client.name }}
                <br />{{ props.item.client && props.item.client.phone }}
                <br />Баланс:
                {{ props.item.client && props.item.client.bill }}
              </template>
            </td>
            <td>{{ props.item.amount }}</td>
            <td>
              {{ props.item.payment_type && paymentTypes.find((item) => item.id === props.item.payment_type).name }}
            </td>
            <td>{{ props.item.created_by.name }}</td>
            <td>{{ props.item.comment }}</td>
            <td class="text-xs-right" style="width: 110px;">
              <v-icon @click="editItem(props.item)" title="Просмотр">
                visibility
              </v-icon>
            </td>
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
              :disabled="page === 1"
              @click="prevPage()"
            >
              <v-icon dark>keyboard_arrow_left</v-icon>
            </v-btn>
            <v-btn
              small
              color="info"
              class="ml-3"
              :disabled="paymentsList.length < take"
              @click="nextPage()"
            >
              <v-icon dark>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios';
import PaymentEdit from './edit.vue';

export default {
  name: "Payments",
  components: {
    PaymentEdit
  },
  data() {
    return {
      loadingData: [
        {
          title: "Получение оплат",
          error: false,
          loading: true,
          color: "cyan",
          id: "payments"
        }
      ],
      filter: {
        manager_id: null,
        payment_type: null,
        start_date: null,
        end_date: null,
        client_id: null,
      },
      dataStartPicker: false,
      dataEndPicker: false,
      search: "",
      headersTable: [
        {
          text: "ID",
          align: "right",
          value: "id",
          filterable: false,
          sortable: false
        },
        {
          text: "Дата",
          align: "left",
          value: "created_at",
          filterable: false,
          sortable: false
        },
        {
          text: "Клиент",
          align: "left",
          value: "client.name",
          sortable: false
        },
        {
          text: "Стоимость",
          align: "left",
          value: "amount",
          sortable: false
        },
        {
          text: "Тип",
          align: "left",
          value: "payment_type",
          sortable: false
        },
        {
          text: "Менеджер",
          align: "left",
          value: "created_by.name",
          sortable: false
        },
        {
          text: "Комментарий",
          align: "left",
          value: "comment",
          sortable: false
        },
        {
          text: "",
          align: "right",
          sortable: false,
          value: "action"
        }
      ],
      usersList: [],
      paymentTypes: [
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
      clientsList: [],
      dialogForm: false,
      editedItem: {},
      pagination: {
        sortBy: "id",
        rowsPerPage: -1,
        descending: true
      },
      take: 20,
      page: 1,
      tableLoading: false,
      paymentsList: [],
      selectedManagerId: null,
      client: {},
      queryName: "",
      skipClientsQuery: true,
      suggestions: []
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(
        item => !item.error && !item.loading
      );
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
  },
  methods: {
    getManagerList() {
      const url = 'users';

      axios
        .get(url)
        .then((response) => {
          this.usersList = response.data;
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
          this.clientsList = response.data;;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    customFilter() {
      this.page = 1;
      this.getPaymentsList();
    },
    getPaymentsList() {
      const loadData = this.loadingData.find(item => item.id === 'payments');
      const url = 'payments';

      const propsItem = {
        page: this.page,
        page_limit: this.take,
      };

      Object.keys(this.filter).forEach((key) => {
        if (this.filter[key]) {
          propsItem[key] = this.filter[key];
        }
      });

      axios
        .get(url, {
          params: propsItem,
        })
        .then((response) => {
          this.paymentsList = response.data;

          loadData.title = 'Оплаты получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения оплат!';
          loadData.error = true;
          console.log(error);
        });
    },
    closeDialog() {
      this.dialogForm = false;
      this.editedItem = {};
    },
    editItem(item) {
      this.editedItem = item;
      this.dialogForm = true;
    },
    changeShowElem() {
      localStorage.setItem("countElemPage", this.take);
      this.$store.commit("setCountElemPage", this.take);
      this.page = 1;
      this.getPaymentsList();
    },
    prevPage() {
      this.page -= 1;
      this.getPaymentsList();
    },
    nextPage() {
      this.page += 1;
      this.getPaymentsList();
    },
  },
  mounted() {
    this.getPaymentsList();
    this.getManagerList();
    this.getClients();

    const date = new Date();
    const dateEnd = date.toISOString().split("T")[0];

    date.setDate(date.getDate() - 30);
    const dateStart = date.toISOString().split("T")[0];

    this.filter.start_date = dateStart;
    this.filter.end_date = dateEnd;
  }
};
</script>

<style lang="scss" scoped>
.v-table {
  tr:nth-child(even) {
    td {
      background: #f9f9f9;
    }

    &:hover {
      td {
        background: #eee;
      }
    }
  }
}
</style>
