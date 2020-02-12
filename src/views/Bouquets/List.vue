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
      <v-card>
        <v-card-title>
          <v-flex>
            <v-layout row wrap>
              <!-- <v-text-field
                v-model="search"
                prepend-icon="search"
                label="Поиск"
                single-line
                hide-details
              ></v-text-field> -->

              <!-- <v-flex
                xs2
                class="px-2"
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
                >
                  <v-text-field
                    slot="activator"
                    label="Дата (с)"
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
                class="px-2"
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
                >
                  <v-text-field
                    slot="activator"
                    label="Дата (по)"
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
              </v-flex> -->

              <v-flex xs2 class="px-2">
                <v-select
                  label="Менеджер"
                  :items="[{id: '', name: 'Все'}].concat(usersList)"
                  item-text="name"
                  item-value="id"
                  v-model="filter.user"
                  hide-details
                  @change="customFilter()"
                ></v-select>
              </v-flex>

              <v-flex xs3 class="px-2">
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

              <!-- <v-flex xs2 class="px-2">
                <v-select
                  label="Клиент"
                  :items="allClients"
                  v-model="filterClientStatus"
                  item-value="id"
                  item-text="name"
                  @change="filterByClient"
                ></v-select>
              </v-flex> -->
            </v-layout>
          </v-flex>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialogForm"
            persistent
            :max-width="(editDialog) ? '1200px' : '420px'"
          >
            <bouquet-edit
              v-if="editedId && editDialog"
              :bouquet="bouquetsList.find(item => item.id === editedId)"
              @cancel="closeDialog()"
            ></bouquet-edit>

            <bouquet-cancel
              v-if="editedId && cancelDialog"
              :id="editedId"
              @cancel="closeDialog()"
            ></bouquet-cancel>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="bouquetsList"
          :disable-initial-sort="true"
          hide-actions
          no-data-text="Букетов не найдено"
          no-results-text="Букетов не найдено"
          :search="search"
          :pagination.sync="pagination"
          :loading="tableLoading"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.text"
                class="text-xs-left column"
                :class="[
                  'column sortable', pagination.descending ? 'desc' : 'asc',
                  header.value === pagination.sortBy ? 'active' : ''
                ]"
                @click="(header.sortable) ? changeSort(header.value) : ''"
              >
                <v-icon
                  small
                  v-if="header.sortable"
                >arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.id }}</td>
            <td>
              {{ props.item.client.name }}
              <br>{{ props.item.client.phone }}
              <template v-if="props.item.orderId">
                <br>Заказ: {{ props.item.orderId }}
              </template>
            </td>
            <td>{{ props.item.florist ? props.item.florist.name : '' }}</td>
            <td>{{ props.item.user.name }}</td>
            <td>
              {{ props.item.payments.reduce((acc, item) => {
                return acc + +item.amount
              }, 0)}}р
              <br>{{ props.item.payments[props.item.payments.length - 1].creationDate }}
              <br>{{ props.item.payments.map(p => p.paymentType.name).join(', ') }}
            </td>
            <td class="text-xs-right" style="width: 160px;">
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
                @click="cancelItem(props.item.id)"
                v-if="props.item.payments.every(item => item.paymentType.id !== 7)"
                class="mx-0"
                title="Возврат"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
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
import BouquetEdit from './edit.vue';
import BouquetCancel from './cancel.vue';

