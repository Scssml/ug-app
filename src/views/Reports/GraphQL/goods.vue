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
          <td>{{ item.sum }}</td>
          <td>{{ item.count }}</td>
          <!-- <td>{{ item.bouquets }}</td> -->
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
        'Название',
        'Сумма',
        'Количество',
        // 'Букеты',
      ],
      bouquets: [],
    };
  },
  apollo: {
    bouquets: {
      query: gql`
        query report(
          $dateStart: timestamptz,
          $dateEnd: timestamptz
        ) {
          bouquets: bouquets(
            where: {
              _and: [
                { active: { _eq: true } }
                { created_at: { _gte: $dateStart } }
                { created_at: { _lte: $dateEnd } }
              ]
            },
            order_by: { created_at: asc }
          ) {
            id
            bouquetGoodsMappings {
              good {
                name
                sortIndex
              }
              goodId
              goodsCount
              originalPrice
            }
          }
        }
      `,
      variables() {
        return {
          dateStart: `${this.dateStart} 00:00:00`,
          dateEnd: `${this.dateEnd} 23:59:59`,
        };
      },
    },
  },
  computed: {
    report() {
      const goods = [];

      this.bouquets.forEach((item) => {
        item.bouquetGoodsMappings.forEach((good) => {
          const countGood = +good.goodsCount;
          const sumGood = +good.originalPrice * countGood;

          const findIndex = goods.findIndex((elem) => {
            return good.goodId === +elem.id;
          });

          if (findIndex !== -1) {
            goods[findIndex].sum += sumGood;
            goods[findIndex].count += countGood;
            goods[findIndex].bouquets.push(item.id);
          } else {
            goods.push({
              id: +good.goodId,
              name: good.good.name,
              sum: sumGood,
              count: countGood,
              sort: good.good.sortIndex,
              bouquets: [item.id],
            });
          }
        });
      });

      goods.sort((a, b) => {
        if (a.sort < b.sort) {
          return 1;
        } else if (a.sort > b.sort) {
          return -1;
        }

        return 0;
      });

      return goods;
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
  },
};
</script>
