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
endPrevDate.setDate(endPrevDate.getDate() - 1);
endPrevDate.setHours(23, 59, 59, 999);

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
      queryValue: 0,

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
    queryValue: {
      query: gql`
        query(
          $todayStartDate: timestamptz
          $todayEndDate: timestamptz
          $prevStartDate: timestamptz
          $prevEndDate: timestamptz
          $cashType: bigint
          $terminalType: bigint
          $cardType: bigint
          $yandexType: bigint
          $encashmentType: bigint
          $ug2Type: bigint
          $tinkoffType: bigint
          $gazpromType: bigint
          $expensesType: bigint
          $returnType: bigint
        ) {
          allSumPayCash: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $cashType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $cardType } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          allSumPayTerminal: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $terminalType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $terminalType } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          allSumPayCard: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $cardType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $cardType } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          allSumPayYandex: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $yandexType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $yandexType } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          allSumEncashment: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $encashmentType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $encashmentType } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          terminalUg2: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $ug2Type } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $ug2Type } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          tinkoff: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $tinkoffType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $tinkoffType } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          gazprom: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $gazpromType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $gazpromType } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          expenses: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $expensesType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $expensesType } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          allSumReturn: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $todayStartDate } }
                    { creation_date: { _lte: $todayEndDate } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          allSumPayCashPrevDay: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $prevStartDate } }
                    { creation_date: { _lte: $prevEndDate } }
                    { paymentTypeId: { _eq: $cashType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $prevStartDate } }
                    { creation_date: { _lte: $prevEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $cardType } }
                    { paymentTypeId: { _eq: $returnType } }
                  ]
                }
              ]
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }
          allSumEncashmentPrevDay: payments_aggregate(
            where: {
              _or: [
                {
                  _and: [
                    { creation_date: { _gte: $prevStartDate } }
                    { creation_date: { _lte: $prevEndDate } }
                    { paymentTypeId: { _eq: $encashmentType } }
                  ]
                }
                {
                  _and: [
                    { creation_date: { _gte: $prevStartDate } }
                    { creation_date: { _lte: $prevEndDate } }
                    { paymentTypeBeforeReturnId: { _eq: $cardType } }
                    { paymentTypeId: { _eq: $encashmentType } }
                  ]
                }
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
      `,
      variables: {
        todayStartDate: startCurrentDate,
        todayEndDate: endCurrentDate,
        prevStartDate: startPrevDate,
        prevEndDate: endPrevDate,
        cashType: PaymentTypes.CASH,
        terminalType: PaymentTypes.TERMINAL,
        cardType: PaymentTypes.CARD,
        yandexType: PaymentTypes.YANDEX,
        returnType: PaymentTypes.RETURN,
        encashmentType: PaymentTypes.COLLECTION,
        ug2Type: PaymentTypes.UG2,
        tinkoffType: PaymentTypes.TINKOFF,
        gazpromType: PaymentTypes.GAZPROM,
        expensesType: PaymentTypes.EXPENSES
      },
      update: function({
        allSumPayCash: {
          aggregate: {
            sum: { amount: allSumPayCash }
          }
        },
        allSumPayTerminal: {
          aggregate: {
            sum: { amount: allSumPayTerminal }
          }
        },
        allSumPayCard: {
          aggregate: {
            sum: { amount: allSumPayCard }
          }
        },
        allSumPayYandex: {
          aggregate: {
            sum: { amount: allSumPayYandex }
          }
        },
        allSumEncashment: {
          aggregate: {
            sum: { amount: allSumEncashment }
          }
        },
        terminalUg2: {
          aggregate: {
            sum: { amount: terminalUg2 }
          }
        },
        tinkoff: {
          aggregate: {
            sum: { amount: tinkoff }
          }
        },
        gazprom: {
          aggregate: {
            sum: { amount: gazprom }
          }
        },
        expenses: {
          aggregate: {
            sum: { amount: expenses }
          }
        },
        allSumPayCashPrevDay: {
          aggregate: {
            sum: { amount: allSumPayCashPrevDay }
          }
        },
        allSumEncashmentPrevDay: {
          aggregate: {
            sum: { amount: allSumEncashmentPrevDay }
          }
        },
        allSumReturn: {
          aggregate: {
            sum: { amount: allSumReturn }
          }
        }
      }) {
        this.allSumPayCashPrevDay = allSumPayCashPrevDay || 0;
        this.allSumPayCash = allSumPayCash || 0;
        this.allSumPayTerminal = allSumPayTerminal || 0;
        this.allSumPayCard = allSumPayCard || 0;
        this.allSumPayYandex = allSumPayYandex || 0;
        this.allSumReturn = allSumReturn || 0;
        this.allSumEncashmentPrevDay = allSumEncashmentPrevDay || 0;
        this.allSumEncashment = allSumEncashment || 0;
        this.terminalUg2 = terminalUg2 || 0;
        this.tinkoff = tinkoff || 0;
        this.gazprom = gazprom || 0;
        this.expenses = expenses || 0;
      }
    }
  },
  computed: {
    cashNow() {
      return (
        this.allSumPayCashPrevDay -
        this.allSumEncashmentPrevDay +
        this.allSumPayCash -
        this.allSumEncashment -
        this.expenses
      );
    }
  },
  methods: {
    refreshPayments() {
      this.$apollo.queries.queryValue.refetch();
    },
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
          this.refreshPayments();

          setTimeout(() => {
            this.dialog = false;
            this.createdSuccess = false;
          }, 1000);
        });
      }
    }
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
