<template>
  <v-container fluid class="pa-0">
    <v-dialog :value="loadingDialog" persistent max-width="320px">
      <v-list>
        <v-list-tile
          v-for="(item, index) in loadingData"
          :key="index"
          avatar
          :color="item.error ? 'red' : item.color"
        >
          <v-list-tile-avatar>
            <v-progress-circular
              :value="100"
              :size="30"
              :color="item.error ? 'red' : item.color"
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
          <v-layout row wrap>
            <v-flex xs2 class="px-3">
              <v-select
                label="Тип клиента"
                :items="[{ id: 0, name: 'Все' }].concat(typeClient)"
                item-text="name"
                item-value="id"
                v-model="filter.typeId"
                @change="handleClientTypeChange($event)"
                hide-details
              ></v-select>
            </v-flex>
            <v-flex
              xs4
              class="px-3"
            >
              <v-text-field
                label="Имя"
                v-model="filter.name"
                hide-details
                @change="handleClientNameChange($event)"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-spacer></v-spacer>

          <v-dialog
            v-model="dialogForm"
            persistent max-width="420px"
            :fullscreen="(printedId >= 0 && printedId !== null) ? true : false"
          >
            <v-btn slot="activator" color="primary" dark class="mb-2"
              >Добавить</v-btn
            >
            <template v-if="dialogForm">
              <client-print
                v-if="printedId >= 0 && printedId !== null"
                :id="printedId"
                :name="clientsList.find(item => item.id === printedId)['name']"
                @cancel="closeDialog()"
              ></client-print>
              <client-edit
                v-else-if="editedId"
                :id="editedId"
                @cancel="closeDialog()"
              ></client-edit>
              <client-delete
                v-else-if="deleteId"
                :id="deleteId"
                @cancel="closeDialog()"
              ></client-delete>
              <client-add v-else @cancel="closeDialog()"></client-add>
            </template>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="clientsList"
          hide-actions
          no-data-text="Клиентов не найдено"
          no-results-text="Клиентов не найдено"
          :search="search"
          :pagination.sync="pagination"
          :loading="!!$apollo.queries.clientsList.loading"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.text"
                class="text-xs-left column"
                :class="[
                  'column sortable', pagination.descending ? 'desc' : 'asc',
                  header.value === pagination.sortBy ? 'active' : ''
                ]"
                @click="(header.sortable) ? changeSort(header.value) : ''"
              >
                <v-icon
                  small
                  v-if="header.sortable"
                >arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">
              {{ props.item.id }}
            </td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.phone }}</td>
            <td>
              {{ props.item.clientType.name }}
            </td>
            <td>
              <template v-for="(item, index) in props.item.responsible">
                <p :key="index">
                  {{ item.name }}
                  <br />{{ item.phone }}
                </p>
              </template>
            </td>
            <td class="text-xs-right">{{ props.item.bill }}</td>
            <td class="text-xs-right">{{ props.item.discountPercent }}</td>
            <td class="text-xs-right">
              {{ !!props.item.active ? "Да" : "Нет" }}
            </td>
            <td class="text-xs-right" style="width: 200px;">
              <v-icon
                class="mr-2"
                @click="showOrders(props.item.id, props.item.name)"
                title="Показать заказы"
              >
                assignment
              </v-icon>
              <v-icon
                class="mr-2"
                @click="printedItem(props.item.id)"
                title="Акт сверки"
              >
                insert_drive_file
              </v-icon>
              <v-icon
                class="mr-2"
                @click="showBouquests(props.item.id, props.item.name)"
                title="Показать букеты"
              >
                local_florist
              </v-icon>
              <v-icon @click="editItem(props.item.id)" title="Изменить">
                edit
              </v-icon>
              <v-icon
                @click="deleteItem(props.item.id)"
                class="ml-2"
                v-if="
                  props.item.id > 0 &&
                    $store.getters.getAuthUserGroup.code === 'admin'
                "
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
              :disabled="clientsList.length < take"
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
import ClientEdit from './edit.vue';
import ClientAdd from './add.vue';
import ClientDelete from './delete.vue';
import ClientPrint from './printAct.vue';
import gql from 'graphql-tag';

