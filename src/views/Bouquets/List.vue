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
            max-width="1200px"
          >
            <bouquet-edit
              v-if="editedId"
              :id="editedId"
              @cancel="closeDialog()"
            ></bouquet-edit>
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
              {{ props.item.payments[0].amount }}р
              <br>{{ props.item.payments[0].creationDate }}
              <br>{{ props.item.payments[0].paymentType.name }}
            </td>
            <td class="text-xs-right" style="width: 110px;">
              <v-icon
                @click="editItem(props.item.id)"
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
import BouquetEdit from './edit.vue';

export default {
  name: 'Bouquets',
  components: {
    BouquetEdit,
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
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      dialogForm: false,
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
    getBouquetsList() {
      const itemParams = {
        type: 'bouquets',
      };

      const successData = 'Букеты получены!';
      const errorData = 'Ошибка получения букетов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.bouquetsList = response;

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
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
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
