<template>
  <div>
    <table
      class="width-auto"
      v-if="report"
    >
      <tr>
        <template v-for="(item, index) in tableHeader">
          <th :key="`th-${index}`">{{ item }}</th>
        </template>
      </tr>
      <template v-for="(item, index) in report">
        <tr :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.decorPercent }}</td>
          <td>{{ item.BouquetsCount }}</td>
          <td>{{ item.AllBouquetsCoast }}</td>
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
        'Флорист',
        'Процент оформления',
        'Количество букетов',
        'Стоимость оформления',
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
          report: florist_stats(
            args: {
              start_date: $dateStart,
              end_date: $dateEnd
            }
          ) {
            name
            decorPercent
            BouquetsCount
            AllBouquetsCoast
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