export default {
  name: 'Clients',
  components: {
    ClientEdit,
    ClientAdd,
    ClientDelete,
    ClientPrint,
  },
  data() {
    return {
      loadingData: [
        {
          title: 'Получение клиентов',
          error: false,
          loading: false,
          color: 'indigo',
          id: 'clients',
        },
      ],
      filter: {
        typeId: 0,
      },
      typeClient: [],
      search: '',
      headersTable: [
        {
          text: 'ID',
          align: 'right',
          value: 'id',
          sortable: true,
        },
        {
          text: 'Клиент',
          align: 'left',
          value: 'name',
          sortable: true,
        },
        {
          text: 'Телефон',
          align: 'left',
          value: 'phone',
          sortable: true,
        },
        {
          text: 'Тип',
          align: 'left',
          value: 'clientType.name',
          sortable: true,
        },
        {
          text: 'Ответственный',
          align: 'left',
          value: 'responsible.name',
          sortable: true,
        },
        {
          text: 'Счет',
          align: 'right',
          value: 'bill',
          sortable: true,
        },
        {
          text: 'Скидка',
          align: 'right',
          value: 'sale',
          sortable: true,
        },
        {
          text: 'Активность',
          align: 'right',
          value: 'active',
          sortable: true,
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
      deleteId: 0,
      printedId: null,
      pagination: {
        sortBy: 'id',
        rowsPerPage: -1,
        descending: true,
      },
      take: 20,
      page: 0,
      tableLoading: false,
      selectedClientType: 0,
      selectedClientName: '',
    };
  },
  apollo: {
    clientsList: {
      query: gql`
        query ClientsList(
          $clientTypeId: bigint,
          $clientName: String,
          $limit: Int,
          $offset: Int,
          $orderBy: [clients_order_by!],
        ) {
          clientsList: clients(
            order_by: $orderBy
            limit: $limit
            offset: $offset
            where: {
              clientType: {
                id: {
                  _eq: $clientTypeId
                }
              },
              name: {
                _ilike: $clientName
              }
            }
          ) {
            id
            name
            phone
            address
            birthDay
            floor
            flat
            entrance
            clientType {
              id
              name
            }
            responsible {
              id
              name
              phone
            }
            bill
            discountPercent: sale
            active
          }
        }
      `,
      variables() {
        return {
          clientTypeId:
            this.selectedClientType !== 0 ? this.selectedClientType : undefined,
          clientName:
            this.selectedClientName !== '' ? `%${this.selectedClientName}%` : undefined,
          offset: this.page * this.take,
          limit: this.take,
          orderBy: this.orderBy,
        };
      },
    },
    typeClient: {
      query: gql`
        query {
          typeClient: clientTypes {
            id
            name
          }
        }
      `,
    },
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    orderBy() {
      const sortFields = this.pagination.sortBy.split('.');
      let sortObject = {};
      const sortOrder = this.pagination.descending ? 'desc_nulls_last' : 'asc_nulls_last';

      if (sortFields.length === 3) {
        sortObject = {
          [sortFields[0]]: {
            [sortFields[1]]: {
              [sortFields[2]]: sortOrder,
            },
          },
        };
      } else if (sortFields.length === 2) {
        sortObject = {
          [sortFields[0]]: {
            [sortFields[1]]: sortOrder,
          },
        };
      } else {
        sortObject[sortFields[0]] = sortOrder;
      }

      return sortObject;
    },
  },
  methods: {
    changeSort(column) {
      this.clientsList = [];
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    handleClientTypeChange(clientTypeId) {
      this.selectedClientType = clientTypeId !== 0 ? clientTypeId : undefined;
      this.page = 0;
    },
    handleClientNameChange(clientName) {
      this.selectedClientName = clientName !== '' ? clientName : '';
      this.page = 0;
    },
    closeDialog() {
      this.dialogForm = false;
      this.editedId = 0;
      this.deleteId = 0;
      this.printedId = null;
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
    },
    deleteItem(id) {
      this.deleteId = +id;
      this.dialogForm = true;
    },
    printedItem(id) {
      this.printedId = +id;
      this.dialogForm = true;
    },
    showOrders(id, name) {
      this.$router.push({ path: `/orders/?clientId=${id}&clientName=${name}` });
    },
    showBouquests(id, name) {
      this.$router.push({ path: `/bouquets/?clientId=${id}&clientName=${name}` });
    },
    changeShowElem() {
      localStorage.setItem('countElemPage', this.take);
      this.$store.commit('setCountElemPage', this.take);
      this.page = 0;
    },
    prevPage() {
      this.page -= 1;
    },
    nextPage() {
      this.page += 1;
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
