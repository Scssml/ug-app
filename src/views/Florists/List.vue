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
              <florist-edit
                v-if="editedId"
                :id="editedId"
                @cancel="closeDialog()"
              ></florist-edit>
              <florist-add
                v-else
                @cancel="closeDialog()"
              ></florist-add>
            </template>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="floristsList"
          hide-actions
          no-data-text="Флористов не найдено"
          no-results-text="Флористов не найдено"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.address }}</td>
            <td>{{ props.item.phone }}</td>
            <td class="text-xs-right">
              {{ (!!props.item.isActive) ? 'Да' : 'Нет' }}
            </td>
            <td class="text-xs-right" style="width: 110px;">
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
import FloristEdit from './edit.vue';
import FloristAdd from './add.vue';

export default {
  name: 'Florists',
  components: {
    FloristEdit,
    FloristAdd,
  },
  data() {
    return {
      loadingData: [
        {
          title: 'Получение флористов',
          error: false,
          loading: true,
          color: 'cyan',
          id: 'florists',
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
          text: 'Флорист',
          align: 'left',
          value: 'name',
        },
        {
          text: 'Адрес',
          align: 'left',
          value: 'address',
        },
        {
          text: 'Телефон',
          align: 'left',
          value: 'phone',
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
      editedId: 0,
      floristsList: [],
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
  },
  methods: {
    getFloristsList: function getFloristsList() {
      const itemParams = {
        type: 'florists',
      };

      const successData = 'Флористы получены!';
      const errorData = 'Ошибка получения флористов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.floristsList = response;

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
      this.getFloristsList();
      this.dialogForm = false;
      this.editedId = 0;
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
    },
  },
  mounted() {
    this.getFloristsList();
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
