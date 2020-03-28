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
        'Клиент',
        'Дата',
        'Доставка',
        'Состав',
        'Стоимость',
        'Статус',
        'Менеджер',
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
