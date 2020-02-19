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
            :rules="[v => !!v || 'Заполните поле']"
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
            :rules="[v => !!v || 'Заполните поле']"
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
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.purchaseDate }}</td>
            <td>{{ props.item.type.name }}</td>
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
      </v-card>
    </template>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'History',
  data() {
    return {
      typeEdit: [],
      goods: [],
      dataStartPicker: null,
      dataEndPicker: null,
      filter: {
        startDate: null,
        endDate: null,
        type: null,
        search: null,
        goodId: null,
      },
      loadingData: [
        {
          title: 'Получение поставок',
          error: false,
          loading: true,
          color: 'indigo',
          id: 'purchase',
        },
      ],
      search: '',
      headersTable: [
        {
          text: 'Дата',
          align: 'left',
          value: 'date',
        },
        {
          text: 'Тип изменения',
          align: 'left',
          value: 'type',
        },
        {
          text: 'Закупка',
          align: 'left',
          value: 'purchase',
        },
        {
          text: 'Приход',
          align: 'left',
          value: 'arrival',
        },
        {
          text: 'Наценка',
          align: 'left',
          value: 'markup',
        },
        {
          text: 'Переоценка',
          align: 'left',
          value: 'revaluation',
        },
        {
          text: 'Компания',
          align: 'left',
          value: 'company',
        },
        {
          text: 'Менеджер',
          align: 'left',
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
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
    ...mapState(['purchaseFilter']),
  },
  methods: {
    markup(item) {
      let markupVal = 0;
      if (item.arrival !== 0) {
        markupVal = 100 - (item.purchase * 100) / item.arrival;
      }

      return +markupVal.toFixed(2);
    },
    getGoods() {
      const itemParams = {
        type: 'goods',
        sort: {
          sortIndex: 'asc',
        },
      };

      return this.$store.dispatch('getItemsList', itemParams).then((resp) => {
        this.goods = resp.map((item) => {
          item.id = +item.id;
          return item;
        });
      });
    },
    getPurchaseTypesList() {
      const itemParams = {
        type: 'purchase-types',
      };

      return this.$store
        .dispatch('getItemsList', itemParams)
        .then((response) => {
          this.typeEdit = response.map((item) => {
            item.id = +item.id;
            return item;
          });
        })
        .catch(() => {
          console.log('error');
        });
    },
    setPurchaseFilter(filterProp) {
      return (value) => {
        this.$store.commit('setPurchaseFilter', {
          filterProp,
          value,
        });

        this.getPurchaseList();
      };
    },
    getPurchaseList() {
      const {
        startDate, endDate, goodId, type,
      } = this.purchaseFilter;
      let search = null;

      if (goodId) {
        const good = this.goods.find(g => g.id === +goodId);

        search = good.name;
      }

      const itemParams = {
        type: 'purchase',
        filter: {
          type,
          search,
        },
      };

      if (startDate && endDate) {
        itemParams.filter = {
          ...itemParams.filter,
          purchaseDate: [startDate, endDate],
        };
      }

      Object.keys(itemParams.filter).forEach(key => itemParams.filter[key] == null && delete itemParams.filter[key]);

      const successData = 'Закупки получены!';
      const errorData = 'Ошибка получения закупок!';

      this.$store
        .dispatch('getItemsList', itemParams)
        .then((response) => {
          this.purchaseList = response.map((item) => {
            const purchase = item;
            // const dateCreated = purchase.date.split('T')[0];
            // purchase.date = dateCreated;
            return purchase;
          });

          const loadData = this.loadingData.find(item => item.id === itemParams.type);
          loadData.title = successData;
          loadData.loading = false;
        })
        .catch(() => {
          const loadData = this.loadingData.find(item => item.id === itemParams.type);
          loadData.title = errorData;
          loadData.error = true;
        });
    },
  },
  mounted() {
    Promise.all([this.getGoods(), this.getPurchaseTypesList()]).then(() => {
      this.getPurchaseList();
    });
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
