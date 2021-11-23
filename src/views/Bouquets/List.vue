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
                  :items="usersList"
                  item-text="name"
                  item-value="id"
                  v-model="filter.manager_id"
                  hide-details
                  clearable
                  no-data-text="Не надено"
                  @change="customFilter()"
                ></v-select>
              </v-flex>

              <v-flex xs3 class="px-2">
                <v-autocomplete
                  label="Клиент"
                  :items="clientsList"
                  item-text="name"
                  item-value="id"
                  v-model.number="filter.client_id"
                  hide-details
                  no-data-text="Не надено"
                  clearable
                  :search-input.sync="searchClients"
                  @change="customFilter()"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialogForm"
            persistent
            :max-width="editDialog ? '1200px' : '520px'"
          >
            <bouquet-edit
              v-if="editedId && editDialog"
              :id="editedId"
              @cancel="closeDialog()"
            ></bouquet-edit>

            <bouquet-cancel
              v-if="editedId && cancelDialog"
              :id="editedId"
              @cancel="closeDialog()"
            ></bouquet-cancel>

            <bouquet-change-client
              v-if="editedId && changeClientDialog"
              :id="editedId"
              @cancel="closeDialog()"
            ></bouquet-change-client>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="bouquetsList"
          hide-actions
          no-data-text="Букетов не найдено"
          no-results-text="Букетов не найдено"
          :search="search"
          :pagination.sync="pagination"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">
              {{ props.item.id }}
            </td>
            <td>
              <template v-if="props.item.client">
                {{ props.item.client.name }}
                <br />{{ props.item.client.phone }}
              </template>

              <template v-if="props.item.order_id">
                <br />Заказ: {{ props.item.order_id }}
              </template>
            </td>
            <td>
              {{ props.item.florist ? props.item.florist.name : "" }}
            </td>
            <td>
              {{ props.item.created_by.name }}
            </td>
            <td>
              <template v-for="(p, index) in props.item.payments">
                <div :key="index">
                  {{ (type = paymentTypes.find((item) => item.id === p.payment_type_id)) ? type.name : 'Неизвестный тип' }}
                  <br>{{ p.amount }}
                  <br>{{ new Date(p.created_at).toLocaleString() }}
                </div>
              </template>
            </td>
            <td class="text-xs-right" style="width: 200px;">
              <v-btn
                flat
                icon
                :to="`/print/bouquet/receipt/${props.item.id}/`"
                target="_blank"
                class="mx-0"
                title="Печать"
              >
                <v-icon>insert_drive_file</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                @click="editItem(props.item.id)"
                class="mx-0"
                title="Просмотр"
              >
                <v-icon>visibility</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                @click="changeClientItem(props.item.id)"
                class="mx-0"
                title="Смена клиента"
              >
                <v-icon>loop</v-icon>
              </v-btn>
              <!-- <v-btn
                flat
                icon
                @click="cancelItem(props.item.id)"
                v-if="
                  props.item.payments.every(item => item.paymentType.id !== 7)
                "
                class="mx-0"
                title="Возврат"
              >
                <v-icon>delete</v-icon>
              </v-btn> -->
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
              :disabled="bouquetsList.length < take"
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
import BouquetEdit from "./edit.vue";
import BouquetCancel from "./cancel.vue";
import BouquetChangeClient from "./changeClient.vue";

