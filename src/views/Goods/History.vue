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
            label="Тип изменения"
            :items="typeEdit"
            item-text="name"
            item-value="id"
            v-model.number="filter.operation_type"
            hide-details
            clearable
            class="pr-4"
            @change="changeFilter"
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
              v-model="filter.start_date"
              slot="activator"
              label="C"
              prepend-icon="event"
              hide-details
              readonly
              clearable
            ></v-text-field>
            <v-date-picker
              v-model="filter.start_date"
              @input="dataStartPicker = false"
              no-title
              scrollable
              locale="ru-ru"
              first-day-of-week="1"
              @change="changeFilter"
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
              v-model="filter.end_date"
              slot="activator"
              label="По"
              prepend-icon="event"
              hide-details
              readonly
              clearable
            ></v-text-field>
            <v-date-picker
              v-model="filter.end_date"
              @input="dataEndPicker = false"
              no-title
              scrollable
              locale="ru-ru"
              first-day-of-week="1"
              @change="changeFilter"
            ></v-date-picker>
          </v-menu>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="purchaseList"
          hide-actions
          no-data-text="Поставок не найдено"
          no-results-text="Поставок не найдено"
          :loading="tableLoading"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.created_at }}</td>
            <td>
              {{ typeEdit.find((item) => item.id === props.item.operation_type).name }}
            </td>
            <td>{{ props.item.arrival }}</td>
            <td>{{ props.item.amount }}</td>
            <td>{{ markup(props.item) }}%</td>
            <td>{{ props.item.revaluation }}</td>
            <td>
              <template v-if="props.item.company_name">
                {{ props.item.company_name }}
              </template>
            </td>
            <td>{{ props.item.user_name }}</td>

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
              :disabled="page === 1"
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
import axios from 'axios';

export default {
  name: 'History',
  data() {
    return {
      filter: {
        operation_type: '',
        start_date: '',
        end_date: '',
      },
      typeEdit: [
        {
          id: '',
          name: 'Все',
        },
        {
          id: 'coming',
          name: 'Приход',
        },
        {
          id: 'revaluation',
          name: 'Переоценка',
        },
        {
          id: 'inventory',
          name: 'Инвентаризация',
        },
        {
          id: 'defect',
          name: 'Брак',
        },
      ],
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
      headersTable: [
        {
          text: 'Дата',
          align: 'left',
          sortable: false,
          value: 'created_at',
        },
        {
          text: 'Тип изменения',
          align: 'left',
          sortable: false,
          value: 'operation_type',
        },
        {
          text: 'Закупка',
          align: 'left',
          sortable: false,
          value: 'arrival',
        },
        {
          text: 'Приход',
          align: 'left',
          sortable: false,
          value: 'amount',
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
          sortable: false,
          value: 'revaluation',
        },
        {
          text: 'Компания',
          align: 'left',
          sortable: false,
          value: 'company_name',
        },
        {
          text: 'Менеджер',
          align: 'left',
          sortable: false,
          value: 'user_name',
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      purchaseList: [],
      take: 20,
      page: 0,
      tableLoading: false,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
  },
  methods: {
    prevPage() {
      this.page -= 1;
    },
    nextPage() {
      this.page += 1;
    },
    changeShowElem() {
      localStorage.setItem('countElemPage', this.take);
      this.$store.commit('setCountElemPage', this.take);
      this.page = 0;
      this.getItemsList();
    },
    markup(item) {
      let markupVal = 0;
      if (item.amount !== 0) {
        markupVal = 100 - ((item.arrival * 100) / item.amount);
      }

      return +markupVal.toFixed(2);
    },
    changeFilter() {
      this.page = 0;
      this.getItemsList();
    },
    getItemsList() {
      const url = 'purchases';
      this.page += 1;

      const getParams = {
        page: this.page,
        page_limit: this.take,
      };

      Object.keys(this.filter).forEach((code) => {
        if (this.filter[code]) {
          getParams[code] = this.filter[code];
        }
      });

      axios
        .get(url, {
          params: getParams,
        })
        .then((response) => {
          const items = response.data.purchases;
          this.purchaseList = items;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getItemsList();
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
