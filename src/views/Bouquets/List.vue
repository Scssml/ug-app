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
    <template v-if="!loadingDialog">
      <v-card>
        <v-card-title>
          <v-flex>
            <v-layout row wrap>
              <!-- <v-text-field
                v-model="search"
                prepend-icon="search"
                label="Поиск"
                single-line
                hide-details
              ></v-text-field> -->

              <!-- <v-flex
                xs2
                class="px-2"
              >
                <v-menu
                  :close-on-content-click="false"
                  v-model="dataStartPicker"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата (с)"
                    v-model="filter.dateStart"
                    prepend-icon="event"
                    hide-details
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="filter.dateStart"
                    @input="dataStartPicker = false"
                    no-title
                    scrollable
                    locale="ru-ru"
                    first-day-of-week="1"
                    :max="(!!filter.dateEnd) ? filter.dateEnd : undefined"
                    @change="customFilter()"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex
                xs2
                class="px-2"
              >
                <v-menu
                  :close-on-content-click="false"
                  v-model="dataEndPicker"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата (по)"
                    v-model="filter.dateEnd"
                    prepend-icon="event"
                    hide-details
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="filter.dateEnd"
                    @input="dataEndPicker = false"
                    no-title
                    locale="ru-ru"
                    scrollable
                    first-day-of-week="1"
                    :min="(!!filter.dateStart) ? filter.dateStart : undefined"
                    @change="customFilter()"
                  ></v-date-picker>
                </v-menu>
              </v-flex> -->

              <v-flex xs2 class="px-2">
                <v-select
                  label="Тип"
                  :items="[{ id: 0, name: 'Все' }].concat(paymentTypes)"
                  item-text="name"
                  item-value="id"
                  v-model="filter.paymentType"
                  hide-details
                ></v-select>
              </v-flex>

              <v-flex xs2 class="px-2">
                <v-menu
                  :close-on-content-click="false"
                  v-model="dataStartPicker"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата (с)"
                    v-model="filter.dateStart"
                    prepend-icon="event"
                    hide-details
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="filter.dateStart"
                    @input="dataStartPicker = false"
                    no-title
                    scrollable
                    locale="ru-ru"
                    first-day-of-week="1"
                    :max="!!filter.dateEnd ? filter.dateEnd : undefined"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs2 class="px-2">
                <v-menu
                  :close-on-content-click="false"
                  v-model="dataEndPicker"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Дата (по)"
                    v-model="filter.dateEnd"
                    prepend-icon="event"
                    hide-details
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="filter.dateEnd"
                    @input="dataEndPicker = false"
                    no-title
                    locale="ru-ru"
                    scrollable
                    first-day-of-week="1"
                    :min="!!filter.dateStart ? filter.dateStart : undefined"
                  ></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs2 class="px-2">
                <v-select
                  label="Менеджер"
                  :items="[{ id: 0, name: 'Все' }].concat(usersList)"
                  item-text="name"
                  item-value="id"
                  v-model="filter.user"
                  hide-details
                  @change="handleManagerChange($event)"
                ></v-select>
              </v-flex>

              <v-flex xs3 class="px-2">
                <autosuggest
                  :suggestions="suggestions"
                  placeholder="Клиенты"
                  :value="client.name"
                  @onChange="onInputChange"
                  @onSelect="onSelected"
                  class="mt-3 view-filter"
                />
                <!-- <v-autocomplete
                  label="Клиент"
                  :items="
                    [{ id: 0, name: 'Все', phone: '' }].concat(clientsList)
                  "
                  :filter="clientsFilter"
                  item-text="name"
                  item-value="id"
                  v-model="filter.client"
                  hide-details
                  class="mb-4"
                  no-data-text="Не надено"
                  @change="handleClientChange($event)"
                ></v-autocomplete> -->
              </v-flex>
            </v-layout>
          </v-flex>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialogForm"
            persistent
            :max-width="editDialog ? '1200px' : '420px'"
          >
            <bouquet-edit
              v-if="editedId && editDialog"
              :bouquet="bouquetsList.find(item => item.id === editedId)"
              @cancel="closeDialog()"
            ></bouquet-edit>

            <bouquet-cancel
              v-if="editedId && cancelDialog"
              :id="editedId"
              @cancel="closeDialog()"
            ></bouquet-cancel>
          </v-dialog>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="bouquetsList"
          :disable-initial-sort="true"
          hide-actions
          no-data-text="Букетов не найдено"
          no-results-text="Букетов не найдено"
          :search="search"
          :pagination.sync="pagination"
          :loading="!!$apollo.queries.bouquetsList.loading"
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
            <td class="text-xs-right" style="width: 30px;">
              {{ props.item.id }}
            </td>
            <td>
              {{ props.item.client.name }}
              <br />{{ props.item.client.phone }}
              <template v-if="props.item.orderId">
                <br />Заказ: {{ props.item.orderId }}
              </template>
            </td>
            <td>{{ props.item.florist ? props.item.florist.name : "" }}</td>
            <td>{{ props.item.user.name }}</td>
            <td>
              {{
                props.item.payments.reduce((acc, item) => {
                  return acc + +item.amount;
                }, 0)
              }}р <br />{{
                new Date(
                  props.item.payments[
                    props.item.payments.length - 1
                  ].creationDate
                ).toLocaleString()
              }}
              <br />{{
                props.item.payments.map(p => p.paymentType.name).join(", ")
              }}
            </td>
            <td class="text-xs-right" style="width: 160px;">
              <v-btn
                flat
                icon
                :to="`/print/bouquet/receipt/${props.item.id}/`"
                target="_blank"
                class="mx-0"
                title="Печать"
              >
                <v-icon>insert_drive_file</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                @click="editItem(props.item.id)"
                class="mx-0"
                title="Просмотр"
              >
                <v-icon>visibility</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                @click="cancelItem(props.item.id)"
                v-if="
                  props.item.payments.every(item => item.paymentType.id !== 7)
                "
                class="mx-0"
                title="Возврат"
              >
                <v-icon>delete</v-icon>
              </v-btn>
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
              :disabled="bouquetsList.length < take"
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
import BouquetEdit from "./edit.vue";
import BouquetCancel from "./cancel.vue";
import Autosuggest from "../../components/Autosuggest";
import gql from "graphql-tag";