export default {
  name: 'Bouquets',
  components: {
    BouquetEdit,
    BouquetCancel,
  },
  data() {
    return {
      // filterManagerStatus: -1,
      // filterClientStatus: -1,
      loadingData: [
        {
          title: 'Получение букетов',
          error: false,
          loading: true,
          color: 'cyan',
          id: 'bouquets',
        },
      ],
      filter: {
        user: '',
        client: '',
        dateStart: null,
        dateEnd: null,
      },
      dataStartPicker: false,
      dataEndPicker: false,
      search: '',
      headersTable: [
        {
          text: 'ID',
          align: 'right',
          value: 'id',
          sortable: true,
        },
        {
          text: 'Клиент',
          align: 'left',
          value: 'client.name',
          sortable: false,
        },
        {
          text: 'Флорист',
          align: 'left',
          value: 'florist',
          sortable: false,
        },
        {
          text: 'Менеджер',
          align: 'left',
          value: 'user.name',
          sortable: false,
        },
        {
          text: 'Оплата',
          align: 'left',
          value: 'payments[0].amount',
          sortable: true,
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      dialogForm: false,
      editDialog: false,
      cancelDialog: false,
      editedId: 0,
      bouquetsList: [],
      usersList: [],
      clientsList: [],
      pagination: {
        rowsPerPage: -1,
        sortBy: 'id',
        descending: true,
      },
      take: 20,
      page: 0,
      tableLoading: false,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    // allManagers() {
    //   return [
    //     { id: -1, name: 'Все' },
    //     ...this.bouquetsList
    //       .filter(p => p.user)
    //       .map(p => ({ id: p.user.id, name: p.user.name })),
    //   ];
    // },
    // allClients() {
    //   return [
    //     { id: -1, name: 'Все', phone: '' },
    //     ...this.bouquetsList
    //       .filter(p => p.client)
    //       .map(p => ({ id: p.client.id, name: p.client.name, phone: p.client.phone })),
    //   ];
    // },
    // filteredBouquestsList() {
    //   let bouquetsList = this.bouquetsList;
    //   if (this.filterManagerStatus !== -1) {
    //     bouquetsList = bouquetsList.filter(
    //       p => p.user && p.user.id === this.filterManagerStatus
    //     );
    //   }

    //   if (this.filterClientStatus !== -1) {
    //     bouquetsList = bouquetsList.filter(
    //       p => p.client && p.client.id === this.filterClientStatus
    //     );
    //   }

    //   return bouquetsList;
    // },
  },
  methods: {
    // filterByManager(filter) {
    //   this.filterManagerStatus = filter;
    // },
    // filterByClient(filter) {
    //   this.filterClientStatus = filter;
    // },
    customFilter: function customFilter() {
      this.page = 0;
      this.getBouquetsList();
    },
    printDoc(id) {
      const { protocol, hostname } = window.location;
      const url = `${protocol}//${hostname}/print/bouquet/${id}/receipt`;
      window.open(url, '_blank');
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1;
    },
    getBouquetsList(loading = true) {
      if (loading) {
        this.tableLoading = true;
        this.bouquetsList = [];
      }

      const orderFilter = {};

      Object.keys(this.filter).forEach((key) => {
        const val = this.filter[key];

        if (val) {
          orderFilter[key] = val;
        }
      });

      const sortSettings = {};
      sortSettings[this.pagination.sortBy] = (this.pagination.descending) ? 'desc' : 'asc';

      const itemParams = {
        type: 'bouquets',
        sort: sortSettings,
        filter: orderFilter,
        skip: this.page * this.take,
        take: this.take,
      };

      const successData = 'Букеты получены!';
      const errorData = 'Ошибка получения букетов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.bouquetsList = response;
        this.tableLoading = false;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
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
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }

      this.page = 0;
      this.getBouquetsList();
    },
    closeDialog() {
      this.getBouquetsList();
      this.dialogForm = false;
      this.editedId = 0;
      this.cancelDialog = false;
      this.editDialog = false;
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
    changeShowElem() {
      localStorage.setItem('countElemPage', this.take);
      this.$store.commit('setCountElemPage', this.take);
      this.page = 0;
      this.getBouquetsList();
    },
    prevPage() {
      this.page -= 1;
      this.getBouquetsList();
    },
    nextPage() {
      this.page += 1;
      this.getBouquetsList();
    },
  },
  mounted() {
    if (this.$route.query.client !== undefined) {
      this.filter.client = +this.$route.query.client;
    }

    this.getBouquetsList();
    this.getUsersList();
    this.getClientsList();
  },
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
