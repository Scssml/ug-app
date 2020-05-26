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
          <td>{{ item.totalBouquetPrice }}</td>
          <td>{{ item.totalBouquets }}</td>
          <td>{{ item.totalOrders }}</td>
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
        'Курьер',
        'Стоимость букетов',
        'Количество букетов',
        'Количество заказов',
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
          report: courier_stats(
            args: {
              start_date: $dateStart,
              end_date: $dateEnd
            }
          ) {
            name
            totalBouquetPrice
            totalBouquets
            totalOrders
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
