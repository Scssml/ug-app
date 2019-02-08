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
                  <v-select
                    label="Тип клиента"
                    :items="typeClient"
                    :rules="[v => !!v || 'Заполните поле']"
                    item-text="name"
                    item-value="id"
                    v-model="editedItem.type"
                    hide-details
                    class="mb-4"
                  ></v-select>
                  <v-text-field
                    label="Имя"
                    :rules="[v => !!v || 'Заполните поле']"
                    v-model="editedItem.name"
                  ></v-text-field>
                  <v-text-field
                    label="Телефон"
                    v-model="editedItem.phone"
                  ></v-text-field>
                  <v-menu
                    :close-on-content-click="false"
                    v-model="dataPicker"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    class="mb-4"
                  >
                    <v-text-field
                      slot="activator"
                      label="День рождения"
                      v-model="editedItem.birthDay"
                      prepend-icon="event"
                      hide-details
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="editedItem.birthDay"
                      @input="dataPicker = false"
                      no-title
                      scrollable
                      locale="ru-ru"
                      first-day-of-week="1"
                    ></v-date-picker>
                  </v-menu>
                  <!-- <v-text-field
                    label="День рождения"
                    v-model="editedItem.birthDay"
                  ></v-text-field> -->
                  <v-text-field
                    label="Счет"
                    v-model="editedItem.bill"
                    type="number"
                  ></v-text-field>
                  <v-text-field
                    label="Скидка"
                    v-model="editedItem.sale"
                    type="number"
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
          :items="clientsList"
          hide-actions
          no-data-text="Клиентов не найдено"
          no-results-text="Клиентов не найдено"
          :search="search"
          :custom-filter="customFilter"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 2%;">{{ props.item.id }}</td>
            <td style="width: 25%;">{{ props.item.name }}</td>
            <td style="width: 15%;">{{ props.item.phone }}</td>
            <td style="width: 10%;">
              {{ (findItem = typeClient.find(item => item.id === props.item.type))
                  ? findItem.name : '' }}
            </td>
            <td style="width: 10%;">{{ props.item.birthDay }}</td>
            <td class="text-xs-right" style="width: 10%;">{{ props.item.bill }}</td>
            <td class="text-xs-right" style="width: 10%;">{{ props.item.sale }}</td>
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
                @click="confirmDeleted(props.item.id)"
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
  name: 'Clients',
  data() {
    return {
      dataPicker: false,
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
      typeClient: [
        {
          id: 1,
          name: 'Физ. лицо',
        },
        {
          id: 2,
          name: 'Юр. лицо',
        },
        {
          id: 3,
          name: 'Наши',
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
      clientsList: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        id: 0,
        bill: 0,
        sale: 0,
        active: true,
        birthDay: '',
        phone: '',
        type: '',
      },
      defaultItem: {
        name: '',
        id: 0,
        bill: 0,
        sale: 0,
        active: true,
        birthDay: '',
        phone: '',
        type: '',
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
      return this.editedIndex === -1 ? 'Новый клиент' : 'Изменение клиента';
    },
    formAlertTitle: function formTitle() {
      return this.editedIndex === -1 ? 'Клиент создан' : 'Клиент изменен';
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
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsItem = Object.assign({}, this.editedItem);
        delete propsItem.id;
        delete propsItem.type;
        propsItem.bill = +propsItem.bill;
        propsItem.sale = +propsItem.sale;

        const itemParams = {
          type: 'clients',
          props: propsItem,
        };

        if (this.editedIndex > -1) {
          itemParams.id = this.editedItem.id;
          this.$store.dispatch('updateItem', itemParams).then(() => {
            this.createdSuccess = true;
            this.getClientsList();
            setTimeout(() => {
              this.closeDialog();
            }, 1000);
          });
        } else {
          this.$store.dispatch('addItem', itemParams).then(() => {
            this.createdSuccess = true;
            this.getClientsList();
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
      this.editedIndex = this.clientsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogForm = true;
    },
    confirmDeleted: function confirmDeleted(id) {
      this.dialogDeleted = true;
      this.deletedId = id;
    },
    deletedItem: function deletedItem(elemId) {
      const itemParams = {
        type: 'clients',
        id: elemId,
      };

      this.$store.dispatch('deleteItem', itemParams).then(() => {
        this.getClientsList();
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
