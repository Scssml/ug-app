<template>
  <div>
    <table v-if="report">
      <tr>
        <template v-for="(item, index) in tableHeader">
          <th :key="`th-${index}`">{{ item }}</th>
        </template>
      </tr>
      <template v-for="(item, index) in report">
        <tr :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.revenue }}</td>
          <td>{{ item.cashless }}</td>
          <td>{{ item.card }}</td>
          <td>{{ item.terminal }}</td>
          <td>{{ item.collection }}</td>
          <td>{{ item.expenses }}</td>
          <td>{{ item.flowerPurchase }}</td>
          <td>{{ item.cash }}</td>
          <td>{{ item.serviceDelivery }}</td>
          <td>{{ item.serviceDecor }}</td>
          <td>{{ item.serviceSale }}</td>
          <td>{{ item.packaging }}</td>
          <td>{{ item.russianRosa }}</td>
          <td>{{ item.transport }}</td>
          <!-- <td>{{ item.avet }}</td> -->
          <td>{{ item.toPay }}</td>
          <td>{{ item.toDeliveryPay }}</td>
        </tr>
      </template>
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
      tableHeader: [
        'Дата',
        'Выручка',
        'Сумма оплат по каналу Безнал',
        'Карта',
        'Терминал',
        'Артур',
        'Расходы',
        'Закупка цветов',
        'Наличные',
        'Доставка',
        'Оформление',
        'Скидка',
        'Упаковка',
        'Роза России',
        'Транспортные расходв',
        // 'Авет',
        'К оплате',
        'К оплате дост',
      ],
      report: [],
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
        this.report = [];
        this.report.push(dayReport);
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