export default {
  name: "Bouquets",
  components: {
    BouquetEdit,
    BouquetCancel,
    BouquetChangeClient,
  },
  data() {
    return {
      loadingData: [
        {
          title: "Получение букетов",
          error: false,
          loading: true,
          color: "cyan",
          id: "bouquets"
        },
        {
          title: "Получение менеджеров",
          error: false,
          loading: true,
          color: "cyan",
          id: "managers"
        },
        // {
        //   title: "Получение клиентов",
        //   error: false,
        //   loading: true,
        //   color: "cyan",
        //   id: "clients"
        // },
        {
          title: "Получение типов оплат",
          error: false,
          loading: true,
          color: "cyan",
          id: "payment-types"
        },
      ],
      filter: {
        manager_id: null,
        start_date: null,
        end_date: null,
        client_id: null,
      },
      searchClients: '',
      timerClients: null,
      search: "",
      headersTable: [
        {
          text: "ID",
          align: "right",
          value: "id",
          sortable: false
        },
        {
          text: "Клиент",
          align: "left",
          value: "client.name",
          sortable: false
        },
        {
          text: "Флорист",
          align: "left",
          value: "florist.name",
          sortable: false
        },
        {
          text: "Менеджер",
          align: "left",
          value: "created_by.name",
          sortable: false
        },
        {
          text: "Оплата",
          align: "left",
          value: "amount",
          sortable: false
        },
        {
          text: "",
          align: "right",
          sortable: false,
          value: "action"
        }
      ],
      paymentTypes: [],
      dialogForm: false,
      editDialog: false,
      cancelDialog: false,
      changeClientDialog: false,
      editedId: 0,
      bouquetsList: [],
      usersList: [],
      clientsList: [],
      pagination: {
        sortBy: "id",
        rowsPerPage: -1,
        descending: true
      },
      take: 20,
      page: 1,
      tableLoading: false,
      skipQuery: false,
      selectedClientId: 0,
      selectedManagerId: 0,
      client: {},
      queryName: "",
      skipClientsQuery: true,
      suggestions: [],
      dataStartPicker: false,
      dataEndPicker: false
    };
  },
  watch: {
    searchClients(val) {
      const findClient = this.clientsList.find((item) => item.name === val);
      if (findClient) return false;

      if (val && val.length >= 3) {
        if (this.timerClients) clearTimeout(this.timerClients);

        this.timerClients = setTimeout(() => {
          this.getClients(val);
        }, 500);
      } else {
        this.clientsList = [];
      }
    },
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
    getPaymentTypesList() {
      const loadData = this.loadingData.find(item => item.id === 'payment-types');
      const url = 'payment-types';

      axios
        .get(url)
        .then((response) => {
          const items = response.data;
          this.paymentTypes = items;

          loadData.title = 'Типы оплат получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения типов оплат!';
          loadData.error = true;
          console.log(error);
        });
    },
    getManagerList() {
      const loadData = this.loadingData.find(item => item.id === 'managers');
      const url = 'users';

      axios
        .get(url, {
          params: { group_id: 14}
        })
        .then((response) => {
          this.usersList = response.data;

          loadData.title = 'Менеджеры получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения менеджеров!';
          loadData.error = true;
          console.log(error);
        });
    },
    getClients(searchVal) {
      const url = 'clients';

      axios
        .get(url, {
          params: {
            name_or_phone: searchVal,
            page_limit: 10,
          },
        })
        .then((response) => {
          this.clientsList = response.data.map((item) => {
            return {
              name: `${item.name} (${item.phone})`,
              id: item.id,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    customFilter() {
      this.page = 1;
      this.getBouquetsList();
    },
    printDoc(id) {
      const { protocol, hostname } = window.location;
      const url = `${protocol}//${hostname}/print/bouquet/${id}/receipt`;
      window.open(url, "_blank");
    },
    getBouquetsList(loading = true) {
      const loadData = this.loadingData.find(item => item.id === 'bouquets');
      const url = 'bouquets';

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
          this.bouquetsList = response.data;

          loadData.title = 'Букеты получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения букетов!';
          loadData.error = true;
          console.log(error);
        });
    },
    closeDialog() {
      this.dialogForm = false;
      this.editedId = 0;
      this.cancelDialog = false;
      this.editDialog = false;
      this.changeClientDialog = false;

      // this.getBouquetsList();
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
      this.editDialog = true;
    },
    cancelItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
      this.cancelDialog = true;
    },
    changeClientItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
      this.changeClientDialog = true;
    },
    changeShowElem() {
      localStorage.setItem("countElemPage", this.take);
      this.$store.commit("setCountElemPage", this.take);
      this.page = 1;
      this.getBouquetsList();
    },
    prevPage() {
      this.page -= 1;
      this.getBouquetsList();
    },
    nextPage() {
      this.page += 1;
      this.getBouquetsList();
    }
  },
  mounted() {
    this.getBouquetsList();
    this.getManagerList();
    this.getPaymentTypesList();

    const date = new Date();
    const dateEnd = date.toISOString().split("T")[0];

    date.setDate(date.getDate() - 30);
    const dateStart = date.toISOString().split("T")[0];

    this.filter.start_date = dateStart;
    this.filter.end_date = dateEnd;

    if (this.$route.query.clientId) {
      this.filter.client_id = +this.$route.query.clientId;
      this.$router.replace({ query: {} });
    }
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
