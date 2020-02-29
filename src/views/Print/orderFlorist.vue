<template>
  <div>
    <div style="flex-wrap: wrap;justify-content: space-between;">
      <template v-for="(elem, index) in orderData.bouquets">
        <!-- <table
          style="width: 50%; padding: 10px; border: 1px solid black;margin-bottom: 40px;"
          :key="index"
        >
          <tbody>
            <tr>
              <td style="width: 73px;"><b>Дата</b></td>
              <td colspan="3" style="width: 100%; text-align: center; font-size: 30px;">
                {{ orderData.orderDate }}
              </td>
              <td style="width: 204px; text-align: right;">
                <b>{{ orderData.orderDeliveryType }}</b>
              </td>
            </tr>
            <tr>
              <td style="width: 182px;" colspan="2">
                  <strong style="font-size: 20px;">Заказчик: </strong>
              </td>
              <td colspan="3" style="width: 204px; text-align: right;">
                <span><b>№ Заказа: </b></span>
                <u style="font-size: 30px;">{{ orderData.orderId }}</u>
              </td>
            </tr>
            <tr>
              <td style="width: 182px; text-align: center;" colspan="5">
                  <u style="font-size: 45px;">{{ orderData.clientName }}</u>
              </td>
            </tr>
            <tr>
              <td style="width: 73px; padding-top: 10px;" colspan="5">
                <p style="text-align: justify;">
                  <strong>Комментарий:</strong>
                  <span style="margin-left: 5px;" contenteditable>
                    {{ orderData.orderDetails }}
                  </span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="width: 73px;" colspan="5">
                <strong>Букет:</strong>
              </td>
            </tr>
            <tr>
              <td style="width: 73px;" colspan="5">
                {{ elem.name }} (кол-во: {{ elem.count }})
              </td>
            </tr>
          </tbody>
        </table> -->
        <template v-for="n in elem.count">
          <table
            style="width: 100%; padding: 10px; border: 1px solid black; margin-bottom: 40px;"
            :key="`${index}-${n}`"
            class="print-blank"
          >
            <tbody>
              <tr>
                <td style="width: 73px;">
                  <b>Дата</b>
                </td>
                <td
                  colspan="3"
                  style="width: 100%; text-align: center; font-size: 30px;"
                >
                  {{ orderData.orderDate }}
                  <p></p>
                  {{ orderData.orderTime }}
                </td>
                <td style="width: 204px; text-align: right;">
                  <b>{{ orderData.orderDeliveryType }}</b>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="width: 100%; text-align: center;">
                  <span><b>№ Заказа: </b></span>
                  <u style="font-size: 90px;">{{ orderData.orderId }}</u>
                </td>
              </tr>
              <tr>
                <td colspan="1" style="width: 10%">
                  <strong style="font-size: 20px;">Заказчик: </strong>
                </td>
              </tr>
              <tr>
                <td colspan="5" style="width: 182px; text-align: left;">
                  <u style="font-size: 70px;">{{ orderData.clientName }}</u>
                </td>
              </tr>
              <tr>
                <td colspan="5" style="width: 73px; padding-top: 10px;">
                  <p style="text-align: justify;">
                    <strong>Комментарий:</strong>
                    <span contenteditable="true" style="margin-left: 5px;">
                      {{ orderData.orderDetails }}
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
    </div>
    <br />
    <v-btn
      :color="orderData.isAlreadyPrinted ? 'success' : 'primary'"
      dark
      class="mb-4 print-btn"
      @click.prevent="printPage()"
      >{{
        orderData.isAlreadyPrinted ? "Повторная печать" : "Распечатать"
      }}</v-btn
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: 0,
      orderData: {}
    };
  },
  methods: {
    getItem() {
      const itemParams = {
        type: "print/order",
        id: `${this.id}/florist`
      };

      this.$store
        .dispatch("getItem", itemParams)
        .then(response => {
          const elem = response;

          if (elem.orderDate) {
            const date = new Date(elem.orderDate);
            elem.orderDate = date.toLocaleString("ru", {
              day: "numeric",
              month: "numeric",
              year: "numeric"
            });
          }

          this.orderData = elem;
        })
        .catch(() => {
          console.log("error");
        });
    },
    printPage() {
      window.print();
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getItem();
  }
};
</script>

<style lang="scss">
@media print {
  .print-blank:nth-child(even) {
    break-after: always;
    page-break-after: always;
  }
}
</style>
