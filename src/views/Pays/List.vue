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
              <!-- <v-text-field
                v-model="search"
                prepend-icon="search"
                label="Поиск"
                single-line
                hide-details
              ></v-text-field> -->
              <v-flex xs2 class="px-2">
                <v-select
                  label="Тип"
                  :items="[{id: '', name: 'Все'}].concat(paymentTypes)"
                  item-text="name"
                  item-value="id"
                  v-model="filter.paymentType"
                  hide-details
                  @change="customFilter()"
                ></v-select>
              </v-flex>
              <v-flex
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
              </v-flex>
              <v-flex xs2 class="px-2">
                <v-select
                  label="Менеджер"
                  :items="[{ id: 0, name: 'Все' }].concat(usersList)"
                  item-text="name"
                  item-value="id"
                  v-model="filter.createdBy"
                  hide-details
                  @change="handleSelectedManagerChange($event)"
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
            </v-layout>
          </v-flex>

          <v-spacer></v-spacer>

          <v-dialog v-model="dialogForm" persistent max-width="420px">
            <payment-edit
              v-if="editedId"
              :id="editedId"
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
          :disable-initial-sort="true"
          :pagination.sync="pagination"
          :loading="!!$apollo.queries.paymentsList.loading"
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
            <td class="text-xs-right" style="width: 30px;">
              {{ props.item.id }}
            </td>
            <td>{{ new Date(props.item.creationDate).toLocaleString() }}</td>
            <td>
              {{ props.item.client.name }}
              <br />{{ props.item.client.phone }} <br />Баланс:
              {{ props.item.client.bill }}
            </td>
            <td>{{ props.item.amount }}</td>
            <td>{{ props.item.paymentType.name }}</td>
            <td>{{ props.item.description }}</td>
            <td class="text-xs-right" style="width: 110px;">
              <v-icon @click="editItem(props.item.id)" title="Просмотр">
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
              :disabled="page === 0"
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
import PaymentEdit from './edit.vue';
import gql from 'graphql-tag';

export default {
  name: 'Payments',
  components: {
    PaymentEdit,
  },
  data() {
    return {
      // filterManagerStatus: -1,
      loadingData: [
        {
          title: 'Получение оплат',
          error: false,
          loading: false,
          color: 'cyan',
          id: 'payments',
        },
      ],
      filter: {
        createdBy: '',
      },
      dataStartPicker: false,
      dataEndPicker: false,
      search: '',
      headersTable: [
        {
          text: 'ID',
          align: 'right',
          value: 'id',
          filterable: false,
          sortable: false,
        },
        {
          text: 'Дата',
          align: 'left',
          value: 'creationDate',
          filterable: false,
          sortable: false,
        },
        {
          text: 'Клиент',
          align: 'left',
          value: 'client.name',
          sortable: false,
        },
        {
          text: 'Стоимость',
          align: 'left',
          value: 'amount',
          sortable: false,
        },
        {
          text: 'Тип',
          align: 'left',
          value: 'paymentType.name',
          sortable: false,
        },
        {
          text: 'Комментарий',
          align: 'left',
          value: 'description',
          sortable: false,
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      usersList: [],
      dialogForm: false,
      editedId: 0,
      pagination: {
        rowsPerPage: -1,
      },
      take: 20,
      page: 0,
      tableLoading: false,
      paymentsList: [],
      selectedManagerId: null,
    };
  },
  apollo: {
    paymentsList: {
      query: gql`
        query PaymentsList($managerId: bigint_comparison_exp, $limit: Int, $offset: Int) {
          paymentsList: payments(
            order_by: { id: desc }
            where: { managerId: $managerId }
            limit: $limit,
            offset: $offset
          ) {
            id
            client {
              name
              phone
              bill
            }
            paymentType {
              name
            }
            creationDate: creation_date
            description
            amount
          }
        }
      `,
      variables() {
        return {
          managerId: this.selectedManagerId
            ? {
              _eq: this.selectedManagerId,
            }
            : undefined,
          offset: this.page * this.take,
          limit: this.take,
        };
      },
    },
    usersList: {
      query: gql`
        query {
          usersList: users(
            where: { _or: [{ groupId: { _eq: 1 } }, { groupId: { _eq: 2 } }] }
          ) {
            id
            name
          }
        }
      `,
    },
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
  },
  methods: {
    // filterByManager(filter) {
    //   this.filterManagerStatus = filter;
    // },
    handleSelectedManagerChange(selectedId) {
      this.selectedManagerId = selectedId !== 0 ? selectedId : undefined;
      this.page = 0;
    },
    getPaymentsList(loading = true) {
      if (loading) {
        this.tableLoading = false;
        this.reviewsList = [];
      }

      const orderFilter = {
        creationDate: [],
      };

      Object.keys(this.filter).forEach((key) => {
        const val = this.filter[key];

        if (val) {
          if (key === 'dateStart') {
            orderFilter.creationDate[0] = `${val} 00:00:00`;
          } else if (key === 'dateEnd') {
            orderFilter.creationDate[1] = `${val} 23:59:59`;
          } else {
            orderFilter[key] = val;
          }
        }
      });

      const sortSettings = {};
      sortSettings[this.pagination.sortBy] = (this.pagination.descending) ? 'desc' : 'asc';

      const itemParams = {
        type: 'payments',
        sort: {
          id: 'desc',
        },
        filter: orderFilter,
        skip: this.page * this.take,
        take: this.take,
      };

      const successData = 'Оплаты получены!';
      const errorData = 'Ошибка получения оплат!';

      const loadData = this.loadingData.find(item => item.id === itemParams.type);
      loadData.title = successData;
      loadData.loading = false;

      // this.$store
      //   .dispatch("getItemsList", itemParams)
      //   .then((response) => {
      //     this.paymentsList = response;
      //     this.tableLoading = false;
      //
      //     const loadData = this.loadingData.find(
      //       item => item.id === itemParams.type
      //     );
      //     loadData.title = successData;
      //     loadData.loading = false;
      //   })
      //   .catch(() => {
      //     const loadData = this.loadingData.find(
      //       item => item.id === itemParams.type
      //     );
      //     loadData.title = errorData;
      //     loadData.error = true;
      //   });
    },
    closeDialog() {
      this.dialogForm = false;
      this.editedId = 0;
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
    },
    changeShowElem() {
      localStorage.setItem('countElemPage', this.take);
      this.$store.commit('setCountElemPage', this.take);
      this.page = 0;
    },
    prevPage() {
      this.page -= 1;
    },
    nextPage() {
      this.page += 1;
    },
  },
  mounted() {
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
