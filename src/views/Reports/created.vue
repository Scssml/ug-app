<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-card>
      <v-card-title
        class="print-hidden"
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
              hide-details
            ></v-select>
          </v-flex>
          <v-flex
            xs2
            class="px-2"
          >
            <v-menu
              :close-on-content-click="false"
              v-model="dataPicker"
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
                v-model="data.date"
                prepend-icon="event"
                hide-details
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="data.date"
                @input="dataPicker = false"
                no-title
                scrollable
                locale="ru-ru"
                first-day-of-week="1"
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
    >Распечатать</v-btn>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dataPicker: false,
      data: {
        type: '',
        date: '',
      },
      reportType: [
        {
          name: 'Заказы за день',
          id: 'day-orders',
        },
        {
          name: 'Оплаты за день',
          id: 'payment',
        },
        {
          name: 'Отчет за день',
          id: 'day',
        },
        {
          name: 'Отчет за месяц',
          id: 'month',
        },
      ],
      report: '',
      loadingBtn: false,
    };
  },
  methods: {
    submitForm() {
      this.report = '';
      this.loadingBtn = true;

      const itemParams = {
        type: `print/${this.data.type}/${this.data.date}`,
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.report = response;
        this.loadingBtn = false;
      });
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
      width: 100%;
      border-collapse: collapse;

      td, th {
        padding: 5px;
        border: 1px solid #ccc;
      }
    }
  }
</style>
