<template>
  <div>
    <template v-for="(item, index) in purchaseTypes">
      <p :key="index">{{ item.name }}: <b>{{ purchaseSum(item.id) }} р</b> (<b>{{ purchaseQuantity(item.id) }} шт</b>)</p>
    </template>
    <table v-if="report">
      <tr>
        <template v-for="(item, index) in tableHeader">
          <th :key="`th-${index}`">{{ item }}</th>
        </template>
      </tr>
      <template v-for="(item, index) in report">
        <tr :key="index">
          <td>
            <template v-if="item.purchaseType">
              {{ item.purchaseType.name }}
            </template>
          </td>
          <td>{{ formatDate(item.created_at, "dd.MM.yyyy") }}</td>
          <td>{{ item.oldPrice }}</td>
          <td>{{ item.newPrice }}</td>
          <td>{{ item.stockQuantity }}</td>
          <td>{{ item.estimate }}</td>
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
        'Тип',
        'Дата',
        'Цена',
        'Новая цена',
        'Остаток',
        'Количество',
      ],
      purchaseTypes: [],
      purchasedGoods: [],
      purchasedList: [],
    };
  },
  apollo: {
    purchaseTypes: {
      query: gql`
        query {
          purchaseTypes: purchaseTypes {
            id
            name
          }
        }
      `,
    },
    purchasedGoods: {
      query: gql`
        query purchasedGoods(
          $goodId: bigint,
          $dateStart: timestamptz,
          $dateEnd: timestamptz
        ) {
          purchasedGoods: purchasedGoods(
            where: {
              _and: [
                { goodId: { _eq: $goodId } }
                { created_at: { _gte: $dateStart } }
                { created_at: { _lte: $dateEnd } }
              ]
            },
            order_by: { created_at: asc }
          ) {
            purchaseId
            newPrice
            oldPrice
            estimate
            stockQuantity
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
    purchasedList: {
      query: gql`
        query purchasedList(
          $purchasedIds: [bigint!],
        ) {
          purchasedList: purchases(
            where: {id: {_in: $purchasedIds}},
            order_by: { id: asc }
          ) {
            id
            typeId
          }
        }
      `,
      variables() {
        return {
          purchasedIds: this.purchasedIds,
        };
      },
    },
  },
  computed: {
    purchasedIds() {
      const purchasedIds = this.purchasedGoods.map(item => item.purchaseId);
      return purchasedIds;
    },
    report() {
      const report = this.purchasedGoods.map((item) => {
        const purchase = this.purchasedList.find(elem => elem.id === item.purchaseId);

        if (purchase) {
          item.purchaseType = this.purchaseTypes.find(elem => elem.id === purchase.typeId);
        }

        return item;
      });

      return report;
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
    purchaseQuantity(purchaseTypeId) {
      const quantity = this.report.reduce((sum, item) => {
        let count = 0;

        if (item.purchaseType && item.purchaseType.id === purchaseTypeId) {
          count = item.estimate;
        }

        return sum + count;
      }, 0);

      return quantity;
    },
    purchaseSum(purchaseTypeId) {
      const totalSum = this.report.reduce((sum, item) => {
        let goodSum = 0;

        if (item.purchaseType && item.purchaseType.id === purchaseTypeId) {
          goodSum = item.newPrice * item.estimate;
        }

        return sum + goodSum;
      }, 0);

      return totalSum;
    },
  },
};
</script>
