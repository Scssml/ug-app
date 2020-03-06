<template>
  <v-dialog v-model="dialogPay" persistent max-width="420px">
    <v-card>
      <v-alert :value="createdSuccess" type="success" class="my-0">
        Букет создан
      </v-alert>
      <v-form ref="form" lazy-validation>
        <v-card-title class="px-4">
          <span class="headline">Оплата заказа</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="px-4">
          <v-text-field
            label="Сумма заказа"
            readonly
            :value="sumOrder"
            v-if="!isEmptySum"
          ></v-text-field>
          <v-text-field
            label="К оплате"
            readonly
            :value="sumPay"
            v-if="!isEmptySum"
          ></v-text-field>
          <v-text-field
            label="Предоплата"
            readonly
            :value="prePayment"
            v-if="!isEmptySum"
          ></v-text-field>
          <v-text-field
            label="К оплате"
            v-model.number="sumPayCustom"
            v-if="isEmptySum"
          ></v-text-field>
          <v-text-field
            label="Сумма"
            :rules="[v => validateTotalSum(v) || 'Заполните поле']"
            v-model="sumClient"
            v-if="!isEmptySum && (partlyPayment || typePay === 1)"
            @keyup="handleFirstSumChange"
            ref="firstSum"
          ></v-text-field>

          <v-select
            label="Способ оплаты"
            :items="typePayList"
            :rules="[v => !!v || 'Заполните поле']"
            item-text="name"
            item-value="id"
            v-model="typePay"
          ></v-select>
          <v-checkbox label="Частичная" v-model="partlyPayment" />
          <v-select
            label="Второй способ оплаты"
            :items="typePayList"
            :rules="[v => !!v || 'Заполните поле']"
            item-text="name"
            item-value="id"
            v-model="secondTypePay"
            v-if="partlyPayment"
          />
          <v-text-field
            label="Вторая сумма"
            :rules="[v => validateTotalSum(v) || 'Заполните поле']"
            v-model="secondSumClient"
            v-if="!isEmptySum && secondTypePay"
            ref="secondSum"
            @keyup="handleSecondSumChange"
          ></v-text-field>
          <v-text-field
            label="Сдача"
            readonly
            :value="sumChange"
            v-if="!isEmptySum && (partlyPayment || typePay === 1)"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-btn @click.native="dialogPay = false">Отмена</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="info" @click="submitForm" :loading="btnLoad"
            >Оплатить
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { ClientTypes, PaymentTypes } from '../constants';

export default {
  name: 'CreatePaymentModal',
  props: {
    sumFlowers: {
      type: Number,
      required: true,
    },
    sumDecor: {
      type: Number,
      required: true,
    },
    sumDecorAdditional: {
      type: Number,
      required: true,
    },
    sumSale: {
      type: Number,
      required: true,
    },
    delivery: {
      type: Number,
      required: true,
    },
    bouquetCount: {
      type: Number,
      required: true,
    },
    prePayment: {
      type: Number,
      required: true,
    },
    sumPayCustom: {
      type: Number,
      required: true,
    },
    paymentTypesList: {
      type: Array,
      required: true,
    },
    client: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      typePay: null,
      secondTypePay: null,
      partlyPayment: false,
      sumClient: 0,
      secondSumClient: 0,
      btnLoad: false,
      dialogPay: false,
    };
  },
  computed: {
    sumOrder: function() {
      return (
        this.sumFlowers +
        +this.sumDecor +
        +this.sumDecorAdditional -
        this.sumSale
      ).toFixed();
    },
    sumPay: function() {
      return +(+this.sumOrder + +this.delivery).toFixed() * +this.bouquetCount;
    },
    isEmptySum() {
      return !(
        this.sumFlowers > 0 ||
        this.sumDecorAdditional > 0 ||
        this.delivery > 0
      );
    },
    typePayList() {
      return this.paymentTypesList.filter(item => {
        if (
          item.id === PaymentTypes.PRESENT &&
          (this.client.type !== ClientTypes.LEGAL || this.goods.length)
        ) {
          return false;
        }

        return this.clientId === 0
          ? item.id != PaymentTypes.BALANCE
          : item.id != PaymentTypes.RETURN;
      });
    },
    sumChange: function() {
      const sum = +this.sumClient + +this.secondSumClient - +this.sumPay;

      return sum > 0 ? sum : 0;
    },
  },
  methods: {
    validateTotalSum(v) {
      return +this.sumClient + +this.secondSumClient >= this.sumPay;
    },
    handleSecondSumChange() {
      this.$refs.firstSum.validate();
    },
    handleFirstSumChange() {
      this.$refs.secondSum && this.$refs.secondSum.validate();
    },
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        this.createdSuccess = true;
        this.btnLoad = true;

        const props = {
          floristId: this.florist,
          clientId: this.clientId,
          orderId: this.order,
          totalCost: this.sumPay / +this.bouquetCount,
          decorPercent: +this.decorPercent,
          decorCost: this.sumDecor + this.sumDecorAdditional,
          deliveryCost: this.delivery,
          salePercent: +this.clientSale,
          sumSale: this.sumSale,
          payment: {
            paymentTypeId: this.typePay,
            amount:
              this.secondTypePay !== PaymentTypes.CASH &&
              this.typePay === PaymentTypes.CASH
                ? +this.sumClient - +this.sumChange
                : +this.sumPay,
            clientId: this.clientId,
            description: '',
          },
          secondPayment: this.partlyPayment
            ? {
                paymentTypeId: this.secondTypePay,
                amount:
                  this.secondTypePay === PaymentTypes.CASH
                    ? +this.secondSumClient - +this.sumChange
                    : +this.secondSumClient,
                clientId: this.clientId,
                description: '',
              }
            : null,
          comment: this.comment,
          orderBouquet: this.orderBouquet,
          bouquetCount: +this.bouquetCount,
        };

        if (this.sumFlowers === 0) {
          props.payment.amount = this.sumPayCustom;
        }

        setTimeout(() => {
          this.dialogPay = false;
          this.$emit('saveProps', props);
        }, 1000);
      }
    },
  },
};
</script>

<style scoped></style>
