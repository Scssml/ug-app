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
      <v-dialog
        v-model="dialogDeleted"
        persistent
        max-width="320px"
      >
        <v-card>
          <v-card-title
            class="px-4"
          >
            <span class="headline">Удалить?</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions
            class="px-4 py-3"
          >
            <v-btn
              @click.native="dialogDeleted = false"
            >Отмена</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              @click="deletedItem(deletedIndex)"
            >Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
            <v-card>
              <v-alert
                :value="createdSuccess"
                type="success"
                class="my-0"
              >
                {{ formAlertTitle }}
              </v-alert>
              <v-form
                ref="form"
                lazy-validation
              >
                <v-card-title
                  class="px-4"
                >
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text
                  class="px-4"
                >
                  <v-text-field
                    label="Имя"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.name"
                  ></v-text-field>
                  <v-select
                    label="Группы"
                    :items="usersGroupsList"
                    :rules="[v => v.length > 0 || 'Заполните поле']"
                    multiple
                    chips
                    deletable-chips
                    item-text="name"
                    item-value="id"
                    v-model="editedItem.groups"
                  ></v-select>
                  <v-checkbox
                    label="Активность"
                    v-model="editedItem.active"
                    color="primary"
                  ></v-checkbox>
                </v-card-text>
                <v-card-actions
                  class="px-4 pb-4"
                >
                  <v-btn
                    @click.native="dialogForm = false"
                  >Отмена</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="info"
                    @click="submitForm"
                  >Сохранить</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
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
            <td class="text-xs-right" style="width: 2%;">{{ props.item.id }}</td>
            <td style="width: 45%;">{{ props.item.name }}</td>
            <td style="width: 15%;">
              <template v-for="(group, index) in props.item.groups">
                {{ usersGroupsList.find(item => item.id === group).name }}
                <br :key="index">
              </template>
            </td>
            <td class="text-xs-right" style="width: 10%;">
              {{ (!!props.item.active) ? 'Да' : 'Нет' }}
            </td>
            <td class="text-xs-right" style="width: 7%;">
              <v-icon
                class="mr-2"
                @click="editItem(props.item)"
              >
                edit
              </v-icon>
              <v-icon
                @click="confirmDeleted(props.item)"
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
export default {
  name: 'Users',
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
        {
          title: 'Получение групп пользователей',
          error: false,
          loading: true,
          color: 'deep-purple',
          id: 'usersGroups',
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
          text: 'Группы',
          align: 'left',
          value: 'groups',
        },
        {
          text: 'Активность',
          align: 'right',
          value: 'active',
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
      usersGroupsList: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        id: 0,
        active: 1,
        groups: [],
      },
      defaultItem: {
        name: '',
        id: 0,
        active: 1,
        groups: [],
      },
      createdSuccess: false,
      dialogDeleted: false,
      deletedIndex: -1,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    formTitle: function formTitle() {
      return this.editedIndex === -1 ? 'Новый пользователь' : 'Изменение пользователя';
    },
    formAlertTitle: function formTitle() {
      return this.editedIndex === -1 ? 'Пользователь создан' : 'Пользователь изменен';
    },
  },
  methods: {
    getUsersList: function getUsersList() {
      this.$store.dispatch('getUsersList').then((response) => {
        this.usersList = response.usersList;

        const loadData = this.loadingData.find(item => item.id === 'users');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'users');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    getUsersGroupsList: function getUsersGroupsList() {
      this.$store.dispatch('getUsersGroupsList').then((response) => {
        this.usersGroupsList = response.usersGroupsList;

        const loadData = this.loadingData.find(item => item.id === 'usersGroups');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'usersGroups');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        if (this.editedIndex > -1) {
          Object.assign(this.usersList[this.editedIndex], this.editedItem);
        } else {
          this.usersList.push(this.editedItem);
        }

        this.createdSuccess = true;

        setTimeout(() => {
          this.closeDialog();
        }, 1000);
      }
    },
    closeDialog: function closeDialog() {
      this.dialogForm = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.createdSuccess = false;
      }, 300);
    },
    editItem: function editItem(item) {
      this.editedIndex = this.usersList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogForm = true;
    },
    confirmDeleted: function confirmDeleted(item) {
      this.dialogDeleted = true;
      this.deletedIndex = this.usersList.indexOf(item);
    },
    deletedItem: function deletedItem(index) {
      this.usersList.splice(index, 1);
      this.closeConfirm();
    },
    closeConfirm: function closeDialog() {
      this.dialogDeleted = false;
      setTimeout(() => {
        this.deletedIndex = -1;
      }, 300);
    },
  },
  mounted() {
    this.getUsersList();
    this.getUsersGroupsList();
  },
};
</script>
