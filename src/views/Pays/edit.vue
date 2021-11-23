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
          :value="(type = paymentTypes.find((elem) => elem.id === item.payment_type_id)) ? type.name : 'Неизвестный тип'"
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
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    paymentTypes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      createdSuccess: false,
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
