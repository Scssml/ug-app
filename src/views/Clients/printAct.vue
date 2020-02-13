<template>
  <v-card class="order">
    <v-card-title
      class="px-4"
    >
      <span class="headline">Акт сверки</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="px-4 pt-1">
      <v-form
        ref="form"
        lazy-validation
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
                v-model="dateStart"
                prepend-icon="event"
                hide-details
                :rules="[v => !!v || 'Заполните поле']"
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="dateStart"
                @input="dataStartPicker = false"
                no-title
                scrollable
                locale="ru-ru"
                first-day-of-week="1"
                :max="(!!dateEnd) ? dateEnd : undefined"
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
                v-model="dateEnd"
                prepend-icon="event"
                hide-details
                :rules="[v => !!v || 'Заполните поле']"
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="dateEnd"
                @input="dataEndPicker = false"
                no-title
                locale="ru-ru"
                scrollable
                first-day-of-week="1"
                :min="(!!dateStart) ? dateStart : undefined"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex
            xs2
            class="px-2"
          >
            <v-btn
              color="primary"
              dark
              @click="submitForm"
              class="mt-3"
              :loading="loadingBtn"
            >Создать</v-btn>
          </v-flex>
        </v-layout>
      </v-form>

      <v-layout
        row
        wrap
        class="my-4"
        v-if="Object.keys(report).length"
      >
        <v-flex
          xs12
          class="px-2"
        >
          <p>Клиент: {{ name }}</p>
          <p>Период: с {{ dateStartFormat }} по {{ dateEndFormat }}</p>
          <p>Баланс на начало: {{ report.beforeBalance }}</p>
          <p>Обороты: {{ report.turnover }}</p>
          <p>Баланс на конец: {{ report.endPeriodBalance }}</p>
          <p>Баланс за период: {{ report.periodBalance }}</p>
        </v-flex>

        <v-flex
          xs6
          class="px-2"
        >
          <h2>Оплаты</h2>
          <v-data-table
            :headers="headersTablePayments"
            :items="report.payments"
            hide-actions
            no-data-text="Оплат не найдено"
            no-results-text="Оплат не найдено"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-right" style="width: 30px;">
                {{ props.item.id }}
              </td>
              <td>{{ props.item.creationDate }}</td>
              <td>{{ props.item.amount }}</td>
              <td>{{ props.item.paymentType.name }}</td>
            </template>
          </v-data-table>
        </v-flex>

        <v-flex
          xs6
          class="px-2"
        >
          <h2>Букеты</h2>
          <v-data-table
            :headers="headersTableBouquets"
            :items="report.bouquets"
            hide-actions
            no-data-text="Букетов не найдено"
            no-results-text="Букетов не найдено"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-right" style="width: 30px;">
                {{ props.item.id }}
              </td>
              <td>{{ props.item.createdAt }}</td>
              <td>{{ props.item.totalCost }}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions
      class="px-4 py-2"
    >
      <v-btn
        @click.native="cancel()"
      >Отмена</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dataStartPicker: false,
      dataEndPicker: false,
      dateStart: null,
      dateEnd: null,
      loadingBtn: false,
      report: {},
      headersTablePayments: [
        {
          text: 'ID',
          align: 'right',
          value: 'id',
          sortable: true,
        },
        {
          text: 'Дата',
          align: 'left',
          value: 'creationDate',
          sortable: true,
        },
        {
          text: 'Стоимость',
          align: 'left',
          value: 'amount',
          sortable: true,
        },
        {
          text: 'Тип',
          align: 'left',
          value: 'paymentType',
          sortable: true,
        },
      ],
      headersTableBouquets: [
        {
          text: 'ID',
          align: 'right',
          value: 'id',
          sortable: true,
        },
        {
          text: 'Дата',
          align: 'left',
          value: 'createdAt',
          sortable: true,
        },
        {
          text: 'Стоимость',
          align: 'left',
          value: 'totalCost',
          sortable: true,
        },
      ],
    };
  },
  computed: {
    dateStartFormat() {
      return this.formatDate(this.dateStart);
    },
    dateEndFormat() {
      return this.formatDate(this.dateEnd);
    },
  },
  methods: {
    cancel() {
      this.success = false;
      this.$emit('cancel');
    },
    formatDate(date) {
      if (!date) return null;

      let arDate = date.split('-');
      arDate = arDate.reverse();
      return arDate.join('-');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        this.report = {};
        this.loadingBtn = true;

        const itemParams = {
          type: 'print/act-of-reconciliation',
          props: {
            clientId: this.id,
            startDate: this.dateStartFormat,
            endDate: this.dateEndFormat,
          },
        };

        this.$store.dispatch('addItem', itemParams).then((response) => {
          response.payments = response.payments.map((item) => {
            const elem = item;

            if (elem.creationDate) {
              const date = new Date(elem.creationDate);
              elem.creationDate = date.toLocaleString('ru');
            }

            return elem;
          });

          response.bouquets = response.bouquets.map((item) => {
            const elem = item;

            if (elem.createdAt) {
              const date = new Date(elem.createdAt);
              elem.createdAt = date.toLocaleString('ru');
            }

            return elem;
          });

          this.report = response;
          this.loadingBtn = false;
        });
      }
    },
  },
};
</script>

<style lang="scss">
  .order.v-card {
    position: relative;
  }
  .order .v-card__text {
    padding-bottom: 52px;
  }
  .order .v-card__actions {
    position: fixed;
    width: 100%;
    bottom: 0;
    background: #fff;
    box-shadow: 0 0 5px;
  }
</style>
