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
          <td>
            <template v-if="item.orderSourceTypesName">
              {{ item.orderSourceTypesName }}
            </template>
          </td>
          <td>{{ item.deliveryBouquetCount }}</td>
          <td>{{ Math.ceil(item.allDeliveryBouquetPrice) }}</td>
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
        'Менеджер',
        'Количество букетов',
        'Стоимость букетов',
        'Количество заказов',
        'Т/С',
        'Доставленные букеты',
        'Стоимость доставленных букетов',
      ],
      report: [],
      orderSourceTypes: [],
    };
  },
  apollo: {
    orderSourceTypes: {
      query: gql`
        query {
          orderSourceTypes: orderSourceTypes {
            id
            name
          }
        }
      `,
    },
    report: {
      query: gql`
        query report(
          $dateStart: timestamp,
          $dateEnd: timestamp
        ) {
          report: manager_stat(
            args: {
              start_date: $dateStart,
              end_date: $dateEnd
            }
          ) {
            name
            totalBouquets
            totalBouquetPrice
            totalOrders
            ordersourcetypeids
            deliveryBouquetCount
            allDeliveryBouquetPrice
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
        return report.map((item) => {
          if (item.ordersourcetypeids.length > 0) {
            item.orderSourceTypesName = item.ordersourcetypeids.map((type) => {
              const findSource = this.orderSourceTypes.find(elem => elem.id === type);
              let source = 'Не известен';

              if (findSource) {
                source = findSource.name;
              }

              return source;
            });

            item.orderSourceTypesName = item.orderSourceTypesName.join(', ');
          }

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
