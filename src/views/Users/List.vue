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
              <user-edit
                v-if="Object.keys(this.editedItem).length > 0"
                :item="editedItem"
                @cancel="closeDialog()"
              ></user-edit>
              <user-change-pwd
                v-else-if="changePwdId"
                :id="changePwdId"
                @cancel="closeDialog()"
              ></user-change-pwd>
              <user-add
                v-else
                @cancel="closeDialog()"
              ></user-add>
            </template>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="usersList"
          hide-actions
          no-data-text="Пользователей не найдено"
          no-results-text="Пользователей не найдено"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.login }}</td>
            <td>{{ props.item.group.name }}</td>
            <td class="text-xs-right">
              {{ (props.item.active) ? 'Да' : 'Нет' }}
            </td>
            <td class="text-xs-right" style="width: 140px">
              <v-icon
                @click="editItem(props.item)"
                title="Изменить"
              >
                edit
              </v-icon>

              <v-icon
                class="ml-2"
                v-if="$store.getters.getAuthUserGroup.code === 'admin'"
                @click="changePwd(props.item.id)"
                title="Смена пароля"
              >
                https
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
import UserEdit from './edit.vue';
import UserAdd from './add.vue';
import UserChangePwd from './changePwd.vue';

export default {
  name: 'Users',
  components: {
    UserEdit,
    UserAdd,
    UserChangePwd,
  },
  data() {
    return {
      loadingData: [
        {
          title: 'Получение пользователей',
          error: false,
          loading: true,
          color: 'deep-orange',
          id: 'users',
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
          text: 'Пользователь',
          align: 'left',
          value: 'name',
        },
        {
          text: 'Логин',
          align: 'left',
          value: 'login',
        },
        {
          text: 'Группа',
          align: 'left',
          value: 'group.id',
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
      usersList: [],
      editedItem: {},
      changePwdId: 0,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
  },
  methods: {
    getUsersList() {
      const loadData = this.loadingData.find(item => item.id === 'users');
      const url = '/api/v1/users';

      axios
        .get(url)
        .then((response) => {
          const items = response.data;
          this.usersList = items;

          loadData.title = 'Пользователи получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения пользователей!';
          loadData.error = true;
          console.log(error);
        });
    },
    closeDialog() {
      this.getUsersList();
      this.dialogForm = false;
      this.editedItem = {};
      this.changePwdId = 0;
    },
    editItem(item) {
      this.editedItem = item;
      this.dialogForm = true;
    },
    changePwd(id) {
      this.changePwdId = +id;
      this.dialogForm = true;
    },
  },
  mounted() {
    this.getUsersList();
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
