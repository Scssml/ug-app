<template>
  <v-dialog v-model="dialogPay" persistent max-width="420px">
    <v-card>
      <v-form ref="form" lazy-validation>
        <v-card-title class="px-4">
          <span class="headline">Оплата заказа</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="px-4">
          <v-text-field
            label="Сумма заказа"
            readonly
            v-model.number="orderPrice"
            v-if="!isPaymentOnBalance"
          ></v-text-field>
          <v-text-field
            label="К оплате"
            readonly
            v-model.number="toPay"
            v-if="!isPaymentOnBalance"
          ></v-text-field>
          <v-text-field
            label="К оплате"
            v-model.number="sumPayCustom"
            v-if="isPaymentOnBalance"
          ></v-text-field>
          <v-text-field
            label="Предоплата"
            readonly
            v-model.number="prePayment"
            v-if="!isPaymentOnBalance"
          ></v-text-field>
          <v-text-field
            label="Сумма"
            :rules="[v => validateTotalSum(v) || 'Заполните поле']"
            v-model.number="sum"
            v-if="canEnterPaymentSum"
            @keyup="handleFirstSumChange"
            ref="firstSum"
          ></v-text-field>
          <v-select
            label="Способ оплаты"
            :items="filteredPaymentTypes"
            :rules="[v => !!v || 'Заполните поле']"
            item-text="name"
            item-value="id"
            v-model="typePay"
          ></v-select>
          <v-checkbox
            label="Частичная"
            v-model="partlyPayment"
            v-if="!hidePartialPayment"
          />
          <v-select
            label="Второй способ оплаты"
            :items="filteredPaymentTypes"
            :rules="[v => !!v || 'Заполните поле']"
            item-text="name"
            item-value="id"
            v-model="secondTypePay"
            v-if="partlyPayment"
          />
          <v-text-field
            label="Вторая сумма"
            :rules="[v => validateTotalSum(v) || 'Заполните поле']"
            v-model.number="secondSum"
            v-if="!isPaymentOnBalance && secondTypePay"
            ref="secondSum"
            @keyup="handleSecondSumChange"
          ></v-text-field>
          <v-text-field
            label="Сдача"
            readonly
            v-model.number="surrender"
            v-if="!isPaymentOnBalance && (partlyPayment || typePay === 1)"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-btn @click="handleCancelButtonClick">Отмена</v-btn>
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
    orderPrice: {
      type: Number,
      required: true,
    },
    toPay: {
      type: Number,
      required: true,
    },
    hidePartialPayment: {
      type: Boolean,
    },
    isPaymentOnBalance: {
      type: Boolean,
    },
  },
  data() {
    return {
      typePay: null,
      secondTypePay: null,
      partlyPayment: false,
      sum: 0,
      secondSum: 0,
      btnLoad: false,
      dialogPay: false,
    };
  },
  computed: {
    canEnterPaymentSum() {
      return (
        !this.isPaymentOnBalance &&
        (this.partlyPayment || this.typePay === PaymentTypes.CASH)
      );
    },
    filteredPaymentTypes() {
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
    surrender: function() {
      const surrender = +this.sum + +this.secondSum - +this.toPay;

      return surrender > 0 ? surrender : 0;
    },
  },
  methods: {
    handleCancelButtonClick() {
      this.btnLoad = false;
      this.dialogPay = false;
    },
    validateTotalSum() {
      return +this.sum + +this.secondSum >= this.toPay;
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
        this.btnLoad = true;

        const props = {
          payment: {
            paymentTypeId: this.typePay,
            amount:
              this.secondTypePay !== PaymentTypes.CASH &&
              this.typePay === PaymentTypes.CASH
                ? +this.sum - +this.surrender
                : +this.toPay,
            clientId: this.clientId,
            description: '',
          },
          secondPayment: this.partlyPayment
            ? {
                paymentTypeId: this.secondTypePay,
                amount:
                  this.secondTypePay === PaymentTypes.CASH
                    ? +this.secondSum - +this.surrender
                    : +this.secondSum,
                clientId: this.clientId,
                description: '',
              }
            : null,
        };

        this.$emit('onPay', props);
      }
    },
  },
};
</script>

<style scoped></style>
