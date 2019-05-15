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
            <v-flex
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
            </v-flex>
            <v-flex
              xs2
              class="px-3"
            >
              <v-select
                label="Тип клиента"
                :items="[{id: '', name: 'Все'}].concat(typeClient)"
                item-text="name"
                item-value="id"
                v-model="filter.type"
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
            <client-edit
              v-if="editedId"
              :id="editedId"
              @cancel="closeDialog()"
            ></client-edit>
            <client-add
              v-else
              @cancel="closeDialog()"
            ></client-add>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="clientsList"
          hide-actions
          no-data-text="Клиентов не найдено"
          no-results-text="Клиентов не найдено"
          :search="search"
          :custom-filter="customFilter"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.phone }}</td>
            <td>{{ props.item.type }}</td>
            <td>{{ props.item.birthDay }}</td>
            <td class="text-xs-right">{{ props.item.bill }}</td>
            <td class="text-xs-right">{{ props.item.sale }}</td>
            <td class="text-xs-right">
              {{ (!!props.item.isActive) ? 'Да' : 'Нет' }}
            </td>
            <td class="text-xs-right" style="width: 110px;">
              <v-icon
                class="mr-2"
                @click="showOrders(props.item.id)"
              >
                assignment
              </v-icon>
              <v-icon
                @click="editItem(props.item.id)"
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
import ClientEdit from './edit.vue';
import ClientAdd from './add.vue';

export default {
  name: 'Clients',
  components: {
    ClientEdit,
    ClientAdd,
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
        type: '',
      },
      typeClient: [],
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
          value: 'name',
        },
        {
          text: 'Телефон',
          align: 'left',
          value: 'phone',
        },
        {
          text: 'Тип',
          align: 'left',
          value: 'type',
        },
        {
          text: 'День рождения',
          align: 'left',
          value: 'birthDay',
        },
        {
          text: 'Счет',
          align: 'right',
          value: 'bill',
        },
        {
          text: 'Скидка',
          align: 'right',
          value: 'sale',
        },
        {
          text: 'Активность',
          align: 'right',
          value: 'isActive',
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
      const filterProps = this.filter;
      let itemsFind = [];

      itemsFind = items.filter((item) => {
        let find = false;
        if (item.type === filterProps.type || filterProps.type === '') {
          find = true;
        }

        return find;
      });

      return itemsFind;
    },
    getClientsList: function getClientsList() {
      const itemParams = {
        type: 'clients',
      };

      const successData = 'Клиенты получены!';
      const errorData = 'Ошибка получения клиентов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.clientsList = response;

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
      }).catch(() => {
        console.log('error');
      });
    },
    closeDialog() {
      this.getClientsList();
      this.dialogForm = false;
      this.editedId = 0;
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
    },
    showOrders(id) {
      this.$router.push({ path: `/orders/?client=${id}` });
    },
  },
  mounted() {
    this.getClientsList();
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
