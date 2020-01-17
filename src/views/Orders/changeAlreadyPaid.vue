<template>
  <v-checkbox
    v-model="editedItem.alreadyPaid"
    color="primary"
    hide-details
    @change="submitForm()"
  ></v-checkbox>
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
      editedItem: {},
    };
  },
  methods: {
    submitForm() {
      const propsItem = Object.assign({}, this.editedItem);
      delete propsItem.id;

      const itemParams = {
        type: 'orders',
        id: this.editedItem.id,
        props: propsItem,
      };

      const methods = 'updateItem';

      this.$store.dispatch(methods, itemParams).then(() => {
        console.log(123);
      });
    },
  },
  mounted() {
    const props = this.order;
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
