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
              @click="deletedItem(deletedId)"
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
                  <v-text-field
                    label="Код"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.code"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions
                  class="px-4 pb-4"
                >
                  <v-btn
                    @click.native="closeDialog()"
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
          :items="usersGroupsList"
          hide-actions
          no-data-text="Групп не найдено"
          no-results-text="Групп не найдено"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 2%;">{{ props.item.id }}</td>
            <td style="width: 45%;">{{ props.item.name }}</td>
            <td style="width: 46%;">{{ props.item.code }}</td>
            <td class="text-xs-right" style="width: 7%;">
              <v-icon
                class="mr-2"
                @click="editItem(props.item)"
              >
                edit
              </v-icon>
              <v-icon
                @click="confirmDeleted(props.item.id)"
                v-if="props.item.id !== 1"
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
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      dialogForm: false,
      usersGroupsList: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        id: 0,
        code: 0,
      },
      defaultItem: {
        name: '',
        id: 0,
        code: 0,
      },
      createdSuccess: false,
      dialogDeleted: false,
      deletedId: -1,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    formTitle: function formTitle() {
      return this.editedIndex === -1 ? 'Новая группа' : 'Изменение группы';
    },
    formAlertTitle: function formTitle() {
      return this.editedIndex === -1 ? 'Группа создана' : 'Группа изменена';
    },
  },
  methods: {
    getUsersGroupsList: function getUsersGroupsList() {
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
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsItem = Object.assign({}, this.editedItem);
        delete propsItem.id;
        propsItem.code = +propsItem.code;

        const itemParams = {
          type: 'users-groups',
          props: propsItem,
        };
        if (this.editedIndex > -1) {
          itemParams.id = this.editedItem.id;
          this.$store.dispatch('updateItem', itemParams).then(() => {
            this.createdSuccess = true;
            this.getUsersGroupsList();
            setTimeout(() => {
              this.closeDialog();
            }, 1000);
          });
        } else {
          this.$store.dispatch('addItem', itemParams).then(() => {
            this.createdSuccess = true;
            this.getUsersGroupsList();
            setTimeout(() => {
              this.closeDialog();
            }, 1000);
          });
        }
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
      this.editedIndex = this.usersGroupsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogForm = true;
    },
    confirmDeleted: function confirmDeleted(id) {
      this.dialogDeleted = true;
      this.deletedId = id;
    },
    deletedItem: function deletedItem(elemId) {
      const itemParams = {
        type: 'users-groups',
        id: elemId,
      };

      this.$store.dispatch('deleteItem', itemParams).then(() => {
        this.getUsersGroupsList();
        this.closeConfirm();
      });
    },
    closeConfirm: function closeDialog() {
      this.dialogDeleted = false;
      setTimeout(() => {
        this.deletedId = -1;
      }, 300);
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
