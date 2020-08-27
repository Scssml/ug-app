<template>
  <div>
    <table v-if="report" class="width-auto">
      <tr>
        <td>Дата</td>
        <td>{{ report.date }}</td>
      </tr>
      <tr>
        <td>Выручка</td>
        <td>{{ report.revenue }}</td>
      </tr>
      <tr>
        <td>Сумма оплат по каналу Безнал</td>
        <td>{{ report.cashless }}</td>
      </tr>
      <tr>
        <td>Карта</td>
        <td>{{ report.card }}</td>
      </tr>
      <tr>
        <td>Терминал</td>
        <td>{{ report.terminal }}</td>
      </tr>
      <tr>
        <td>Артур</td>
        <td>{{ report.collection }}</td>
      </tr>
      <tr>
        <td>Расходы</td>
        <td>{{ report.expenses }}</td>
      </tr>
      <tr>
        <td>Закупка цветов</td>
        <td>{{ report.flowerPurchase }}</td>
      </tr>
      <tr>
        <td>Наличные</td>
        <td>{{ report.cash }}</td>
      </tr>
      <tr>
        <td>Доставка</td>
        <td>{{ report.serviceDelivery }}</td>
      </tr>
      <tr>
        <td>Оформление</td>
        <td>{{ report.serviceDecor }}</td>
      </tr>
      <tr>
        <td>Скидка</td>
        <td>{{ report.serviceSale }}</td>
      </tr>
      <tr>
        <td>Упаковка</td>
        <td>{{ report.packaging }}</td>
      </tr>
      <tr>
        <td>Роза России</td>
        <td>{{ report.russianRosa }}</td>
      </tr>
      <tr>
        <td>Транспортные расходв</td>
        <td>{{ report.transport }}</td>
      </tr>
      <!-- <tr>
        <td>Авет</td>
        <td>{{ report.avet }}</td>
      </tr> -->
      <tr>
        <td>Алик</td>
        <td>{{ report.alic }}</td>
      </tr>
      <tr>
        <td>Долги</td>
        <td>{{ report.debts }}</td>
      </tr>
      <tr>
        <td>Брак</td>
        <td>{{ report.defect }}</td>
      </tr>
      <tr>
        <td>Приход товаров</td>
        <td>{{ report.purchase }}</td>
      </tr>
      <tr>
        <td>Закупка товаров</td>
        <td>{{ report.arrival }}</td>
      </tr>
      <tr>
        <td>Переоценка</td>
        <td>{{ report.revaluation }}</td>
      </tr>
      <tr>
        <td>Товарный остаток</td>
        <td>{{ report.commodityBalance }}</td>
      </tr>
      <tr>
        <td>Комиссия</td>
        <td>{{ report.commission }}</td>
      </tr>
      <tr>
        <td>К оплате</td>
        <td>{{ report.toPay }}</td>
      </tr>
      <tr>
        <td>К оплате дост</td>
        <td>{{ report.toDeliveryPay }}</td>
      </tr>
    </table>
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
