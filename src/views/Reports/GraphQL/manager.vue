<template>
  <div>
    <table
      class="width-auto"
      v-if="report"
    >
      <template v-for="(item, index) in report">
        <tr :key="item.id">
          <td colspan="6" class="text-xs-center"><b>{{ item.name }}</b></td>
        </tr>
        <tr :key="item.id">
          <template v-for="(th, indexTh) in tableHeader">
            <td :key="`th-${indexTh}`"><b>{{ th }}</b></td>
          </template>
        </tr>
        <template v-for="(val, key) in item.values">
          <tr :key="`value-${item.id}-${key}`">
            <td>
              <template v-if="val.orderSourceTypesName">
                {{ val.orderSourceTypesName }}
              </template>
            </td>
            <td>{{ val.totalBouquets }}</td>
            <td>{{ val.totalBouquetPrice }}</td>
            <td>{{ val.totalOrders }}</td>
            <td>{{ val.deliveryBouquetCount }}</td>
            <td>{{ Math.ceil(val.allDeliveryBouquetPrice) }}</td>
          </tr>
        </template>
        <tr :key="item.id">
          <td><b>Итого</b></td>
          <td><b>{{ item.allTotalBouquets }}</b></td>
          <td><b>{{ item.allTotalBouquetPrice }}</b></td>
          <td><b>{{ item.allTotalOrders }}</b></td>
          <td><b>{{ item.allDeliveryBouquetCount }}</b></td>
          <td><b>{{ item.totalallDeliveryBouquetPrice }}</b></td>
        </tr>
      </template>
      <tr>
        <td colspan="6" class="text-xs-center"><b>Всего по всем менеджерам</b></td>
      </tr>
      <tr>
        <td><b>Итого</b></td>
        <td><b>{{ allTotalBouquets }}</b></td>
        <td><b>{{ allTotalBouquetPrice }}</b></td>
        <td><b>{{ allTotalOrders }}</b></td>
        <td><b>{{ allDeliveryBouquetCount }}</b></td>
        <td><b>{{ totalallDeliveryBouquetPrice }}</b></td>
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
        'Т/С',
        'Количество букетов',
        'Стоимость букетов',
        'Количество заказов',
        'Доставленные букеты',
        'Стоимость доставленных букетов',
      ],
      report: [],
      orderSourceTypes: [],
    };
  },
  computed: {
    allTotalBouquets() {
      return this.report.reduce((sum, item) => {
        return sum + item.allTotalBouquets;
      }, 0);
    },
    allTotalBouquetPrice() {
      return this.report.reduce((sum, item) => {
        return sum + item.allTotalBouquetPrice;
      }, 0);
    },
    allTotalOrders() {
      return this.report.reduce((sum, item) => {
        return sum + item.allTotalOrders;
      }, 0);
    },
    allDeliveryBouquetCount() {
      return this.report.reduce((sum, item) => {
        return sum + item.allDeliveryBouquetCount;
      }, 0);
    },
    totalallDeliveryBouquetPrice() {
      return this.report.reduce((sum, item) => {
        return sum + item.totalallDeliveryBouquetPrice;
      }, 0);
    },
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
            id
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
        const reportManager = report.map((item) => {
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

        return reportManager.reduce((arVal, item) => {
          let index = arVal.findIndex(elem => elem.id === item.id);

          if (index === -1) {
            arVal.push({
              id: item.id,
              name: item.name,
              allTotalBouquets: item.totalBouquets,
              allTotalBouquetPrice: item.totalBouquetPrice,
              allTotalOrders: item.totalOrders,
              allDeliveryBouquetCount: item.deliveryBouquetCount,
              totalallDeliveryBouquetPrice: item.allDeliveryBouquetPrice,
              values: [item],
            });

            index = arVal.length - 1;
          } else {
            arVal[index].values.push(item);
            arVal[index].allTotalBouquets += item.totalBouquets;
            arVal[index].allTotalBouquetPrice += item.totalBouquetPrice;
            arVal[index].allTotalOrders += item.totalOrders;
            arVal[index].allDeliveryBouquetCount += item.deliveryBouquetCount;
            arVal[index].totalallDeliveryBouquetPrice += item.allDeliveryBouquetPrice;
          }

          arVal[index].values.sort((a, b) => {
            if (a.orderSourceTypesName > b.orderSourceTypesName) return 1;
            if (a.orderSourceTypesName === b.orderSourceTypesName) return 0;
            if (a.orderSourceTypesName < b.orderSourceTypesName) return -1;
          });

          return arVal;
        }, []);
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
