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

              <v-flex xs3 class="px-2">
                <v-autocomplete
                  label="Клиент"
                  :items="allClients"
                  :filter="clientsFilter"
                  item-text="name"
                  item-value="id"
                  v-model="filterClientStatus"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  @change="filterByClient"
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
          :items="filteredBouquestsList"
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
            <td>{{ props.item.florist ? props.item.florist.name : '' }}</td>
            <td>{{ props.item.user.name }}</td>
            <td>
              {{ props.item.payments[props.item.payments.length - 1].amount }}р
              <br>{{ props.item.payments[props.item.payments.length - 1].creationDate }}
              <br>{{ props.item.payments[props.item.payments.length - 1].paymentType.name }}
            </td>
            <td class="text-xs-right" style="width: 160px;">
              <v-btn
                flat
                icon
                :to="`/print/bouquet/receipt/${props.item.id}/`"
                target="_blank"
                class="mx-0"
              >
                <v-icon>insert_drive_file</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                @click="editItem(props.item.id)"
                class="mx-0"
              >
                <v-icon>visibility</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                @click="cancelItem(props.item.id)"
                v-if="props.item.payments.every(item => item.paymentType.id !== 7)"
                class="mx-0"
              >
                <v-icon>delete</v-icon>
              </v-btn>
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
      filterManagerStatus: -1,
      filterClientStatus: -1,
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
    allManagers() {
      return [
        { id: -1, name: 'Все' },
        ...this.bouquetsList
          .filter(p => p.user)
          .map(p => ({ id: p.user.id, name: p.user.name })),
      ];
    },
    allClients() {
      return [
        { id: -1, name: 'Все', phone: '' },
        ...this.bouquetsList
          .filter(p => p.client)
          .map(p => ({ id: p.client.id, name: p.client.name, phone: p.client.phone })),
      ];
    },
    filteredBouquestsList() {
      let bouquetsList = this.bouquetsList;
      if (this.filterManagerStatus !== -1) {
        bouquetsList = bouquetsList.filter(
          p => p.user && p.user.id === this.filterManagerStatus
        );
      }

      if (this.filterClientStatus !== -1) {
        bouquetsList = bouquetsList.filter(
          p => p.client && p.client.id === this.filterClientStatus
        );
      }

      return bouquetsList;
    },
  },
  methods: {
    filterByManager(filter) {
      this.filterManagerStatus = filter;
    },
    filterByClient(filter) {
      this.filterClientStatus = filter;
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

    if (this.$route.query.client !== undefined) {
      this.filterClientStatus = +this.$route.query.client;
    }
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
