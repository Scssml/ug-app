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
          <v-select
            label="Товар"
            :items="goods"
            item-text="name"
            item-value="id"
            v-model.number="purchaseFilter.goodId"
            hide-details
            clearable
            class="pr-4"
            @change="setPurchaseFilter('goodId')($event)"
          ></v-select>
          <v-spacer></v-spacer>
          <v-select
            label="Тип изменения"
            :items="typeEdit"
            item-text="name"
            item-value="id"
            v-model.number="purchaseFilter.type"
            hide-details
            clearable
            class="pr-4"
            @change="setPurchaseFilter('type')($event)"
          ></v-select>
          <v-menu
            :close-on-content-click="false"
            v-model="dataStartPicker"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="200px"
            class="ml-4"
          >
            <v-text-field
              v-model="purchaseFilter.startDate"
              slot="activator"
              label="C"
              prepend-icon="event"
              hide-details
              readonly
              clearable
            ></v-text-field>
            <v-date-picker
              v-model="purchaseFilter.startDate"
              @input="dataStartPicker = false"
              no-title
              scrollable
              locale="ru-ru"
              first-day-of-week="1"
              @change="setPurchaseFilter('startDate')($event)"
            ></v-date-picker>
          </v-menu>
          <v-menu
            :close-on-content-click="false"
            v-model="dataEndPicker"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="200px"
            class="ml-4"
          >
            <v-text-field
              v-model="purchaseFilter.endDate"
              slot="activator"
              label="По"
              prepend-icon="event"
              hide-details
              readonly
              clearable
            ></v-text-field>
            <v-date-picker
              v-model="purchaseFilter.endDate"
              @input="dataEndPicker = false"
              no-title
              scrollable
              locale="ru-ru"
              first-day-of-week="1"
              @change="setPurchaseFilter('endDate')($event)"
            ></v-date-picker>
          </v-menu>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="purchaseList"
          hide-actions
          no-data-text="Поставок не найдено"
          no-results-text="Поставок не найдено"
          :search="search"
          :disable-initial-sort="true"
          :pagination.sync="pagination"
          :loading="!!$apollo.queries.purchaseList.loading"
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
            <td>{{ props.item.created_at_format }}</td>
            <td>{{ props.item.purchaseType.name }}</td>
            <td>{{ props.item.purchase }}</td>
            <td>{{ props.item.arrival }}</td>
            <td>{{ markup(props.item) }}%</td>
            <td>{{ props.item.revaluation }}</td>
            <td>
              <template v-if="props.item.company">
                {{ props.item.company.name }}
              </template>
            </td>
            <td>{{ props.item.createdBy.name }}</td>

            <td class="text-xs-right" style="width: 7%;">
              <v-icon
                class="mr-2"
                @click.prevent="
                  $router.push({
                    name: 'historyView',
                    params: { id: props.item.id }
                  })
                "
              >
                visibility
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
              :disabled="purchaseList.length < take"
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
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";
import { mapState } from 'vuex';

export default {
  name: 'History',
  data() {
    return {
      typeEdit: [],
      goods: [],
      dataStartPicker: null,
      dataEndPicker: null,
      loadingData: [
        {
          title: 'Получение поставок',
          error: false,
          loading: false,
          color: 'indigo',
          id: 'purchase',
        },
      ],
      search: '',
      headersTable: [
        {
          text: 'Дата',
          align: 'left',
          sortable: true,
          value: 'created_at',
        },
        {
          text: 'Тип изменения',
          align: 'left',
          sortable: true,
          value: 'purchaseType.name',
        },
        {
          text: 'Закупка',
          align: 'left',
          sortable: true,
          value: 'purchase',
        },
        {
          text: 'Приход',
          align: 'left',
          sortable: true,
          value: 'arrival',
        },
        {
          text: 'Наценка',
          align: 'left',
          sortable: false,
          value: 'markup',
        },
        {
          text: 'Переоценка',
          align: 'left',
          sortable: true,
          value: 'revaluation',
        },
        {
          text: 'Компания',
          align: 'left',
          sortable: true,
          value: 'company.name',
        },
        {
          text: 'Менеджер',
          align: 'left',
          sortable: true,
          value: 'createdBy.name',
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      usersList: [],
      purchaseList: [],
      take: 20,
      page: 0,
      pagination: {
        sortBy: 'created_at',
        rowsPerPage: -1,
        descending: true,
      },
    };
  },
  apollo: {
    typeEdit: {
      query: gql`
        query {
          typeEdit: purchaseTypes {
            id
            name
          }
        }
      `,
    },
    goods: {
      query: gql`
        query goods {
          goods: goods(
            order_by: { sortIndex: asc }
            where: {
              deleted_at: { _is_null: true }
            }
          ) {
            id
            name
          }
        }
      `,
    },
    purchaseList: {
      query: gql`
        query purchaseList(
          $goodId: bigint,
          $dateStart: timestamptz,
          $dateEnd: timestamptz,
          $typeId: bigint,
          $limit: Int,
          $offset: Int,
          $orderBy: [purchases_order_by!]
        ) {
          purchaseList: purchases(
            where: {
              _and: [
                { 
                  purchasedGoods: {
                    goodId: { _eq: $goodId }
                  }
                }
                { typeId: { _eq: $typeId } }
                { created_at: { _gte: $dateStart } }
                { created_at: { _lte: $dateEnd } }
              ]
            },
            order_by: $orderBy,
            limit: $limit,
            offset: $offset
          ) {
            id,
            created_at
            purchaseType {
              name
            }
            purchase
            arrival
            revaluation
            company {
              name
            }
            createdBy {
              name
            }
          }
        }
      `,
      variables() {
        return {
          goodId: this.purchaseFilter.goodId
            ? this.purchaseFilter.goodId
            : undefined,
          typeId: this.purchaseFilter.type
            ? this.purchaseFilter.type
            : undefined,
          dateStart: this.purchaseFilter.startDate
            ? `${this.purchaseFilter.startDate} 00:00:00`
            : undefined,
          dateEnd: this.purchaseFilter.endDate
            ? `${this.purchaseFilter.endDate} 23:59:59`
            : undefined,

          offset: this.page * this.take,
          limit: this.take,
          orderBy: this.orderBy,
        };
      },
      update({ purchaseList }) {
        return purchaseList.map((item) => {
          item.created_at_format = this.formatDate(item.created_at, 'dd.MM.yyyy HH:mm:ss');
          return item;
        });
      },
    },
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    ...mapState(['purchaseFilter']),
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
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
    changeSort(column) {
      this.purchaseList = [];
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    prevPage() {
      this.page -= 1;
    },
    nextPage() {
      this.page += 1;
    },
    changeShowElem() {
      localStorage.setItem("countElemPage", this.take);
      this.$store.commit("setCountElemPage", this.take);
      this.page = 0;
    },
    markup(item) {
      let markupVal = 0;
      if (item.arrival !== 0) {
        markupVal = 100 - (item.purchase * 100) / item.arrival;
      }

      return +markupVal.toFixed(2);
    },
    setPurchaseFilter(filterProp) {
      return (value) => {
        this.$store.commit('setPurchaseFilter', {
          filterProp,
          value,
        });
      };
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
