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
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.totalBouquets }}</td>
          <td>{{ item.totalBouquetPrice }}</td>
          <td>{{ item.totalOrders }}</td>
          <td>{{ Math.ceil(item.averagePprice) }}</td>
          <td>{{ item.deliveryBouquetCount }}</td>
          <td>{{ Math.ceil(item.allDeliveryBouquetPrice) }}</td>
          <td>{{ item.totalSaleSum }}</td>
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
        '№',
        'Клиент',
        'Количество букетов',
        'Стоимость букетов',
        'Количество заказов',
        'Средняя стоимость',
        'Доставленные букеты',
        'Стоимость доставленных букетов',
        'Общая скидка',
      ],
      report: [],
    };
  },
  apollo: {
    report: {
      query: gql`
        query report(
          $dateStart: timestamp,
          $dateEnd: timestamp
        ) {
          report: client_stat(
            args: {
              start_date: $dateStart,
              end_date: $dateEnd
            }
          ) {
            name
            totalBouquets
            totalBouquetPrice
            totalOrders
            averagePprice
            deliveryBouquetCount
            allDeliveryBouquetPrice
            totalSaleSum
          }
        }
      `,
      variables() {
        return {
          dateStart: `${this.dateStart}  00:00:00`,
          dateEnd: `${this.dateEnd} 23:59:59`,
        };
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
