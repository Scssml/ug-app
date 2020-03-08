<template>
  <v-card class="order">
    <v-card-title
      class="px-2 py-1"
    >
      <span class="headline" style="margin: 0 auto;">Заказ №{{ id }}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text
      class="px-2 pt-3"
    >
      <v-alert
        :value="createdSuccess"
        type="success"
        class="my-0"
      >Заказ изменен</v-alert>
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

          // let orderSourceTypeId = [];

          // if (Array.isArray(this.orderSourceType)) {
          //   orderSourceTypeId = this.orderSourceType.map(item => item.id);
          // }

          // props.orderSourceType = orderSourceTypeId;

          props.orderSourceType = (props.orderSourceType) ? props.orderSourceType : [];

          props.addressee = (props.addressee) ? +props.addressee.id : null;
          props.client = (props.client) ? +props.client.id : 0;
          props.courier = (props.courier) ? +props.courier.id : null;
          props.createdBy = (props.createdBy) ? +props.createdBy.id : 0;
          // props.orderSourceType = (props.orderSourceType) ? +props.orderSourceType.id : 0;
          props.orderStatus = (props.orderStatus) ? +props.orderStatus.id : 0;
          props.clientType = (props.clientType) ? +props.clientType.id : 0;
          props.deliveryType = (props.deliveryType) ? +props.deliveryType.id : 0;
          props.orderCost = (props.orderCost) ? String(props.orderCost) : '';
          props.deliveryTimeOfDay = +props.deliveryTimeOfDay;

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

        if (!propsItem.coordinates) {
          propsItem.coordinates = [];
        }

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
