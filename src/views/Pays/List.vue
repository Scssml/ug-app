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
                  :items="allManagers"
                  v-model="filterManagerStatus"
                  item-value="id"
                  item-text="name"
                  @change="filterByManager"
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
          :items="filteredPaymentList"
          hide-actions
          no-data-text="Оплат не найдено"
          no-results-text="Оплат не найдено"
          :search="search"
          :disable-initial-sort="true"
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
      filterManagerStatus: -1,
      loadingData: [
        {
          title: "Получение оплат",
          error: false,
          loading: true,
          color: "cyan",
          id: "payments"
        }
      ],
      search: "",
      headersTable: [
        {
          text: "ID",
          align: "right",
          value: "id",
          filterable: false,
        },
        {
          text: "Дата",
          align: "left",
          value: "creationDate",
          filterable: false,
        },
        {
          text: "Клиент",
          align: "left",
          value: "client.name"
        },
        {
          text: "Стоимость",
          align: "left",
          value: "amount"
        },
        {
          text: "Тип",
          align: "left",
          value: "paymentType.name"
        },
        {
          text: "Комментарий",
          align: "left",
          value: "description"
        },
        {
          text: "",
          align: "right",
          sortable: false,
          value: "action"
        }
      ],
      dialogForm: false,
      editedId: 0,
      paymentsList: []
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(
        item => !item.error && !item.loading
      );
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    allManagers() {
      return [
        { id: -1, name: "Все" },
        ...this.paymentsList
          .filter(p => p.manager)
          .map(p => ({ id: p.manager.id, name: p.manager.name }))
      ];
    },
    filteredPaymentList() {
      if (this.filterManagerStatus === -1) {
        return this.paymentsList;
      }

      return this.paymentsList.filter(
        p => p.manager && p.manager.id === this.filterManagerStatus
      );
    }
  },
  methods: {
    filterByManager(filter) {
      this.filterManagerStatus = filter;
    },
    getPaymentsList() {
      const itemParams = {
        type: "payments"
      };

      const successData = "Оплаты получены!";
      const errorData = "Ошибка получения оплат!";

      this.$store
        .dispatch("getItemsList", itemParams)
        .then((response) => {
          this.paymentsList = response;

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
    closeDialog() {
      this.getPaymentsList();
      this.dialogForm = false;
      this.editedId = 0;
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
    }
  },
  mounted() {
    this.getPaymentsList();
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
