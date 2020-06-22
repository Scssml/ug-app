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
                @change="validateForm()"
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
                  label="Дата"
                  v-model="data.dateStart"
                  prepend-icon="event"
                  hide-details
                  readonly
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
                <v-date-picker
                  v-model="data.dateStart"
                  @input="dataStartPicker = false"
                  @change="validateForm()"
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
              v-if="data.type === 'interval_report'"
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
                  label="Дата"
                  v-model="data.dateEnd"
                  prepend-icon="event"
                  hide-details
                  readonly
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
                <v-date-picker
                  v-model="data.dateEnd"
                  @input="dataEndPicker = false"
                  @change="validateForm()"
                  no-title
                  locale="ru-ru"
                  scrollable
                  first-day-of-week="1"
                  :min="!!data.dateStart ? data.dateStart : undefined"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex
              xs3
              class="px-2 text-xs-right"
            >
              <v-btn
                color="primary"
                dark
                to="closeDay/"
                class="mt-3"
              >Закрытие дня</v-btn>
              <v-btn
                color="primary"
                dark
                to="graphQL/"
                class="mt-3"
              >GraphQL</v-btn>
              <v-btn
                color="primary"
                dark
                to="goods/"
                class="mt-3"
              >Товары</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-title>

      <v-card-text
        class="report"
      >
        <template v-if="validate">
          <day-report
            :date-start="data.dateStart"
            v-if="data.type === 'day_report'"
          ></day-report>
          <interval-report
            :date-start="data.dateStart"
            :date-end="data.dateEnd"
            v-if="data.type === 'interval_report'"
          ></interval-report>
        </template>
      </v-card-text>

      <!-- <v-card-text
        v-html="report"
        class="report"
      ></v-card-text> -->
    </v-card>

    <br>
    <v-btn
      color="primary"
      dark
      class="mb-4 print-btn"
      @click.prevent="printPage()"
    >Распечатать</v-btn>
  </v-container>
</template>

<script>
import dayReport from "./DayReport/dayReport.vue";
import intervalReport from "./DayReport/intervalReport.vue";

export default {
  components: {
    dayReport,
    intervalReport,
  },
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
          name: 'Отчет за день',
          id: 'day_report',
        },
        {
          name: 'Отчет за интервал',
          id: 'interval_report',
        },
      ],
      validate: false,
    };
  },
  methods: {
    validateForm() {
      setTimeout(() => {
        this.validate = this.$refs.form.validate();
      }, 300);
    },
    printPage() {
      window.print();
    },
  },
};
</script>

<style lang="scss">
  .report {

    table {
      // width: 100%;
      border-collapse: collapse;

      td, th {
        padding: 5px;
        border: 1px solid #ccc;
      }
    }
  }
</style>
