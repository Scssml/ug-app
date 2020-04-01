<template>
  <div>
    <p>Продано: <b>{{ soldQuantity }} шт</b></p>
    <p>На сумму: <b>{{ soldSum }} р</b></p>
    <table v-if="report">
      <tr>
        <template v-for="(item, index) in tableHeader">
          <th :key="`th-${index}`">{{ item }}</th>
        </template>
      </tr>
      <template v-for="(item, index) in report">
        <tr :key="index">
          <td>{{ item.id }}</td>
          <td>
            <template v-if="item.florist">
              {{ item.florist.name }}
            </template>
          </td>
          <td>
            <template v-if="item.client">
              {{ item.client.name }}
            </template>
          </td>
          <td>
            <template v-if="item.orderBouquet">
              № {{ item.orderBouquet.orderId }}
              <br>{{ item.orderBouquet.name }} - {{ item.orderBouquet.count }}
            </template>
          </td>
          <td>
            <template v-for="(goodFields, indexGood) in item.bouquetGoodsMappings">
              <div :key="`good-${indexGood}`">
                {{ goodFields.good.name }} - {{ goodFields.goodsCount }} ({{ goodFields.originalPrice }}р)
              </div>
            </template>
          </td>
          <td>
            <template v-if="item.user">
              {{ item.user.name }}
            </template>    
          </td>
          <td>{{ item.totalCost }}</td>
          <td>{{ formatDate(item.created_at, "dd.MM.yyyy") }}</td>
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
    goodId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tableHeader: [
        '№',
        'Флорист',
        'Клиент',
        'Заказ',
        'Состав',
        'Менеджер',
        'Стоимость',
        'Дата',
      ],
      report: [],
    };
  },
  apollo: {
    report: {
      query: gql`
        query report(
          $goodId: bigint,
          $dateStart: timestamptz,
          $dateEnd: timestamptz
        ) {
          report: bouquets(
            where: {
              _and: [
                { bouquetGoodsMappings: { good: { id: { _eq: $goodId } } } }
                { created_at: { _gte: $dateStart } }
                { created_at: { _lte: $dateEnd } }
              ]
            },
            order_by: { created_at: asc }
          ) {
            id
            florist {
              name
              id
            }
            client {
              name
              id
            }
            orderBouquet {
              id
              orderId
              name
              count
            }
            bouquetGoodsMappings {
              good {
                name
                id
              }
              goodsCount
              originalPrice
              goodId
            }
            user {
              id
              name
            }
            totalCost
            created_at
          }
        }
      `,
      variables() {
        return {
          goodId: this.goodId,
          dateStart: `${this.dateStart} 00:00:00`,
          dateEnd: `${this.dateEnd} 23:59:59`,
        };
      },
    },
  },
  computed: {
    soldQuantity() {
      const quqntity = this.report.reduce((sum, item) => {
        const goodFind =  item.bouquetGoodsMappings.find(good => good.goodId === this.goodId);
        const count = (goodFind) ? goodFind.goodsCount : 0;
        return sum + count;
      }, 0);

      return quqntity;
    },
    soldSum() {
      const totalSum = this.report.reduce((sum, item) => {
        const goodFind =  item.bouquetGoodsMappings.find(good => good.goodId === this.goodId);
        const goodSum = (goodFind) ? goodFind.originalPrice * goodFind.goodsCount : 0;
        return sum + goodSum;
      }, 0);

      return totalSum;
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
  },
};
</script>
