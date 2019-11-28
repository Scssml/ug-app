<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Комментарий изменен</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4 py-2"
      >
        <span class="headline">Изменение комментария</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4 py-1"
      >
        <v-textarea
          label="Комментарий"
          auto-grow
          :rules="[v => !!v || 'Заполните поле']"
          v-model.number="editedItem.description"
          row-height="12"
          hide-details
          class="mb-4"
        ></v-textarea>
      </v-card-text>
      <v-card-actions
        class="px-4 pb-4"
      >
        <v-btn
          @click.native="cancel()"
        >Отмена</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="submitForm"
        >Сохранить</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    orderSourceType: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      editedItem: {},
      createdSuccess: false,
    };
  },
  methods: {
    getItem() {
      if (this.id) {
        const itemParams = {
          type: 'orders',
          id: this.id,
        };

        this.$store.dispatch('getItem', itemParams).then((response) => {
          const props = response;

          let orderSourceTypeId = [];

          if (Array.isArray(this.orderSourceType)) {
            orderSourceTypeId = this.orderSourceType.map(item => item.id);
          }

          props.orderSourceType = orderSourceTypeId;

          props.addressee = (props.addressee) ? +props.addressee.id : null;
          props.client = (props.client) ? +props.client.id : 0;
          props.courier = (props.courier) ? +props.courier.id : null;
          props.createdBy = (props.createdBy) ? +props.createdBy.id : 0;
          // props.orderSourceType = (props.orderSourceType) ? +props.orderSourceType.id : 0;
          props.orderStatus = (props.orderStatus) ? +props.orderStatus.id : 0;
          props.clientType = (props.clientType) ? +props.clientType.id : 0;
          props.deliveryType = (props.deliveryType) ? +props.deliveryType.id : 0;
          props.orderCost = (props.orderCost) ? String(props.orderCost) : '';

          this.editedItem = props;
        }).catch(() => {
          console.log('error');
        });
      }
    },
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsItem = Object.assign({}, this.editedItem);
        delete propsItem.id;

        const itemParams = {
          type: 'orders',

          props: propsItem,
        };

        let methods = 'updateItem';

        if (this.copy) {
          methods = 'addItem';
        } else {
          itemParams.id = this.id;
        }

        this.$store.dispatch(methods, itemParams).then(() => {
          this.createdSuccess = true;
          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        });
      }
    },
  },
  mounted() {
    this.getItem();
  },
};
</script>
