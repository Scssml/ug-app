<template>
  <div>
    <table
      class="width-auto"
      v-if="report"
    >
      <template v-for="(item, index) in report">
        <tr :key="item.id">
          <td colspan="3" class="text-xs-center"><b>{{ item.name }}</b></td>
        </tr>
        <tr :key="item.id">
          <template v-for="(th, indexTh) in tableHeader">
            <td :key="`th-${indexTh}`"><b>{{ th }}</b></td>
          </template>
        </tr>
        <template v-for="(val, key) in item.values">
          <tr :key="`value-${item.id}-${key}`">
            <td>{{ val.decorPercent }}</td>
            <td>{{ val.BouquetsCount }}</td>
            <td>{{ val.AllBouquetsCoast }}</td>
          </tr>
        </template>
        <tr :key="item.id">
          <td><b>Итого</b></td>
          <td><b>{{ item.totalBouquetsCount }}</b></td>
          <td><b>{{ item.totalAllBouquetsCoast }}</b></td>
        </tr>
        <tr :key="item.id">
          <td colspan="2"><b>Средний чек</b></td>
          <td><b>{{ Math.round(item.totalAllBouquetsCoast / item.totalBouquetsCount) }}</b></td>
        </tr>
        <tr :key="item.id">
          <td colspan="2"><b>Среднее количество<br>букетов в день</b></td>
          <td><b>{{ Math.round(item.totalBouquetsCount / days) }}</b></td>
        </tr>
      </template>
      <tr>
        <td colspan="3" class="text-xs-center"><b>Среднее по всем флористам</b></td>
      </tr>
      <tr>
        <td colspan="2"><b>Количество букетов</b></td>
        <td><b>{{ averageBouquetsCount }}</b></td>
      </tr>
      <tr>
        <td colspan="2"><b>Стоимость букетов</b></td>
        <td><b>{{ averageAllBouquetsCoast }}</b></td>
      </tr>
      <tr>
        <td colspan="2"><b>Средний чек</b></td>
        <td><b>{{ Math.round(averageAllBouquetsCoast / averageBouquetsCount) }}</b></td>
      </tr>
      <tr>
        <td colspan="2"><b>Среднее количество<br>букетов в день</b></td>
        <td><b>{{ Math.round(averageBouquetsCount / days) }}</b></td>
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
    dateEnd: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tableHeader: [
        'Процент оформления',
        'Количество букетов',
        'Стоимость букетов',
      ],
      report: [],
    };
  },
  computed: {
    days() {
      const dateStart = new Date(this.dateStart + ' 00:00:00');
      const dateEnd = new Date(this.dateEnd + ' 23:59:59');
      return Math.ceil(Math.abs(dateEnd.getTime() - dateStart.getTime()) / (1000 * 3600 * 24));
    },
    averageBouquetsCount() {
      const sum = this.report.reduce((sum, item) => {
        return sum + item.totalBouquetsCount;
      }, 0);
      return Math.ceil(sum / this.report.length);
    },
    averageAllBouquetsCoast() {
      const sum = this.report.reduce((sum, item) => {
        return sum + item.totalAllBouquetsCoast;
      }, 0);
      return Math.ceil(sum / this.report.length);
    },
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
            id
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
      update({ report }) {
        return report.reduce((arVal, item) => {
          let index = arVal.findIndex(elem => elem.id === item.id);

          if (index === -1) {
            arVal.push({
              id: item.id,
              name: item.name,
              totalBouquetsCount: item.BouquetsCount,
              totalAllBouquetsCoast: item.AllBouquetsCoast,
              values: [item],
            });

            index = arVal.length - 1;
          } else {
            arVal[index].values.push(item);
            arVal[index].totalBouquetsCount += item.BouquetsCount;
            arVal[index].totalAllBouquetsCoast += item.AllBouquetsCoast;
          }

          arVal[index].values.sort((a, b) => {
            if (a.decorPercent > b.decorPercent) return 1;
            if (a.decorPercent === b.decorPercent) return 0;
            if (a.decorPercent < b.decorPercent) return -1;
          });

          return arVal;
        }, []);
      }
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
  },
};
</script>