export default {
  name: "Bouquets",
  components: {
    BouquetEdit,
    BouquetCancel,
    Autosuggest
  },
  data() {
    return {
      loadingData: [
        {
          title: "Получение букетов",
          error: false,
          loading: false,
          color: "cyan",
          id: "bouquets"
        }
      ],
      filter: {
        user: 0,
        clientId: "",
        dateStart: undefined,
        dateEnd: undefined,
        paymentType: 0
      },
      search: "",
      headersTable: [
        {
          text: "ID",
          align: "right",
          value: "id",
          sortable: true
        },
        {
          text: "Клиент",
          align: "left",
          value: "client.name",
          sortable: true
        },
        {
          text: "Флорист",
          align: "left",
          value: "florist.name",
          sortable: true
        },
        {
          text: "Менеджер",
          align: "left",
          value: "user.name",
          sortable: true
        },
        {
          text: "Оплата",
          align: "left",
          value: "payments.amount",
          sortable: false
        },
        {
          text: "",
          align: "right",
          sortable: false,
          value: "action"
        }
      ],
      dialogForm: false,
      editDialog: false,
      cancelDialog: false,
      editedId: 0,
      bouquetsList: [],
      usersList: [],
      clientsList: [],
      pagination: {
        sortBy: "id",
        rowsPerPage: -1,
        descending: true
      },
      take: 20,
      page: 0,
      tableLoading: false,
      selectedClientId: 0,
      selectedManagerId: 0,
      client: {},
      queryName: "",
      skipClientsQuery: true,
      suggestions: [],
      dataStartPicker: false,
      dataEndPicker: false
    };
  },
  apollo: {
    bouquetsList: {
      query: gql`
        query BouquetsList(
          $clientId: bigint
          $selectedManagerId: bigint
          $paymentTypeId: bigint
          $startDate: timestamptz
          $endDate: timestamptz
          $limit: Int
          $offset: Int
          $orderBy: [bouquets_order_by!]
        ) {
          bouquetsList: bouquets(
            order_by: $orderBy
            limit: $limit
            offset: $offset
            where: {
              _and: [
                { clientId: { _eq: $clientId } }
                { user: { id: { _eq: $selectedManagerId } } }
                { payments: { paymentTypeId: { _eq: $paymentTypeId } } }
                { created_at: { _gte: $startDate } }
                { created_at: { _lte: $endDate } }
              ]
            }
          ) {
            id
            decorCost
            decorPercent
            sumSale
            salePercent
            deliveryCost
            comment
            client {
              id
              name
              phone
            }
            orderBouquet {
              name
              count
              order {
                id
              }
            }
            florist {
              name
            }
            user {
              id
              name
            }
            payments {
              amount
              creationDate: creation_date
              paymentType {
                name
              }
            }
            goods: bouquetGoodsMappings {
              good {
                name
                price
              }
              count: goodsCount
            }
          }
        }
      `,
      variables() {
        return {
          selectedManagerId:
            this.selectedManagerId !== 0 ? this.selectedManagerId : undefined,
          clientId:
            this.filter.clientId >= 0 && this.filter.clientId !== ""
              ? this.filter.clientId
              : undefined,
          paymentTypeId:
            this.filter.paymentType !== 0 ? this.filter.paymentType : undefined,
          startDate: this.filter.dateStart
            ? `${this.filter.dateStart} 00:00:00`
            : undefined,
          endDate: this.filter.dateEnd
            ? `${this.filter.dateEnd} 23:59:59`
            : undefined,
          offset: this.page * this.take,
          limit: this.take,
          orderBy: this.orderBy
        };
      }
    },
    paymentTypes: {
      query: gql`
        query {
          paymentTypes: paymentTypes(where: { active: { _eq: true } }) {
            id
            name
          }
        }
      `
    },
    clientsList: {
      query: gql`
        query ClientsList($name: String) {
          clientsList: clients(
            where: {
              _or: [{ name: { _ilike: $name } }, { phone: { _ilike: $name } }]
            }
            limit: 50
          ) {
            id
            name
            type: clientType {
              id
            }
            discountPercent: sale
          }
        }
      `,
      update({ clientsList: data }) {
        this.suggestions = [{ data }];

        return data;
      },
      variables() {
        return {
          name: this.queryName
        };
      },
      skip() {
        return this.skipClientsQuery;
      }
    },
    usersList: {
      query: gql`
        query {
          usersList: users(
            where: { _or: [{ groupId: { _eq: 1 } }, { groupId: { _eq: 2 } }] }
          ) {
            id
            name
          }
        }
      `
    }
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(
        item => !item.error && !item.loading
      );
      return loadData.length === this.loadingData.length ? 0 : 1;
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
    }
  },
  methods: {
    changeSort(column) {
      this.bouquetsList = [];
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    onSelected(item) {
      this.client = item;
      this.filter.clientId = item.id;
    },
    onInputChange(text) {
      this.queryName = `%${text}%`;
      this.skipClientsQuery = false;

      if (text === "") {
        this.filter.clientId = "";
      }
    },
    handleManagerChange(managerId) {
      this.selectedManagerId = managerId !== 0 ? managerId : undefined;
      this.page = 0;
    },
    customFilter: function customFilter() {
      this.page = 0;
      this.getBouquetsList();
    },
    printDoc(id) {
      const { protocol, hostname } = window.location;
      const url = `${protocol}//${hostname}/print/bouquet/${id}/receipt`;
      window.open(url, "_blank");
    },
    getBouquetsList(loading = true) {
      if (loading) {
        this.tableLoading = true;
        this.bouquetsList = [];
      }

      const orderFilter = {
        created_at: []
      };

      Object.keys(this.filter).forEach(key => {
        const val = this.filter[key];

        if (val) {
          if (key === "dateStart") {
            orderFilter.created_at[0] = `${val} 00:00:00`;
          } else if (key === "dateEnd") {
            orderFilter.created_at[1] = `${val} 23:59:59`;
          } else {
            orderFilter[key] = val;
          }
        }
      });

      const sortSettings = {};
      sortSettings[this.pagination.sortBy] = this.pagination.descending
        ? "desc"
        : "asc";

      const itemParams = {
        type: "bouquets",
        sort: {
          id: "desc"
        },
        filter: orderFilter,
        skip: this.page * this.take,
        take: this.take
      };

      const successData = "Букеты получены!";
      const errorData = "Ошибка получения букетов!";

      this.$store
        .dispatch("getItemsList", itemParams)
        .then(response => {
          this.bouquetsList = response;
          this.tableLoading = false;

          const loadData = this.loadingData.find(
            item => item.id === itemParams.type
          );
          loadData.title = successData;
          loadData.loading = false;
        })
        .catch(() => {
          const loadData = this.loadingData.find(
            item => item.id === itemParams.type
          );
          loadData.title = errorData;
          loadData.error = true;
        });
    },
    getUsersList() {
      const itemParams = {
        type: "users",
        filter: {
          active: true,
          group: [1, 2]
        }
      };

      this.$store
        .dispatch("getItemsList", itemParams)
        .then(response => {
          this.usersList = response;
        })
        .catch(() => {
          console.log("error");
        });
    },
    closeDialog() {
      this.dialogForm = false;
      this.editedId = 0;
      this.cancelDialog = false;
      this.editDialog = false;
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
      this.editDialog = true;
    },
    cancelItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
      this.cancelDialog = true;
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
    }
  },
  mounted() {
    const date = new Date();
    const dateEnd = date.toISOString().split("T")[0];

    date.setDate(date.getDate() - 30);
    const dateStart = date.toISOString().split("T")[0];

    this.filter.dateStart = dateStart;
    this.filter.dateEnd = dateEnd;

    if (this.$route.query.clientId && this.$route.query.clientName) {
      this.filter.clientId = +this.$route.query.clientId;
      this.client = {
        name: this.$route.query.clientName
      };
      this.$router.replace({ query: {} });
    }
  }
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
