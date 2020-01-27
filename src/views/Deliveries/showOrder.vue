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

      <v-alert
        :value="deliveredSuccess"
        type="success"
        class="my-0"
      >Статус заказа изменен</v-alert>
      <v-alert
        :value="deliveredError"
        type="error"
        class="my-0"
      >Ошибка</v-alert>
      <v-form
        ref="form"
        lazy-validation
        v-if="order.orderStatus.id === 3"
      >
        <h3 class="mb-0 mt-4 text-xs-center">Комментарий</h3>
        <v-textarea
          label="Комментарий"
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
        v-if="order.orderStatus.id === 3"
        :loading="btnLoad"
      >Доставил</v-btn>
      <v-btn
        color="info"
        @click="takeDelivery"
        v-else
      >Взять на доставку</v-btn>
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
      deliveredSuccess: false,
      deliveredError: false,
      editedItem: {},
      btnLoad: false,
    };
  },
  methods: {
    takeDelivery() {
      this.deliveredSuccess = false;
      this.deliveredError = false;

      const propsItem = Object.assign({}, this.editedItem);
      delete propsItem.id;

      propsItem.orderStatus = 3;
      propsItem.courier = this.$store.getters.getAuthUser;

      const itemParams = {
        type: 'orders',
        id: this.editedItem.id,
        props: propsItem,
      };

      const methods = 'updateItem';
      this.$store.dispatch(methods, itemParams).then(() => {
        this.deliveredSuccess = true;
        setTimeout(() => {
          this.$emit('cancel');
        }, 1000);
      }).catch(() => {
        this.deliveredError = true;
      });
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        this.deliveredSuccess = false;
        this.deliveredError = false;

        const itemParams = {
          type: 'api/orders',
          id: this.order.id,
          props: {
            comment: this.comment,
          },
        };

        this.$store.dispatch('courierDelivered', itemParams).then(() => {
          this.deliveredSuccess = true;
          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        }).catch(() => {
          this.deliveredError = true;
        });
      }
    },
    cancel() {
      this.comment = '';
      this.$emit('cancel');
    },
  },
  mounted() {
    const props = Object.assign({}, this.order);
    props.orderSourceType = (props.orderSourceType) ? props.orderSourceType : [];
    props.addressee = (props.addressee) ? +props.addressee.id : null;
    props.client = (props.client) ? +props.client.id : 0;
    props.courier = (props.courier) ? +props.courier.id : null;
    props.createdBy = (props.createdBy) ? +props.createdBy.id : 0;
    props.orderStatus = (props.orderStatus) ? +props.orderStatus.id : 0;
    props.clientType = (props.clientType) ? +props.clientType.id : 0;
    props.deliveryType = (props.deliveryType) ? +props.deliveryType.id : 0;
    props.orderCost = (props.orderCost) ? String(props.orderCost) : '';
    props.deliveryTimeOfDay = +props.deliveryTimeOfDay;

    delete props.topLine;

    this.editedItem = props;
  },
};
</script>
