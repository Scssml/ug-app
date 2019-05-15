<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Статус изменен</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4 py-2"
      >
        <span class="headline">Изменение статуса</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4 py-1"
      >
        <v-select
          label="Статус"
          :items="statusList"
          :rules="[v => !!v || 'Заполните поле']"
          item-text="name"
          item-value="id"
          v-model.number="editedItem.orderStatus"
          hide-details
          class="mb-4"
        ></v-select>

        <v-select
          label="Курьер"
          :items="couriersList"
          :rules="[v => !!v || 'Заполните поле']"
          item-text="name"
          item-value="id"
          v-model.number="editedItem.courier"
          no-data-text="Не надено"
          hide-details
          class="mb-4"
          v-if="editedItem.orderStatus === 3 && editedItem.deliveryType === 2"
        ></v-select>
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
  },
  data() {
    return {
      editedItem: {},
      createdSuccess: false,
      statusList: [],
      couriersList: [],
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
          this.usersList = props.createdBy;
          props.orderCost = +props.orderCost;

          props.addressee = (props.addressee) ? +props.addressee.id : null;
          props.client = (props.client) ? +props.client.id : 0;
          props.courier = (props.courier) ? +props.courier.id : null;
          props.createdBy = (props.createdBy) ? +props.createdBy.id : 0;
          props.orderSourceType = (props.orderSourceType) ? +props.orderSourceType.id : 0;
          props.orderStatus = (props.orderStatus) ? +props.orderStatus.id : 0;
          props.clientType = (props.clientType) ? +props.clientType.id : 0;
          props.deliveryType = (props.deliveryType) ? +props.deliveryType.id : 0;

          this.editedItem = props;
        }).catch(() => {
          console.log('error');
        });
      }
    },
    getStatusList() {
      const itemParams = {
        type: 'order-status',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.statusList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    getCouriersList() {
      const itemParams = {
        type: 'couriers',
        filter: {
          isActive: true,
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.couriersList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
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
    this.getStatusList();
    this.getCouriersList();
    this.getItem();
  },
};
</script>
