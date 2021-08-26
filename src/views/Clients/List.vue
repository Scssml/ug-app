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
    <template>
      <v-card>
        <v-card-title>
          <v-layout row wrap>
            <v-flex xs2 class="px-3">
              <v-select
                label="Тип клиента"
                :items="typeClient"
                item-text="name"
                item-value="id"
                v-model="filter.clientType"
                @change="changeFilter()"
                hide-details
              ></v-select>
            </v-flex>
          </v-layout>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialogForm"
            persistent
            max-width="420px"
          >
            <v-btn slot="activator" color="primary" dark class="mb-2"
              >Добавить</v-btn
            >
            <template v-if="dialogForm">
              <client-edit
                v-if="Object.keys(this.editedItem).length > 0"
                :item="editedItem"
                @cancel="closeDialog()"
              ></client-edit>
              <client-delete
                v-else-if="deleteId"
                :id="deleteId"
                @cancel="closeDialog()"
              ></client-delete>
              <client-add v-else @cancel="closeDialog()"></client-add>
            </template>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="clientsList"
          hide-actions
          no-data-text="Клиентов не найдено"
          no-results-text="Клиентов не найдено"
          :search="search"
          :loading="tableLoading"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">
              {{ props.item.id }}
            </td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.phone }}</td>
            <td>
              {{ typeClient.find((item) => item.id === props.item.client_type).name }}
            </td>
            <td class="text-xs-right">{{ props.item.bill }}</td>
            <td class="text-xs-right">{{ props.item.sale }}</td>
            <td class="text-xs-right">
              {{ !!props.item.active ? "Да" : "Нет" }}
            </td>
            <td class="text-xs-right" style="width: 200px;">
              <v-icon
                class="mr-2"
                @click="showOrders(props.item.id, props.item.name)"
                title="Показать заказы"
              >
                assignment
              </v-icon>
              <v-icon
                class="mr-2"
                @click="showBouquests(props.item.id, props.item.name)"
                title="Показать букеты"
              >
                local_florist
              </v-icon>
              <v-icon @click="editItem(props.item)" title="Изменить">
                edit
              </v-icon>
              <v-icon
                @click="deleteItem(props.item.id)"
                class="ml-2"
                v-if="
                  props.item.id > 0 &&
                    $store.getters.getAuthUserGroup.code === 'admin'
                "
                title="Удалить"
              >
                delete
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
              :disabled="clientsList.length < take"
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
import ClientEdit from './edit.vue';
import ClientAdd from './add.vue';
import ClientDelete from './delete.vue';

export default {
  name: 'Clients',
  components: {
    ClientEdit,
    ClientAdd,
    ClientDelete,
  },
  data() {
    return {
      loadingData: [
        {
          title: 'Получение клиентов',
          error: false,
          loading: false,
          color: 'indigo',
          id: 'clients',
        },
      ],
      filter: {
        clientType: '',
      },
      typeClient: [
        {
          id: '',
          name: 'Все',
        },
        {
          id: 'individual',
          name: 'Физ. лицо',
        },
        {
          id: 'legal',
          name: 'Юр. лицо',
        },
        {
          id: 'counter_party',
          name: 'Контрагент',
        },
        {
          id: 'our',
          name: 'Наш',
        },
      ],
      search: '',
      headersTable: [
        {
          text: 'ID',
          align: 'right',
          value: 'id',
          sortable: false,
        },
        {
          text: 'Клиент',
          align: 'left',
          value: 'name',
          sortable: false,
        },
        {
          text: 'Телефон',
          align: 'left',
          value: 'phone',
          sortable: false,
        },
        {
          text: 'Тип',
          align: 'left',
          value: 'clientType.name',
          sortable: false,
        },
        {
          text: 'Счет',
          align: 'right',
          value: 'bill',
          sortable: false,
        },
        {
          text: 'Скидка',
          align: 'right',
          value: 'sale',
          sortable: false,
        },
        {
          text: 'Активность',
          align: 'right',
          value: 'active',
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
      editedItem: {},
      clientsList: [],
      deleteId: 0,
      take: 20,
      page: 1,
      tableLoading: false,
      selectedClientType: 0,
      selectedClientName: '',
      popupMoveDebt: false,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
  },
  methods: {
    getClientsList() {
      const loadData = this.loadingData.find(item => item.id === 'clients');
      const url = 'clients';

      axios
        .get(url, {
          params: {
            page: this.page,
            page_limit: this.take,
            client_type: this.filter.clientType,
          },
        })
        .then((response) => {
          const items = response.data;
          this.clientsList = items;

          loadData.title = 'Клиенты получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения клиентов!';
          loadData.error = true;
          console.log(error);
        });
    },
    changeFilter() {
      this.page = 1;
      this.getClientsList();
    },
    closeDialog() {
      this.dialogForm = false;
      this.editedItem = {};
      this.deleteId = 0;

      this.getClientsList();
    },
    editItem(item) {
      this.editedItem = item;
      this.dialogForm = true;
    },
    deleteItem(id) {
      this.deleteId = +id;
      this.dialogForm = true;
    },
    showOrders(id, name) {
      this.$router.push({ path: `/orders/?clientId=${id}&clientName=${name}` });
    },
    showBouquests(id, name) {
      this.$router.push({
        path: `/bouquets/?clientId=${id}&clientName=${name}`,
      });
    },
    changeShowElem() {
      localStorage.setItem('countElemPage', this.take);
      this.$store.commit('setCountElemPage', this.take);
      this.page = 1;
      this.getClientsList();
    },
    prevPage() {
      this.page -= 1;
      this.getClientsList();
    },
    nextPage() {
      this.page += 1;
      this.getClientsList();
    },
  },
  mounted() {
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
