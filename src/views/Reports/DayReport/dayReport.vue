<template>
  <div>
    <template v-if="report">
      <p>Дата: {{ report.date }}</p>
      <p>Выручка: {{ report.revenue }}</p>
      <p>Сумма оплат по каналу Безнал: {{ report.cashless }}</p>
      <p>Карта: {{ report.card }}</p>
      <p>Терминал: {{ report.terminal }}</p>
      <p>Артур: {{ report.collection }}</p>
      <p>Расходы: {{ report.expenses }}</p>
      <p>Закупка цветов: {{ report.flowerPurchase }}</p>
      <p>Наличные: {{ report.cash }}</p>
      <p>Доставка: {{ report.serviceDelivery }}</p>
      <p>Оформление: {{ report.serviceDecor }}</p>
      <p>Скидка: {{ report.serviceSale }}</p>
      <p>Упаковка: {{ report.packaging }}</p>
      <p>Роза России: {{ report.russianRosa }}</p>
      <p>Транспортные расходв: {{ report.transport }}</p>
      <!-- <p>Авет: {{ report.avet }}</p> -->
      <p>Алик: {{ report.alic }}</p>
      <p>Долги: {{ report.debts }}</p>
      <p>Брак: {{ report.defect }}</p>
      <p>Приход товаров: {{ report.purchase }}</p>
      <p>Закупка товаров: {{ report.arrival }}</p>
      <p>Комиссия: {{ report.commission }}</p>
      <p>К оплате: {{ report.toPay }}</p>
      <p>К оплате дост: {{ report.toDeliveryPay }}</p>
    </template>
  </div>
</template>

<script>
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";

export default {
  props: {
    dateStart: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      report: {},
    };
  },
  apollo: {
    dayReport: {
      query: gql`
        query dayReport(
          $dateStart: Date!,
        ) {
          dayReport: dayReportByDate(
            input: $dateStart
          ) {
            alic
            arrival
            card
            cash
            cashless
            collection
            commission
            commodityBalance
            date
            debts
            defect
            expenses
            flowerPurchase
            packaging
            purchase
            rawDate
            revaluation
            revenue
            russianRosa
            serviceDecor
            serviceDelivery
            serviceSale
            terminal
            toDeliveryPay
            toPay
            transport
          }
        }
      `,
      variables() {
        return {
          dateStart: this.formatDate(this.dateStart, 'dd-MM-yyyy'),
        };
      },
      update({ dayReport }) {
        dayReport.date = this.formatDate(dayReport.date, 'dd.MM.yyyy');
        this.report = dayReport;
      },
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
  },
};
</script>
