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
      <v-alert
        :value="deliveredSuccess"
        type="success"
        class="my-0"
      >Заказ изменен</v-alert>
      <v-alert
        :value="deliveredError"
        type="error"
        class="my-0"
      >Ошибка</v-alert>
      <v-form
        ref="form"
        lazy-validation
      >
        <p class="mb-0">Букеты</p>
        <v-layout
          row
          wrap
          v-for="(bouquet, index) in editedItem.bouquets"
          :key="'bouquet-' + index"
          align-center
        >
          <v-flex
            xs6
            class="pr-3"
          >
            <v-textarea
              label="Название"
              :rules="[v => !!v || 'Заполните поле']"
              auto-grow
              v-model="bouquet.name"
              row-height="6"
              hide-details
              class="mb-4"
              readonly
            ></v-textarea>
          </v-flex>
          <v-flex
            xs1
            class="pr-3"
          >
            <v-text-field
              label="Кол-во"
              :rules="[v => !!v || 'Заполните поле']"
              v-model="bouquet.count"
              hide-details
              class="mb-4"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex
            xs4
            class="pr-3"
          >
            <v-text-field
              label="Место"
              hide-details
              class="mb-4"
              v-model="bouquet.place"
            ></v-text-field>
          </v-flex>
        </v-layout>
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
        @click="submitForm()"
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
      deliveredSuccess: false,
      deliveredError: false,
      editedItem: {},
      btnLoad: false,
    };
  },
  methods: {
    submitForm() {
      this.deliveredSuccess = false;
      this.deliveredError = false;

      const propsItem = Object.assign({}, this.editedItem);
      delete propsItem.id;

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
