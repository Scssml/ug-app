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
        <v-data-table
          :headers="headersTable"
          :items="reviewsList"
          hide-actions
          no-data-text="Отзывы не найдены"
          no-results-text="Отзывы не найдены"
          :pagination.sync="pagination"
          :loading="tableLoading"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" style="width: 30px;">{{ props.item.orderId }}</td>
            <td>{{ props.item.comment }}</td>
            <td></td>
            <td>
              <template v-if="props.item.order.client">
                {{ props.item.order.client.name }}
                <br>
              </template>
              {{ props.item.phoneNumber }}
            </td>
            <td class="text-xs-right">
              <template v-if="props.item.order.createdBy">
                <div>М: {{ props.item.order.createdBy.name }}</div>
              </template>
              <template v-if="props.item.order.courier">
                <div>К: {{ props.item.order.courier.name }}</div>
              </template>
            </td>
          </template>
        </v-data-table>
        <v-layout
          row
          wrap
          justify-space-around
          class="py-2"
        >
          <v-flex
            xs2
            class="px-3"
          >
            <v-text-field
              label="Количество на странице"
              v-model.number="take"
              hide-details
              @change="changeShowElem()"
            ></v-text-field>
          </v-flex>
          <v-flex
            xs10
            class="text-xs-right px-3"
          >
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
              :disabled="reviewsList.length < take"
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
export default {
  name: 'Reviews',
  data() {
    return {
      loadingData: [
        {
          title: 'Получение отзывов',
          error: false,
          loading: true,
          color: 'deep-orange',
          id: 'deliveries',
        },
      ],
      headersTable: [
        {
          text: '№',
          align: 'right',
          value: 'id',
          sortable: false,
        },
        {
          text: 'Отзыв',
          align: 'left',
          value: 'reviews',
          sortable: false,
        },
        {
          text: 'Оценка',
          align: 'left',
          value: 'rating',
          sortable: false,
        },
        {
          text: 'Клиент',
          align: 'left',
          value: 'client.name',
          sortable: false,
        },
        {
          text: '',
          align: 'left',
          value: 'client.name',
          sortable: false,
        },
      ],
      reviewsList: [],
      pagination: {
        rowsPerPage: -1,
      },
      take: 20,
      page: 0,
      tableLoading: false,
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
  },
  methods: {
    getReviewsList(loading = true) {
      if (loading) {
        this.tableLoading = true;
        this.reviewsList = [];
      }

      const itemParams = {
        type: 'deliveries',
        sort: {
          id: 'desc',
        },
        skip: this.page * this.take,
        take: this.take,
      };

      const successData = 'Отзывы получены!';
      const errorData = 'Ошибка получения отзывов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.reviewsList = response;
        this.tableLoading = false;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    changeShowElem() {
      localStorage.setItem('countElemPage', this.take);
      this.$store.commit('setCountElemPage', this.take);
      this.page = 0;
      this.getReviewsList();
    },
    prevPage() {
      this.page -= 1;
      this.getReviewsList();
    },
    nextPage() {
      this.page += 1;
      this.getReviewsList();
    },
  },
  mounted() {
    this.take = this.$store.getters.getCountElemPage;
    this.getReviewsList();
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
