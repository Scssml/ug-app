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
          <v-spacer></v-spacer>

          <v-dialog
            v-model="dialogForm"
            persistent
            max-width="420px"
          >
            <v-btn slot="activator" color="primary" dark class="mb-2">Добавить</v-btn>
            <template
              v-if="dialogForm"
            >
              <payment-types-edit
                v-if="Object.keys(this.editedItem).length > 0"
                :item="editedItem"
                @cancel="closeDialog()"
              ></payment-types-edit>
              <payment-types-add
                v-else
                @cancel="closeDialog()"
              ></payment-types-add>
            </template>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="paymentTypesList"
          hide-actions
          no-data-text="Типы оплат не найдены"
          no-results-text="Типы оплат  не найдены"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.code }}</td>
            <td>{{ (props.item.system) ? 'Да' : 'Нет' }}</td>
            <td class="text-xs-right" style="width: 140px">
              <v-icon
                @click="editItem(props.item)"
                title="Изменить"
              >
                edit
              </v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios';
import PaymentTypesEdit from './edit.vue';
import PaymentTypesAdd from './add.vue';

export default {
  name: 'PaymentTypes',
  components: {
    PaymentTypesEdit,
    PaymentTypesAdd,
  },
  data() {
    return {
      loadingData: [
        {
          title: 'Получение типов оплат',
          error: false,
          loading: true,
          color: 'deep-orange',
          id: 'payment-types',
        },
      ],
      search: '',
      headersTable: [
        {
          text: 'ID',
          align: 'right',
          value: 'id',
        },
        {
          text: 'Название',
          align: 'left',
          value: 'name',
        },
        {
          text: 'Код',
          align: 'left',
          value: 'code',
        },
        {
          text: 'Системный',
          align: 'left',
          value: 'system',
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      dialogForm: false,
      paymentTypesList: [],
      editedItem: {},
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
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
          this.paymentTypesList = items;

          loadData.title = 'Типы оплат получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения типов оплат!';
          loadData.error = true;
          console.log(error);
        });
    },
    closeDialog() {
      this.getPaymentTypesList();
      this.dialogForm = false;
      this.editedItem = {};
    },
    editItem(item) {
      this.editedItem = item;
      this.dialogForm = true;
    },
  },
  mounted() {
    this.getPaymentTypesList();
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
