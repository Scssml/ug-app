<template>
  <div>
    <v-btn
      color="primary"
      dark
      class="mb-4 print-btn"
      @click.prevent="printPage()"
    >Распечатать</v-btn>
    <div style="display:flex;flex-wrap: wrap;justify-content: space-between;">
      <template v-for="(order) in ordersList">
        <template v-for="(elem, index) in order.bouquets">
          <template v-for="n in elem.count">
            <table
              style="width: 50%; padding: 10px; border: 1px solid black; margin-bottom: 40px;"
              :key="`${index}-${n}`"
            >
              <tbody>
                <tr>
                  <td style="width: 73px;">
                    <b>Дата</b>
                  </td>
                  <td colspan="3" style="width: 100%; text-align: center; font-size: 30px;">
                    {{ order.orderDate }}
                  </td>
                  <td style="width: 204px; text-align: right;">
                    <b>{{ order.orderDeliveryType }}</b>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" style="width: 100%; text-align: center;">
                    <span><b>№ Заказа: </b></span>
                    <u style="font-size: 70px;">{{ order.orderId }}</u>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" style="width: 10%">
                    <strong style="font-size: 20px;">Заказчик: </strong>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="width: 182px; text-align: left;">
                    <u style="font-size: 55px;">{{ order.clientName }}</u>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="width: 73px; padding-top: 10px;">
                    <p style="text-align: justify;">
                      <strong>Комментарий:</strong>
                      <span contenteditable="true" style="margin-left: 5px;">
                        {{ order.orderDetails }}
                      </span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="width: 73px;">
                    <strong>Букет:</strong>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="width: 73px;">
                    {{ elem.name }}
                    <!-- (кол-во: {{ elem.count }}) -->
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </template>
      </template>
    </div>
    <v-btn
      color="primary"
      dark
      class="mt-4 print-btn"
      @click.prevent="printPage()"
    >Распечатать</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ids: [],
      ordersList: [],
    };
  },
  methods: {
    getItems() {
      const itemParams = {
        type: 'print/order/florist-batch',
        props: {
          ids: this.ids,
        },
      };

      this.$store.dispatch('addItem', itemParams).then((response) => {
        this.ordersList = response.map((item) => {
          const elem = item;

          if (elem.orderDate) {
            const date = new Date(elem.orderDate);
            elem.orderDate = date.toLocaleString('ru', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
            });
          }

          return elem;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    printPage() {
      window.print();
    },
  },
  mounted() {
    this.ids = this.$route.params.ids.split(',');
    this.getItems();
  },
};
</script>
