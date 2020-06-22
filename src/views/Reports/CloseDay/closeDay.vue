<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-card>
      <v-card-title>
        <v-form
          ref="form"
          lazy-validation
          style="width: 100%"
        >
          <v-layout
            row
            wrap
            align-center
          >
            <v-flex
              xs2
              class="px-2"
            >
              <v-select
                label="Канал оплаты"
                :items="walletsList"
                :rules="[v => !!v || 'Заполните поле']"
                item-text="name"
                item-value="id"
                v-model.number="walletId"
                hide-details
                class="mb-4"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-title>

      <v-data-table
        :headers="headersTable"
        :items="closeDaysList"
        :disable-initial-sort="true"
        hide-actions
        no-data-text="Данных не найдено"
        no-results-text="Данных не найдено"
        :pagination.sync="pagination"
        :loading="!!$apollo.queries.closeDaysList.loading"
      >
        <template slot="items" slot-scope="props">
          <tr
            v-if="props.item.amounts !== props.item.accounting_amounts
              || (
                props.item.amounts === props.item.accounting_amounts
                && (userGroup === 'admin' || !props.item.is_closed)
              )
            "
          >
            <td>{{ props.item.created_at }}</td>
            <td>{{ props.item.amounts }}</td>
            <td>{{ props.item.accounting_amounts }}</td>
            <td class="text-xs-right" style="width: 50px;">
              <v-btn
                flat
                icon
                @click.prevent="editItem(props.item.id)"
                class="mx-0"
                title="Внести данные бухгалтерии"
              >
                <v-icon>edit</v-icon>
              </v-btn>
            </td>
          </tr>
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
            :disabled="closeDaysList.length < take"
            @click="nextPage()"
          >
            <v-icon dark>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>

    <v-dialog
      v-model="dialogForm"
      persistent
      max-width="420px"
    >
      <elem-edit
        v-if="editedId && editDialog"
        :id="editedId"
        @cancel="closeDialog()"
      ></elem-edit>
    </v-dialog>
  </v-container>
</template>

<script>
import gql from 'graphql-tag';
import format from 'date-fns/format';
import { ru } from 'date-fns/locale';
import ElemEdit from "./edit.vue";

export default {
  components: {
    ElemEdit,
  },
  data() {
    return {
      walletId: 1,
      walletsList: [],
      closeDaysList: [],
      headersTable: [
        {
          text: 'Дата',
          align: 'left',
          value: 'created_at',
          sortable: false,
        },
        {
          text: 'Баланс на дату',
          align: 'left',
          value: 'amounts',
          sortable: false,
        },
        {
          text: 'Данные бухгалтерии',
          align: 'left',
          value: 'accounting_amounts',
          sortable: false,
        },
        {
          text: '',
          align: 'right',
          value: 'action',
          sortable: false,
        },
      ],
      pagination: {
        sortBy: 'id',
        rowsPerPage: -1,
        descending: true,
      },
      take: 20,
      page: 0,
      dialogForm: false,
      editDialog: false,
      editedId: 0,
    };
  },
  apollo: {
    walletsList: {
      query: gql`
        query {
          walletsList: wallets (
            order_by: {name: asc}
          ) {
            id
            name
          }
        }
      `,
    },
    closeDaysList: {
      query() {
        return gql`
          query closeDaysList(
            $limit: Int
            $offset: Int
            $walletId: bigint
          ){
            closeDaysList: payment_day_reports(
              order_by: { created_at: desc }
              limit: $limit
              offset: $offset
              where: {wallet_id: {_eq: $walletId}}
            ) {
              amounts
              created_at
              id
              accounting_amounts
              is_closed
            }
          }
        `;
      },
      variables() {
        return {
          offset: this.page * this.take,
          limit: this.take,
          walletId: this.walletId,
        };
      },
      update({ closeDaysList }) {
        return closeDaysList.map((item) => {
          item.created_at = this.formatDate(item.created_at, 'dd.MM.yyyy HH:mm:ss');
          return item;
        });
      },
    },
  },
  computed: {
    userGroup() {
      return this.$store.getters.getAuthUserGroup.code;
    }
  },
  methods: {
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
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
    closeDialog() {
      this.dialogForm = false;
      this.editedId = 0;
      this.editDialog = false;
    },
    editItem(id) {
      this.editedId = +id;
      this.dialogForm = true;
      this.editDialog = true;
    },
  },
};
</script>
