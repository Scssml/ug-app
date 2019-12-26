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
                @click.prevent="$router.push({
                  name: 'historyView',
                  params: { id: props.item.id }
                })"
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
export default {
  name: 'History',
  data() {
    return {
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
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
  },
  methods: {
    markup(item) {
      let markupVal = 0;
      if (item.arrival !== 0) {
        markupVal = 100 - ((item.purchase * 100) / item.arrival);
      }

      return +markupVal.toFixed(2);
    },
    getPurchaseList: function getPurchaseList() {
      const itemParams = {
        type: 'purchase',
      };

      const successData = 'Закупки получены!';
      const errorData = 'Ошибка получения закупок!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.purchaseList = response.map((item) => {
          const purchase = item;
          // const dateCreated = purchase.date.split('T')[0];
          // purchase.date = dateCreated;
          return purchase;
        });

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
  },
  mounted() {
    this.getPurchaseList();
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
