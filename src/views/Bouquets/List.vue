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
            :max-width="(editDialog) ? '1200px' : '420px'"
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
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="bouquetsList"
          hide-actions
          no-data-text="Букетов не найдено"
          no-results-text="Букетов не найдено"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.id }}</td>
            <td>
              {{ props.item.client.name }}
              <br>{{ props.item.client.phone }}
            </td>
            <td>{{ props.item.florist }}</td>
            <td>{{ props.item.user.name }}</td>
            <td>
              {{ props.item.payments[props.item.payments.length - 1].amount }}р
              <br>{{ props.item.payments[props.item.payments.length - 1].creationDate }}
              <br>{{ props.item.payments[props.item.payments.length - 1].paymentType.name }}
            </td>
            <td class="text-xs-right" style="width: 140px;">
              <v-icon
                @click="printDoc(props.item.id)"
              >
                insert_drive_file
              </v-icon>
              <v-icon
                @click="editItem(props.item.id)"
                class="ml-2"
              >
                visibility
              </v-icon>
              <v-icon
                @click="cancelItem(props.item.id)"
                class="ml-2"
                v-if="props.item.payments.every(item => item.paymentType.id !== 7)"
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
      loadingData: [
        {
          title: 'Получение букетов',
          error: false,
          loading: true,
          color: 'cyan',
          id: 'bouquets',
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
          text: 'Клиент',
          align: 'left',
          value: 'client.name',
        },
        {
          text: 'Флорист',
          align: 'left',
          value: 'florist',
        },
        {
          text: 'Менеджер',
          align: 'left',
          value: 'user.name',
        },
        {
          text: 'Оплата',
          align: 'left',
          value: 'payments[0].amount',
          sortable: false,
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
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
  },
  methods: {
    printDoc(id) {
      const { protocol, hostname } = window.location;
      const url = `${protocol}//${hostname}/print/bouquet/${id}/receipt`;
      window.open(url, '_blank');
    },
    getBouquetsList() {
      const itemParams = {
        type: 'bouquets',
      };

      const successData = 'Букеты получены!';
      const errorData = 'Ошибка получения букетов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.bouquetsList = response.map((item) => {
          item.payments.sort((a, b) => (a.creationDate > b.creationDate ? 1 : -1));
          return item;
        });

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
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
  },
  mounted() {
    this.getBouquetsList();
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
