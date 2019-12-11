<template>
  <v-card class="order">
    <v-card-title
      class="px-2 py-1"
    >
      <span class="headline" style="margin: 0 auto;">Заказ №{{ order.id }}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text
      class="px-2 pt-3"
    >
      <p class="mb-2">Дата: {{ order.deliveryDateStr }} ({{ order.deliveryTime }})</p>
      <p class="mb-2">Адрес:
        {{ order.address }},
        кв. {{ order.flat }},
        подъезд {{ order.entrance }},
        этаж {{ order.floor }}
      </p>
      <v-form
        ref="form"
        lazy-validation
      >
        <h3 class="mb-0 mt-4 text-xs-center">Комментарий</h3>
        <v-textarea
          label="Комментарий"
          :rules="[v => !!v || 'Заполните поле']"
          auto-grow
          v-model="comment"
          row-height="24"
          hide-details
          class="mb-4"
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions
      class="px-4 py-2"
    >
      <v-btn
        @click="cancel()"
      >Отмена</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="info"
        @click="submitForm"
      >Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comment: '',
    };
  },
  methods: {
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        console.log('success');
      }
    },
    cancel() {
      this.comment = '';
      this.$emit('cancel');
    },
  },
};
</script>
