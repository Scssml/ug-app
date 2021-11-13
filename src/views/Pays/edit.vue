<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Оплата изменена</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Просмотр оплаты №{{ item.id }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-text-field
          label="Дата"
          :value="new Date(item.created_at).toLocaleString()"
          readonly
        ></v-text-field>
        <v-text-field
          label="Клиент"
          :value="(item.client) ? `${item.client.name} (${item.client.phone})` : ''"
          readonly
        ></v-text-field>
        <v-text-field
          label="Стоимость"
          :value="item.amount"
          readonly
        ></v-text-field>
        <v-text-field
          label="Тип оплаты"
          :value="(item.payment_type) ? ((type = paymentTypes.find((elem) => elem.id === item.payment_type)) ? type.name : '') : ''"
          readonly
        ></v-text-field>
        <!-- <v-text-field
          v-if="editedItem.parent && editedItem.paymentType.id === 7"
          label="Предыдущая оплата"
          :value="editedItem.parent.name"
          readonly
        ></v-text-field> -->
        <!-- <v-text-field
          v-if="editedItem.parent && editedItem.paymentType.id === 7"
          label="Дата предыдущей оплаты"
          :value="editedItem.parent.created_at"
          readonly
        ></v-text-field> -->
        <v-textarea
          label="Комментарий"
          auto-grow
          :value="item.comment"
          row-height="12"
          readonly
        ></v-textarea>
      </v-card-text>
      <v-card-actions
        class="px-4 pb-4"
      >
        <v-btn
          @click.native="cancel()"
        >Отмена</v-btn>
        <!-- <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="submitForm"
        >Сохранить</v-btn> -->
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      createdSuccess: false,
      paymentTypes: [
        {
          id: 'gazprom',
          name: 'Газпром',
        },
        {
          id: 'tinkoff',
          name: 'Тинькофф',
        },
        {
          id: 'terminal_ug2',
          name: 'Терминал юг-2',
        },
        {
          id: 'expenses',
          name: 'Расходы',
        },
        {
          id: 'collection',
          name: 'Инкассация',
        },
        {
          id: 'return',
          name: 'Возврат',
        },
        {
          id: 'cashless',
          name: 'Безнал',
        },
        {
          id: 'terminal',
          name: 'Терминал',
        },
        {
          id: 'cart',
          name: 'Карта',
        },
        {
          id: 'yandex',
          name: 'Яндекс',
        },
        {
          id: 'cash',
          name: 'Наличные',
        },
        {
          id: 'balance',
          name: 'На баланс',
        },
      ],
    };
  },
  methods: {
    cancel() {
      this.createdSuccess = false;
      this.$emit('cancel');
    },
  },
};
</script>
