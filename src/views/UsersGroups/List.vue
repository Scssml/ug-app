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
            <user-group-edit
              v-if="editedId"
              :id="editedId"
              @cancel="closeDialog()"
            ></user-group-edit>
            <user-group-add
              v-else
              @cancel="closeDialog()"
            ></user-group-add>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="usersGroupsList"
          hide-actions
          no-data-text="Групп не найдено"
          no-results-text="Групп не найдено"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px">{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.code }}</td>
            <td>{{ (props.item.isActive) ? 'Да' : 'Нет' }}</td>
            <td class="text-xs-right" style="width: 110px">
              <v-icon
                class="mr-2"
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
import UserGroupEdit from './edit.vue';
import UserGroupAdd from './add.vue';

export default {
  name: 'Users',
  components: {
    UserGroupEdit,
    UserGroupAdd,
  },
  data() {
    return {
      loadingData: [
        {
          title: 'Получение групп пользователей',
          error: false,
          loading: true,
          color: 'deep-purple',
          id: 'users-groups',
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
          text: 'Активность',
          align: 'left',
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
      usersGroupsList: [],
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
  },
  methods: {
    getUsersGroupsList() {
      const itemParams = {
        type: 'users-groups',
      };

      const successData = 'Группы получены!';
      const errorData = 'Ошибка получения групп!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.usersGroupsList = response;

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
      this.getUsersGroupsList();
      this.dialogForm = false;
      this.editedId = 0;
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
    },
  },
  mounted() {
    this.getUsersGroupsList();
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
