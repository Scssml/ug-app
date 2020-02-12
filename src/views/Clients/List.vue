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
          <v-layout
            row
            wrap
          >
            <!-- <v-flex
              xs4
              class="px-3"
            >
              <v-text-field
                v-model="search"
                prepend-icon="search"
                label="Поиск"
                single-line
                hide-details
              ></v-text-field>
            </v-flex> -->
            <v-flex
              xs2
              class="px-3"
            >
              <v-select
                label="Тип клиента"
                :items="[{id: '', name: 'Все'}].concat(typeClient)"
                item-text="name"
                item-value="id"
                v-model="filter.typeId"
                @change="customFilter()"
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
            <v-btn slot="activator" color="primary" dark class="mb-2">Добавить</v-btn>
            <template
              v-if="dialogForm"
            >
              <client-edit
                v-if="editedId"
                :id="editedId"
                @cancel="closeDialog()"
              ></client-edit>
              <client-delete
                v-else-if="deleteId"
                :id="deleteId"
                @cancel="closeDialog()"
              ></client-delete>
              <client-add
                v-else
                @cancel="closeDialog()"
              ></client-add>
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
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.phone }}</td>
            <td>
              {{ props.item.typeName }}
            </td>
            <td>
              <template v-for="(item, index) in props.item.responsible">
                <p :key="index">
                  {{ item.name }}
                  <br>{{ item.phone }}
                </p>
              </template>
            </td>
            <td class="text-xs-right">{{ props.item.bill }}</td>
            <td class="text-xs-right">{{ props.item.discountPercent }}</td>
            <td class="text-xs-right">
              {{ (!!props.item.isActive) ? 'Да' : 'Нет' }}
            </td>
            <td class="text-xs-right" style="width: 170px;">
              <v-icon
                class="mr-2"
                @click="showOrders(props.item.id)"
                title="Показать заказы"
              >
                assignment
              </v-icon>
              <v-icon
                class="mr-2"
                @click="showBouquests(props.item.id)"
                title="Показать букеты"
              >
                local_florist
              </v-icon>
              <v-icon
                @click="editItem(props.item.id)"
                title="Изменить"
              >
                edit
              </v-icon>
              <v-icon
                @click="deleteItem(props.item.id)"
                class="ml-2"
                v-if="props.item.id > 0 && $store.getters.getAuthUserGroup.code === 'admin'"
                title="Удалить"
              >
                delete
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
          loading: true,
          color: 'indigo',
          id: 'clients',
        },
      ],
      filter: {
        typeId: '',
      },
      typeClient: [],
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
          value: 'name',
          sortable: true,
        },
        {
          text: 'Телефон',
          align: 'left',
          value: 'phone',
        },
        {
          text: 'Тип',
          align: 'left',
          value: 'typeId',
          sortable: true,
        },
        {
          text: 'Ответственный',
          align: 'left',
          value: 'responsible',
          sortable: false,
        },
        {
          text: 'Счет',
          align: 'right',
          value: 'bill',
          sortable: true,
        },
        {
          text: 'Скидка',
          align: 'right',
          value: 'sale',
          sortable: true,
        },
        {
          text: 'Активность',
          align: 'right',
          value: 'isActive',
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
      editedId: 0,
      clientsList: [],
      deleteId: 0,
      pagination: {
        rowsPerPage: -1,
        sortBy: 'name',
        descending: false,
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
  },
  methods: {
    customFilter: function customFilter(items) {
      // const filterProps = this.filter;
      // let itemsFind = [];

      // itemsFind = items.filter((item) => {
      //   let find = false;
      //   if (item.type === filterProps.type || filterProps.type === '') {
      //     find = true;
      //   }

      //   return find;
      // });

      // return itemsFind;

      this.page = 0;
      this.getClientsList();
    },
    getClientsList: function getClientsList(loading = true) {
      if (loading) {
        this.tableLoading = true;
        this.clientsList = [];
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
        type: 'clients',
        sort: sortSettings,
        filter: orderFilter,
        skip: this.page * this.take,
        take: this.take,
      };

      const successData = 'Клиенты получены!';
      const errorData = 'Ошибка получения клиентов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.clientsList = response.map((item, index, clients) => {
          const elem = Object.assign({}, item);
          const itemTypeClient = this.typeClient.find(client => client.id === elem.type);
          elem.typeName = (itemTypeClient) ? itemTypeClient.name : '-';

          elem.responsible = [];
          if (elem.id !== 0) {
            elem.responsible = clients.filter(client => +client.referenceId === elem.id);
          }
          return elem;
        });
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
    getClientTypeList() {
      const itemParams = {
        type: 'client-type',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.typeClient = response.map((item) => {
          item.id = +item.id;
          return item;
        });
        this.getClientsList();
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

      this.getClientsList();
    },
    closeDialog() {
      this.getClientsList();
      this.dialogForm = false;
      this.editedId = 0;
      this.deleteId = 0;
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
    },
    deleteItem(id) {
      this.deleteId = +id;
      this.dialogForm = true;
    },
    showOrders(id) {
      this.$router.push({ path: `/orders/?client=${id}` });
    },
    showBouquests(id) {
      this.$router.push({ path: `/bouquets/?client=${id}` });
    },
    changeShowElem() {
      localStorage.setItem('countElemPage', this.take);
      this.$store.commit('setCountElemPage', this.take);
      this.page = 0;
      this.getClientTypeList();
    },
    prevPage() {
      this.page -= 1;
      this.getClientTypeList();
    },
    nextPage() {
      this.page += 1;
      this.getClientTypeList();
    },
  },
  mounted() {
    this.getClientTypeList();
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
