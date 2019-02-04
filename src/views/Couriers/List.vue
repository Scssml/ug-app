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
          :items="couriersList"
          hide-actions
          no-data-text="Курьеров не найдено"
          no-results-text="Курьеров не найдено"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 2%;">{{ props.item.id }}</td>
            <td style="width: 60%;">{{ props.item.name }}</td>
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
import axios from 'axios';

export default {
  name: 'Couriers',
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
      couriersList: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        id: 0,
        active: true,
      },
      defaultItem: {
        name: '',
        id: 0,
        active: true,
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
      return this.editedIndex === -1 ? 'Новый курьер' : 'Изменение курьера';
    },
    formAlertTitle: function formTitle() {
      return this.editedIndex === -1 ? 'Курьер создан' : 'Курьер изменен';
    },
  },
  methods: {
    getCouriersList: function getCouriersList() {
      this.$store.dispatch('getCouriersList').then((response) => {
        this.couriersList = response.couriersList;

        const loadData = this.loadingData.find(item => item.id === 'couriers');
        loadData.title = response.successData.text;
        loadData.loading = false;
      }).catch((error) => {
        const loadData = this.loadingData.find(item => item.id === 'couriers');
        loadData.title = error.text;
        loadData.error = true;
      });
    },
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      let apiPath = '';
      if (validate) {
        if (this.editedIndex > -1) {
          Object.assign(this.couriersList[this.editedIndex], this.editedItem);
          apiPath = 'edit.php';
        } else {
          if (this.couriersList.length > 0) {
            this.editedItem.id = this.couriersList[this.couriersList.length - 1].id + 1;
          } else {
            this.editedItem.id = 1;
          }

          this.couriersList.push(this.editedItem);

          apiPath = 'add.php';
        }

        axios.get(`${this.$store.state.apiSrc}couriers/${apiPath}`, {
          params: {
            INDEX: this.editedIndex,
            ELEM: this.editedItem,
          },
        }).then(() => {
          this.createdSuccess = true;
          setTimeout(() => {
            this.closeDialog();
          }, 1000);
        });
        // localStorage.setItem('couriers', JSON.stringify(this.couriersList));
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
      this.editedIndex = this.couriersList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogForm = true;
    },
    confirmDeleted: function confirmDeleted(item) {
      this.dialogDeleted = true;
      this.deletedIndex = this.couriersList.indexOf(item);
    },
    deletedItem: function deletedItem(index) {
      this.couriersList.splice(index, 1);

      axios.get(`${this.$store.state.apiSrc}couriers/delete.php`, {
        params: {
          INDEX: index,
        },
      }).then(() => {
        this.closeConfirm();
      });

      // localStorage.setItem('couriers', JSON.stringify(this.couriersList));
    },
    closeConfirm: function closeDialog() {
      this.dialogDeleted = false;
      setTimeout(() => {
        this.deletedIndex = -1;
      }, 300);
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
