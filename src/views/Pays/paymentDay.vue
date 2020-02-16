<template>
  <div class="statPayBlock">
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Сумма наличка:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumPayCash }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Терминал:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumPayTerminal }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Карта:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumPayCard }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Яндекс:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumPayYandex }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Сумма возвратов:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumReturn }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Инкасация:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumEncashment }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Терминал ЮГ-2:</b>
      </v-flex>
      <v-flex xs5>
        {{ terminalUg2 }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Тинькофф:</b>
      </v-flex>
      <v-flex xs5>
        {{ tinkoff }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Газпром:</b>
      </v-flex>
      <v-flex xs5>
        {{ gazprom }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Расход:</b>
      </v-flex>
      <v-flex xs5>
        {{ expenses }}
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Сейчас в кассе:</b>
      </v-flex>
      <v-flex xs5>
        {{ cashNow }}
      </v-flex>
    </v-layout>

    <v-btn color="info" @click="dialog = true">Сдать инкассацию</v-btn>

    <v-dialog v-model="dialog" persistent max-width="420px">
      <v-card>
        <v-alert :value="createdSuccess" type="success" class="my-0">
          Инкассация сдана
        </v-alert>
        <v-form ref="form" lazy-validation>
          <v-card-title class="px-4">
            <span class="headline">Сдача инкассации</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="px-4">
            <v-text-field
              label="Сумма"
              :rules="[v => v <= cashNow || 'Недостаточно денег в кассе']"
              v-model.number="sumEncashment"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn @click.native="dialog = false">Отмена</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="info" @click="submit()">Оплатить</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { PaymentTypes } from "../../constants";
import gql from "graphql-tag";

const startCurrentDate = new Date();
startCurrentDate.setHours(0, 0, 0, 0);

const endCurrentDate = new Date();
endCurrentDate.setHours(23, 59, 59, 999);

const startPrevDate = new Date();
startPrevDate.setDate(startPrevDate.getDate() - 1);
startPrevDate.setHours(0, 0, 0, 0);

const endPrevDate = new Date();
endPrevDate.setDate(startPrevDate.getDate() - 1);
endPrevDate.setHours(23, 59, 59, 999);

const simplePaymentQuery = gql`
  query($startDate: timestamptz, $endDate: timestamptz, $type: bigint) {
    payments_aggregate(
      where: {
        _and: [
          { creation_date: { _gte: $startDate } }
          { creation_date: { _lte: $endDate } }
          { paymentTypeId: { _eq: $type } }
        ]
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`;

const getValueFromPaymentSimpleQuery = ({
  payments_aggregate: {
    aggregate: {
      sum: { amount }
    }
  }
}) => amount || 0;

export default {
  props: {
    paymentsList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dateNow: new Date(),
      dateYesterday: "",
      createdSuccess: false,
      dialog: false,
      sumEncashment: 0,

      allSumPayCashPrevDay: 0,
      allSumPayCash: 0,
      allSumPayTerminal: 0,
      allSumPayCard: 0,
      allSumPayYandex: 0,
      allSumReturn: 0,
      allSumEncashmentPrevDay: 0,
      allSumEncashment: 0,
      terminalUg2: 0,
      tinkoff: 0,
      gazprom: 0,
      expenses: 0
    };
  },
  apollo: {
    allSumPayCash: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.CASH
      },
      update: getValueFromPaymentSimpleQuery
    },
    allSumPayTerminal: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.TERMINAL
      },
      update: getValueFromPaymentSimpleQuery
    },
    allSumPayCard: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.CARD
      },
      update: getValueFromPaymentSimpleQuery
    },
    allSumPayYandex: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.YANDEX
      },
      update: getValueFromPaymentSimpleQuery
    },
    allSumReturn: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.RETURN
      },
      update: getValueFromPaymentSimpleQuery
    },
    allSumEncashment: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.COLLECTION
      },
      update: getValueFromPaymentSimpleQuery
    },
    terminalUg2: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.UG2
      },
      update: getValueFromPaymentSimpleQuery
    },
    tinkoff: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.TINKOFF
      },
      update: getValueFromPaymentSimpleQuery
    },
    gazprom: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.GAZPROM
      },
      update: getValueFromPaymentSimpleQuery
    },
    expenses: {
      query: simplePaymentQuery,
      variables: {
        startDate: startCurrentDate,
        endDate: endCurrentDate,
        type: PaymentTypes.EXPENSES
      },
      update: getValueFromPaymentSimpleQuery
    },
    allSumPayCashPrevDay: {
      query: simplePaymentQuery,
      variables: {
        startDate: startPrevDate,
        endDate: endPrevDate,
        type: PaymentTypes.CASH
      },
      update: getValueFromPaymentSimpleQuery
    },
    allSumEncashmentPrevDay: {
      query: simplePaymentQuery,
      variables: {
        startDate: startPrevDate,
        endDate: endPrevDate,
        type: PaymentTypes.COLLECTION
      },
      update: getValueFromPaymentSimpleQuery
    }
  },
  computed: {
    cashNow() {
      return (
        this.allSumPayCashPrevDay -
        this.allSumEncashmentPrevDay +
        this.allSumPayCash -
        this.allSumEncashment
      );
    }
  },
  methods: {
    submit() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const itemParams = {
          type: "payments",
          props: {
            paymentType: {
              id: 8,
              name: "Инкассация",
              isActive: true,
              code: "collection"
            },
            amount: this.sumEncashment
          }
        };

        this.$store.dispatch("addItem", itemParams).then(() => {
          this.createdSuccess = true;
          this.$emit("input");

          setTimeout(() => {
            this.dialog = false;
            this.createdSuccess = false;
          }, 1000);
        });
      }
    }
  },
  mounted() {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() - 1);
    const dateYesterdayStr = dateNow.toISOString().split("T")[0];
    this.dateYesterday = dateYesterdayStr;
  }
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
