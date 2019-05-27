<template>
  <div
    class="statPayBlock"
  >
    <!-- <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Сумма скидки:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="allSumSale"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Сумма оформления:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="allSumDecor"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Сумма доставки:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="allSumDelivery"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout> -->
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Сумма оплат:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="allSumPay"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Сумма наличка:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="allSumPayCash"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Сумма безнал:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="allSumPayNoCash"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Сумма возвратов:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="allSumReturn"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Остаток в кассе:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="cashPrevDay"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Инкасация:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="allSumEncashment"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs7
      >
        <b>Сейчас в кассе:</b>
      </v-flex>
      <v-flex
        xs5
      >
        <v-text-field
          solo
          flat
          hide-details
          readonly
          :value="cashNow"
          class="scs-small"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-btn
      color="info"
      @click="dialog = true"
    >Сдать инкассацию</v-btn>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="420px"
    >
      <v-card>
        <v-alert
          :value="createdSuccess"
          type="success"
          class="my-0"
        >
          Инкассация сдана
        </v-alert>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-card-title
            class="px-4"
          >
            <span class="headline">Сдача инкассации</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text
            class="px-4"
          >
            <v-text-field
              label="Сумма"
              :rules="[v => (v <= cashNow) || 'Недостаточно денег в кассе']"
              v-model.number="sumEncashment"
            ></v-text-field>
          </v-card-text>
          <v-card-actions
            class="px-4 pb-4"
          >
            <v-btn
              @click.native="dialog = false"
            >Отмена</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="info"
              @click="submit()"
            >Оплатить</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // bouquetsList: {
    //   type: Array,
    //   required: true,
    // },
    paymentsList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      createdSuccess: false,
      dialog: false,
      cashPrevDay: 0,
      sumEncashment: 0,
    };
  },
  computed: {
    // allSumSale() {
    //   const allSum = this.bouquetsList.reduce((sum, item) => {
    //     const subtotal = sum + item.sumSale;
    //     return subtotal;
    //   }, 0);
    //   return allSum;
    // },
    // allSumDecor() {
    //   const allSum = this.bouquetsList.reduce((sum, item) => {
    //     const subtotal = sum + item.decorCost;
    //     return subtotal;
    //   }, 0);
    //   return allSum;
    // },
    // allSumDelivery() {
    //   const allSum = this.bouquetsList.reduce((sum, item) => {
    //     const subtotal = sum + item.deliveryCost;
    //     return subtotal;
    //   }, 0);
    //   return allSum;
    // },
    // allSumPay() {
    //   const allSum = this.bouquetsList.reduce((sum, item) => {
    //     const allPaySum = item.payments.reduce((sumPay, payment) => {
    //       let amountPay = 0;
    //       if (payment.paymentType.id !== 7) {
    //         amountPay = payment.amount;
    //       }
    //       return sumPay + amountPay;
    //     }, 0);
    //     return sum + allPaySum;
    //   }, 0);
    //   return allSum;
    // },
    allSumPay() {
      const allSum = this.paymentsList.reduce((sum, item) => {
        let amountPay = 0;
        if (item.paymentType.id !== 7 && item.paymentType.id !== 8) {
          amountPay = item.amount;
        }
        return sum + amountPay;
      }, 0);
      return allSum;
    },
    // allSumPayCash() {
    //   const allSum = this.bouquetsList.reduce((sum, item) => {
    //     const allPaySum = item.payments.reduce((sumPay, payment) => {
    //       let amountPay = 0;
    //       if (payment.paymentType.id === 1) {
    //         amountPay = payment.amount;
    //       }
    //       return sumPay + amountPay;
    //     }, 0);
    //     return sum + allPaySum;
    //   }, 0);
    //   return allSum;
    // },
    allSumPayCash() {
      const allSum = this.paymentsList.reduce((sum, item) => {
        let amountPay = 0;
        if (item.paymentType.id === 1) {
          amountPay = item.amount;
        }
        return sum + amountPay;
      }, 0);
      return allSum;
    },
    // allSumPayNoCash() {
    //   const allSum = this.bouquetsList.reduce((sum, item) => {
    //     const allPaySum = item.payments.reduce((sumPay, payment) => {
    //       let amountPay = 0;
    //       if (payment.paymentType.id !== 1 && payment.paymentType.id !== 7) {
    //         amountPay = payment.amount;
    //       }
    //       return sumPay + amountPay;
    //     }, 0);
    //     return sum + allPaySum;
    //   }, 0);
    //   return allSum;
    // },
    allSumPayNoCash() {
      const allSum = this.paymentsList.reduce((sum, item) => {
        let amountPay = 0;
        if (item.paymentType.id !== 1 && item.paymentType.id !== 7 && item.paymentType.id !== 8) {
          amountPay = item.amount;
        }
        return sum + amountPay;
      }, 0);
      return allSum;
    },
    // allSumReturn() {
    //   const allSum = this.bouquetsList.reduce((sum, item) => {
    //     const allPaySum = item.payments.reduce((sumPay, payment) => {
    //       let amountPay = 0;
    //       if (payment.paymentType.id === 7) {
    //         amountPay = payment.amount;
    //       }
    //       return sumPay + amountPay;
    //     }, 0);
    //     return sum + allPaySum;
    //   }, 0);
    //   return allSum;
    // },
    allSumReturn() {
      const allSum = this.paymentsList.reduce((sum, item) => {
        let amountPay = 0;
        if (item.paymentType.id === 7) {
          amountPay = item.amount;
        }
        return sum + amountPay;
      }, 0);
      return allSum;
    },
    allSumEncashment() {
      const allSum = this.paymentsList.reduce((sum, item) => {
        let amountPay = 0;
        if (item.paymentType.id === 8) {
          amountPay = item.amount;
        }
        return sum + amountPay;
      }, 0);
      return allSum;
    },
    cashNow() {
      let allSum = this.cashPrevDay + this.allSumPayCash;
      allSum -= this.allSumEncashment;
      return allSum;
    },
  },
  methods: {
    submit() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const itemParams = {
          type: 'payments',
          props: {
            paymentType: {
              id: 8,
              name: 'Инкассация',
              isActive: true,
              code: 'collection',
            },
            amount: this.sumEncashment,
          },
        };

        this.$store.dispatch('addItem', itemParams).then(() => {
          this.createdSuccess = true;
          this.$emit('input');

          setTimeout(() => {
            this.dialog = false;
            this.createdSuccess = false;
          }, 1000);
        });
      }
    },
  },
};
</script>

<style lang="scss">
  .statPayBlock {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background: #fff;
    width: 260px;
    padding: 9px 10px;
    border: 1px solid #ccc;
  }
</style>
