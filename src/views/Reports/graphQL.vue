<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-card>
      <v-card-title
        class="print-hidden"
      >
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
                label="Тип отчета"
                :items="reportType"
                item-text="name"
                item-value="id"
                v-model="data.type"
                :rules="[v => !!v || 'Заполните поле']"
                hide-details
              ></v-select>
            </v-flex>
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
                  v-model="data.dateStart"
                  prepend-icon="event"
                  hide-details
                  readonly
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
                <v-date-picker
                  v-model="data.dateStart"
                  @input="dataStartPicker = false"
                  no-title
                  scrollable
                  locale="ru-ru"
                  first-day-of-week="1"
                  :max="!!data.dateEnd ? data.dateEnd : undefined"
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
                  v-model="data.dateEnd"
                  prepend-icon="event"
                  hide-details
                  readonly
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
                <v-date-picker
                  v-model="data.dateEnd"
                  @input="dataEndPicker = false"
                  no-title
                  locale="ru-ru"
                  scrollable
                  first-day-of-week="1"
                  :min="!!data.dateStart ? data.dateStart : undefined"
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
      </v-card-title>

      <v-card-text
        v-html="report"
        class="report"
      ></v-card-text>
    </v-card>

    <br>
    <v-btn
      color="primary"
      dark
      class="mb-4 print-btn"
      @click.prevent="printPage()"
      v-if="report"
    >Распечатать</v-btn>
  </v-container>
</template>

<script>
import gql from "graphql-tag";

export default {
  data() {
    return {
      dataStartPicker: false,
      dataEndPicker: false,
      data: {
        type: '',
        dateStart: '',
        dateEnd: '',
      },
      reportType: [
        {
          name: 'Курьеры',
          id: 'courier_stats',
        },
        {
          name: 'Флористы',
          id: 'florist_stats',
        },
        {
          name: 'Клиенты',
          id: 'client_stat',
        },
        {
          name: 'Менеджеры',
          id: 'manager_stat',
        },
      ],
      report: '',
      loadingBtn: false,
    };
  },
  methods: {
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        this.report = '';
        this.loadingBtn = true;

        if (this.data.type === 'courier_stats') {
          this.getCourierStats();
        }
      }
    },
    getCourierStats() {
      this.$apollo.query({
        query: gql`
          query {
            reportCourierStats: courier_stats(
              args: {
                start_date: "${this.data.dateStart} 00:00:00", end_date: "${this.data.dateEnd} 23:59:59"
              }
            ) {
              id
              name
              totalBouquetPrice
              totalBouquets
              totalOrders
            }
          }
        `,
      }).then((response) => {
        console.log(response);
        this.report = response.data.reportCourierStats;
        this.loadingBtn = false;
      });
    },
    printPage() {
      window.print();
    },
    createdReportGraphQL() {
      const itemParams = {
        type: 'v1/graphql',
        data: {
          query: 'query MyQuery{orders(where:{orderStatusId:{_eq:"1"}}){id,orderStatusId,client{phone,name}}}',
          variables: null,
          operationName: 'MyQuery',
        },
      };

      this.$store.dispatch('getGraphQL', itemParams).then((response) => {
        console.log(response);
      });
    },
  },
  mounted() {
    // this.createdReportGraphQL();
  },
};
</script>

<style lang="scss">
  .report {

    table {
      width: 100%;
      border-collapse: collapse;

      td, th {
        padding: 5px;
        border: 1px solid #ccc;
      }
    }
  }
</style>
