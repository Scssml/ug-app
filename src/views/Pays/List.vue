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
              <v-text-field
                v-model="search"
                prepend-icon="search"
                label="Поиск"
                single-line
                hide-details
              ></v-text-field>
              <v-flex xs2 class="px-2">
                <v-select
                  label="Менеджер"
                  :items="[{id: '', name: 'Все'}].concat(usersList)"
                  item-text="name"
                  item-value="id"
                  v-model="filter.createdBy"
                  hide-details
                  @change="customFilter()"
                ></v-select>
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
          :loading="tableLoading"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">
              {{ props.item.id }}
            </td>
            <td>{{ props.item.creationDate }}</td>
            <td>
              {{ props.item.client.name }}
              <br />{{ props.item.client.phone }}
              <br>Баланс: {{ props.item.client.bill }}
            </td>
            <td>{{ props.item.amount }}</td>
            <td>{{ props.item.paymentType.name }}</td>
            <td>{{ props.item.description }}</td>
            <td class="text-xs-right" style="width: 110px;">
              <v-icon
                @click="editItem(props.item.id)"
                title="Просмотр"
              >
                visibility
              </v-icon>
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
import PaymentEdit from "./edit.vue";

export default {
  name: "Payments",
  components: {
    PaymentEdit
  },
  data() {
    return {
      // filterManagerStatus: -1,
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
        createdBy: '',
      },
      search: "",
      headersTable: [
        {
          text: "ID",
          align: "right",
          value: "id",
          filterable: false,
          sortable: false,
        },
        {
          text: "Дата",
          align: "left",
          value: "creationDate",
          filterable: false,
          sortable: false,
        },
        {
          text: "Клиент",
          align: "left",
          value: "client.name",
          sortable: false,
        },
        {
          text: "Стоимость",
          align: "left",
          value: "amount",
          sortable: false,
        },
        {
          text: "Тип",
          align: "left",
          value: "paymentType.name",
          sortable: false,
        },
        {
          text: "Комментарий",
          align: "left",
          value: "description",
          sortable: false,
        },
        {
          text: "",
          align: "right",
          sortable: false,
          value: "action"
        }
      ],
      usersList: [],
      dialogForm: false,
      editedId: 0,
      paymentsList: [],
      pagination: {
        rowsPerPage: -1,
      },
      take: 20,
      page: 0,
      tableLoading: false,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(
        item => !item.error && !item.loading
      );
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    // allManagers() {
    //   return [
    //     { id: -1, name: "Все" },
    //     ...this.paymentsList
    //       .filter(p => p.manager)
    //       .map(p => ({ id: p.manager.id, name: p.manager.name }))
    //   ];
    // },
    // filteredPaymentList() {
    //   if (this.filterManagerStatus === -1) {
    //     return this.paymentsList;
    //   }

    //   return this.paymentsList.filter(
    //     p => p.manager && p.manager.id === this.filterManagerStatus
    //   );
    // }
  },
  methods: {
    // filterByManager(filter) {
    //   this.filterManagerStatus = filter;
    // },
    customFilter: function customFilter(items) {
      this.page = 0;
      this.getPaymentsList();
    },
    getPaymentsList(loading = true) {
      if (loading) {
        this.tableLoading = true;
        this.reviewsList = [];
      }

      const orderFilter = {};

      Object.keys(this.filter).forEach((key) => {
        const val = this.filter[key];

        if (val) {
          orderFilter[key] = val;
        }
      });

      const itemParams = {
        type: "payments",
        sort: {
          id: 'desc',
        },
        filter: orderFilter,
        skip: this.page * this.take,
        take: this.take,
      };

      const successData = "Оплаты получены!";
      const errorData = "Ошибка получения оплат!";

      this.$store
        .dispatch("getItemsList", itemParams)
        .then((response) => {
          this.paymentsList = response;
          this.tableLoading = false;

          const loadData = this.loadingData.find(
            item => item.id === itemParams.type
          );
          loadData.title = successData;
          loadData.loading = false;
        })
        .catch(() => {
          const loadData = this.loadingData.find(
            item => item.id === itemParams.type
          );
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
    closeDialog() {
      this.getPaymentsList();
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
    this.getUsersList();
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
