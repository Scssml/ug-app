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
              {{ goodFields.good.name }} - {{ goodFields.goodsCount }}
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
</template>

<script>
import format from "date-fns/format";
import { ru } from "date-fns/locale";

export default {
  props: {
    report: {
      type: Array,
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
    };
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
  },
};
</script>
