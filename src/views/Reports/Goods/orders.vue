<template>
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
          {{ item.clientName }}
          <template v-if="item.clientPhone">
            <br>{{ item.clientPhone }}
          </template>
        </td>
        <td>
          {{ formatDate(item.created_at, "dd.MM.yyyy") }}
        </td>
        <td>
          {{ item.deliveryType.name }}
          <template v-if="item.deliveryDate">
            <br>{{ item.deliveryDate }}
          </template>
          <template v-if="item.deliveryTime">
            <br>{{ item.deliveryTime }}
          </template>
          <template v-if="item.courier">
            <br>{{ item.courier.name }}
          </template>
        </td>
        <td>
          <template v-for="(bouquet, indexBouquet) in item.orderBouquets">
            <div :key="`good-${indexBouquet}`">
              {{ bouquet.name }} - {{ bouquet.count }}
            </div>
          </template>
        </td>
        <td>{{ item.orderCost }}</td>
        <td>
          <template v-if="item.orderStatus">
            {{ item.orderStatus.name }}
          </template>
        </td>
        <td>
          <template v-if="item.createdBy">
            {{ item.createdBy.name }}
          </template>
        </td>
      </tr>
    </template>
  </table>
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
        'Клиент',
        'Дата',
        'Доставка',
        'Состав',
        'Стоимость',
        'Статус',
        'Менеджер',
      ],
      orderBouquetsList: [],
      report: [],
    };
  },
  apollo: {
    orderBouquetsList: {
      query: gql`
        query orderBouquetsList(
          $goodId: bigint,
          $dateStart: timestamptz,
          $dateEnd: timestamptz
        ) {
          orderBouquetsList: bouquets(
            where: {
              _and: [
                { bouquetGoodsMappings: { good: { id: { _eq: $goodId } } } }
                { created_at: { _gte: $dateStart } }
                { created_at: { _lte: $dateEnd } }
                { orderBouquetId: { _is_null: false } }
              ]
            },
            order_by: { created_at: asc }
          ) {
            orderBouquetId
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
    report: {
      query: gql`
        query report(
          $orderBouquetsId: [bigint!],
        ) {
          report: orders(
            where: { orderBouquets: { id: { _in: $orderBouquetsId } } },
            order_by: { created_at: asc }
          ) {
            id
            clientName
            courier {
              name
            }
            created_at
            deliveryDate
            deliveryTime
            deliveryType {
              name
            }
            orderBouquets {
              name
              count
            }
            orderCost
            orderStatus {
              name
            }
            createdBy {
              name
            }
          }
        }
      `,
      variables() {
        return {
          orderBouquetsId: this.orderBouquetsId,
        };
      },
    },
  },
  computed: {
    orderBouquetsId() {
      return this.orderBouquetsList.map(item => item.orderBouquetId);
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
  },
};
</script>
