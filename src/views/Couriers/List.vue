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
            max-width="420px"
          >
            <v-btn slot="activator" color="primary" dark class="mb-2">Добавить</v-btn>
            <template
              v-if="dialogForm"
            >
              <courier-edit
                v-if="editedId"
                :id="editedId"
                @cancel="closeDialog()"
              ></courier-edit>
              <courier-delete
                v-else-if="deleteId"
                :id="deleteId"
                @cancel="closeDialog()"
              ></courier-delete>
              <courier-add
                v-else
                @cancel="closeDialog()"
              ></courier-add>
            </template>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="couriersList"
          hide-actions
          no-data-text="Курьеров не найдено"
          no-results-text="Курьеров не найдено"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">
              {{ (!!props.item.isActive) ? 'Да' : 'Нет' }}
            </td>
            <td class="text-xs-right" style="width: 110px;">
              <v-icon
                @click="editItem(props.item.id)"
              >
                edit
              </v-icon>

              <v-icon
                class="ml-2"
                v-if="$store.getters.getAuthUserGroup.code === 'admin'"
                @click="deleteItem(props.item.id)"
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
import CourierEdit from './edit.vue';
import CourierAdd from './add.vue';
import CourierDelete from './delete.vue';

export default {
  name: 'Couriers',
  components: {
    CourierEdit,
    CourierAdd,
    CourierDelete,
  },
  data() {
    return {
      loadingData: [
        {
          title: 'Получение курьеров',
          error: false,
          loading: true,
          color: 'cyan',
          id: 'couriers',
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
          text: 'Курьер',
          align: 'left',
          value: 'name',
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
      couriersList: [],
      deleteId: 0,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
  },
  methods: {
    getCouriersList: function getCouriersList() {
      const itemParams = {
        type: 'users',
        filter: {
          group: 4,
        },
      };

      const successData = 'Курьеры получены!';
      const errorData = 'Ошибка получения курьеров!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.couriersList = response;

        const loadData = this.loadingData.find(item => item.id === 'couriers');
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === 'couriers');
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    closeDialog() {
      this.getCouriersList();
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
  },
  mounted() {
    this.getCouriersList();
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
