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
    <template>
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
              <florist-delete
                v-else-if="deleteId"
                :id="deleteId"
                @cancel="closeDialog()"
              ></florist-delete>
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
          :pagination.sync="pagination"
          :loading="!!$apollo.queries.floristsList.loading"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.text"
                class="text-xs-left column"
                :class="[
                  'column sortable',
                  pagination.descending ? 'desc' : 'asc',
                  header.value === pagination.sortBy ? 'active' : ''
                ]"
                @click="header.sortable ? changeSort(header.value) : ''"
              >
                <v-icon small v-if="header.sortable">arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.address }}</td>
            <td>{{ props.item.phone }}</td>
            <td class="text-xs-right">
              {{ (!!props.item.active) ? 'Да' : 'Нет' }}
            </td>
            <td class="text-xs-right" style="width: 110px;">
              <v-icon
                @click="editItem(props.item.id)"
                title="Изменить"
              >
                edit
              </v-icon>

              <v-icon
                class="ml-2"
                v-if="$store.getters.getAuthUserGroup.code === 'admin'"
                @click="deleteItem(props.item.id)"
                title="Удалить"
              >
                delete
              </v-icon>
            </td>
          </template>
        </v-data-table>
        <v-layout row wrap justify-space-around class="py-2">
          <v-flex xs2 class="px-3">
            <v-text-field
              label="Количество на странице"
              v-model.number="take"
              hide-details
              @change="changeShowElem()"
            ></v-text-field>
          </v-flex>
          <v-flex xs10 class="text-xs-right px-3">
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
              :disabled="floristsList.length < take"
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
import FloristEdit from './edit.vue';
import FloristAdd from './add.vue';
import FloristDelete from './delete.vue';
import gql from "graphql-tag";

export default {
  name: 'Florists',
  components: {
    FloristEdit,
    FloristAdd,
    FloristDelete,
  },
  data() {
    return {
      loadingData: [
        {
          title: 'Получение флористов',
          error: false,
          loading: false,
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
      deleteId: 0,
      take: 20,
      page: 0,
      pagination: {
        sortBy: 'id',
        rowsPerPage: -1,
        descending: true,
      },
    };
  },
  apollo: {
    floristsList: {
      query: gql`
        query FloristsList(
          $limit: Int
          $offset: Int
          $orderBy: [florists_order_by!]
        ) {
          floristsList: florists(
            order_by: $orderBy
            limit: $limit
            offset: $offset
          ) {
            id
            active
            address
            name
            phone
          }
        }
      `,
      variables() {
        return {
          offset: this.page * this.take,
          limit: this.take,
          orderBy: this.orderBy
        };
      }
    },
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
    orderBy() {
      const sortFields = this.pagination.sortBy.split(".");
      let sortObject = {};
      const sortOrder = this.pagination.descending
        ? "desc_nulls_last"
        : "asc_nulls_last";

      if (sortFields.length === 3) {
        sortObject = {
          [sortFields[0]]: {
            [sortFields[1]]: {
              [sortFields[2]]: sortOrder
            }
          }
        };
      } else if (sortFields.length === 2) {
        sortObject = {
          [sortFields[0]]: {
            [sortFields[1]]: sortOrder
          }
        };
      } else {
        sortObject[sortFields[0]] = sortOrder;
      }

      return sortObject;
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
    changeShowElem() {
      localStorage.setItem("countElemPage", this.take);
      this.$store.commit("setCountElemPage", this.take);
      this.page = 0;
    },
    prevPage() {
      this.page -= 1;
    },
    nextPage() {
      this.page += 1;
    },
    changeSort(column) {
      this.floristsList = [];
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
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
