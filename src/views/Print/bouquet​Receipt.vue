<template>
  <div style="width: 620px; margin: 0 auto">
    <div style="display: flex">
      <header style="display: flex; flex-flow: column; align-items: center; width: 300px">
        <div style="text-transform: uppercase; font-size: 18px;">Товарный чек</div>
        <div>{{ orderData.currentDate }}</div>
        <div>{{ orderData.currentTime }}</div>
      </header>
      <ul
        style="display: flex; flex-flow: column; width: 320px; margin: 0 0 5px 0; font-size: 14px"
      >
        <li style="display: flex; font-size: 12px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Флорист</div>
          <div style="width: calc(320px / 2)">
            <div style="text-align: center">{{ orderData.florist }}</div>
          </div>
        </li>
        <li style="display: flex; font-size: 12px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Получатель</div>
          <div style="width: calc(320px / 2); text-align: center">{{ orderData.recipient }}</div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">№</div>
          <div style="width: calc(320px / 2); text-align: center;">
            {{ orderData.number }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">% ставка на оформление</div>
          <div style="width: calc(320px / 2); text-align: center;">
            {{ orderData.bidForRegistration }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Сумма товара</div>
          <div style="width: calc(320px / 2); text-align: center">
            {{ orderData.amountOfGoods }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Стоимость доставки</div>
          <div style="width: calc(320px / 2); text-align: center">
            {{ orderData.deliveryAmount }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Стоимость оформления</div>
          <div style="width: calc(320px / 2); text-align: center">
            {{ orderData.costOfRegistration }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">% ставка на скидку</div>
          <div style="width: calc(320px / 2); text-align: center;">
            {{ orderData.discountRate }}
          </div>
        </li>
        <li style="display: flex; font-size: 12px;">
          <div style="width: calc(320px / 2); text-align: end"> Сумма скидки</div>
          <div style="width: calc(320px / 2); text-align: center;">
            {{ orderData.discountAmount }}
          </div>
        </li>
        <li style="display: flex ; font-size: 16px">
          <div style="width: calc(320px / 2); text-align: end">К оплате</div>
          <div style="width: calc(320px / 2); text-align: center">{{ Math.abs(orderData.paid) }}</div>
        </li>
      </ul>
    </div>

    <table style="width: 620px; border-collapse: collapse; padding: 2px;">
      <tr>
        <th style="border: 1px solid black">Тип</th>
        <th style="border: 1px solid black">Наименование</th>
        <th style="border: 1px solid black">цена без оформ.</th>
        <th style="border: 1px solid black">цена с оформ.</th>
        <th style="border: 1px solid black">кол-во</th>
      </tr>
      <template v-for="(item, index) in orderData.goods">
        <tr style="padding-left: 5px;" :key="index">
          <td style="border: 1px solid black; padding-left: 5px;">{{ item.type }}</td>
          <td style="border: 1px solid black; padding-left: 5px;">{{ item.name }}</td>
          <td style="border: 1px solid black; padding-left: 5px;">{{ item.price }}</td>
          <td style="border: 1px solid black; padding-left: 5px;">{{ item.priceReg }}</td>
          <td style="border: 1px solid black; padding-left: 5px;">{{ item.quantity }}</td>
        </tr>
      </template>
    </table>
    <br>
    <v-btn
      :color="(orderData.isAlreadyPrinted) ? 'success' : 'primary'"
      dark
      class="mb-4 print-btn"
      @click.prevent="printPage()"
    >{{ (orderData.isAlreadyPrinted) ? 'Повторная печать' : 'Распечатать' }}</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: 0,
      orderData: {},
    };
  },
  methods: {
    getItem() {
      const itemParams = {
        type: 'print/bouquet',
        id: `${this.id}/receipt`,
      };

      this.$store.dispatch('getItem', itemParams).then((response) => {
        const elem = response;

        // if (elem.orderDate) {
        //   const date = new Date(elem.orderDate);
        //   elem.orderDate = date.toLocaleString('ru', {
        //     day: 'numeric',
        //     month: 'numeric',
        //     year: 'numeric',
        //   });
        // }

        this.orderData = elem;
      }).catch(() => {
        console.log('error');
      });
    },
    printPage() {
      window.print();
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getItem();
  },
};
</script>
