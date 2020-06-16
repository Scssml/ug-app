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
          <td>{{ item.allCash }}</td>
          <td>{{ item.noPayCash }}</td>
          <td>{{ item.card }}</td>
          <td>{{ item.terminalCash }}</td>
          <td>{{ item.collectionCash }}</td>
          <td>{{ item.expensesSum }}</td>
          <td>{{ item.flowerPurchase }}</td>
          <td>{{ item.onlyByCash }}</td>
          <td>{{ item.delivery }}</td>
          <td>{{ item.decor }}</td>
          <td>{{ item.sales }}</td>
          <td>{{ item.packaging }}</td>
          <td>{{ item.russianRosa }}</td>
          <td>{{ item.transport }}</td>
          <td>{{ item.avet }}</td>
          <td>{{ item.noPayCash }}</td>
          <td>{{ item.deliveryCost }}</td>
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
    dateEnd: {
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
        'Авет',
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
          $dateStart: date,
          $dateEnd: date,
        ) {
          dayReport: day_reports(
            where: {
              _and: [
                { date: { _gte: $dateStart } }
                { date: { _lte: $dateEnd } }
              ]
            },
            order_by: { date: asc }
          ) {
            alic
            allCash
            amountOfBouquetGoods
            avet
            card
            clientCommissionCost
            collectionCash
            commission
            date
            debt
            decor
            defect
            delivery
            deliveryCost
            expensesSum
            flowerPurchase
            goodsBalance
            id
            income
            newGoods
            noPayCash
            onlyByCash
            packaging
            revaluation
            russianRose
            sales
            terminalCash
            totalBouquetPrice
            transport
          }
        }
      `,
      variables() {
        return {
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
        };
      },
      update({ dayReport }) {
        this.report = dayReport.map((item) => {
          item.date = this.formatDate(item.date, 'dd.MM.yyyy');
          return item;
        });
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
