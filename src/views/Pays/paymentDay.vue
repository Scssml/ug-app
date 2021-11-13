<template>
  <div class="statPayBlock">
    <template v-for="(item, key) in paymentTypesSum">
      <v-layout row wrap align-center :key="key">
        <v-flex xs7>
          <b>{{ item.name }}:</b>
        </v-flex>
        <v-flex xs5>
          {{ item.sum }}
        </v-flex>
      </v-layout>
    </template>

    <!-- <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Сумма наличка:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumPayCash }}
      </v-flex>
    </v-layout> -->
    <!-- <template v-for="(item, key) in walletsList">
      <v-layout row wrap align-center :key="key">
        <v-flex xs7>
          <b>{{ item.name }}:</b>
        </v-flex>
        <v-flex xs5>
          {{ item.balance }}
        </v-flex>
      </v-layout>
    </template> -->
    <!-- <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Терминал:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumPayTerminal }}
      </v-flex>
    </v-layout> -->
    <!-- <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Карта:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumPayCard }}
      </v-flex>
    </v-layout> -->
    <!-- <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Яндекс:</b>
      </v-flex>
      <v-flex xs5>
        {{ allSumPayYandex }}
      </v-flex>
    </v-layout> -->
    <!-- <v-layout row wrap align-center>
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
    </v-layout> -->
    <!-- <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Терминал ЮГ-2:</b>
      </v-flex>
      <v-flex xs5>
        {{ terminalUg2 }}
      </v-flex>
    </v-layout> -->
    <!-- <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Тинькофф:</b>
      </v-flex>
      <v-flex xs5>
        {{ tinkoff }}
      </v-flex>
    </v-layout> -->
    <!-- <v-layout row wrap align-center>
      <v-flex xs7>
        <b>Газпром:</b>
      </v-flex>
      <v-flex xs5>
        {{ gazprom }}
      </v-flex>
    </v-layout> -->
    <!-- <v-layout row wrap align-center>
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
    </v-layout> -->

    <v-btn color="info" small @click="dialog = true">Сдать инкассацию</v-btn>
    <v-btn color="info" small @click="dialogCloseDay = true">Закрыть день</v-btn>

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

    <v-dialog v-model="dialogCloseDay" persistent max-width="320px">
      <v-card>
        <v-card-title class="px-4">
          <span class="headline">Закрыть день?</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions class="px-4 py-3">
          <v-btn @click.native="dialogCloseDay = false">Отмена</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="info" @click="closeDay()">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

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
    upadate: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      dateNow: new Date(),
      dateYesterday: '',
      createdSuccess: false,
      dialog: false,
      dialogCloseDay: false,
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
      expenses: 0,
      walletsList: [],

      paymentsList: [],
      paymentTypesList: [
        {
          id: 'gazprom',
          name: 'Газпром',
        },
        {
          id: 'tinkoff',
          name: 'Тинькофф',
        },
        {
          id: 'terminal_ug2',
          name: 'Терминал юг-2',
        },
        {
          id: 'expenses',
          name: 'Расходы',
        },
        {
          id: 'collection',
          name: 'Инкассация',
        },
        {
          id: 'return',
          name: 'Возврат',
        },
        {
          id: 'cashless',
          name: 'Безнал',
        },
        {
          id: 'terminal',
          name: 'Терминал',
        },
        {
          id: 'cart',
          name: 'Карта',
        },
        {
          id: 'yandex',
          name: 'Яндекс',
        },
        {
          id: 'cash',
          name: 'Наличные',
        },
        {
          id: 'balance',
          name: 'На баланс',
        },
      ],
    };
  },
  watch: {
    upadate(val) {
      if (val) {
        this.getPaymentsList();
      }
    },
  },
  computed: {
    paymentTypesSum() {
      return this.paymentTypesList.map((itemType) => {
        let sum = 0;
        const paymentsType = this.paymentsList.filter((item) => item.payment_type === itemType.id);

        if (paymentsType) {
          sum = paymentsType.reduce((total, item) => {
            return total + item.amount;
          }, 0);
        }

        return { sum: sum, ...itemType }
      });
    },
    cashNow() {
      return (
        // this.allSumPayCashPrevDay -
        // this.allSumEncashmentPrevDay +
        this.allSumPayCash -
        this.allSumEncashment -
        this.expenses
      );
    }
  },
  methods: {
    getPaymentsList() {
      const url = 'payments';

      const startCurrentDate = new Date();
      startCurrentDate.setHours(0, 0, 0, 0);
      let dd = startCurrentDate.getDate();
      if (dd < 10) dd = '0' + dd;
      let mm = startCurrentDate.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      let yy = startCurrentDate.getFullYear();
      const startCurrentDateStr = `${yy}-${mm}-${dd}`;

      const endCurrentDate = new Date();
      endCurrentDate.setHours(0, 0, 0, 0);
      endCurrentDate.setDate(endCurrentDate.getDate() + 1);
      dd = endCurrentDate.getDate();
      if (dd < 10) dd = '0' + dd;
      mm = endCurrentDate.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      yy = endCurrentDate.getFullYear();
      const endCurrentDateStr = `${yy}-${mm}-${dd}`;


      const propsItem = {
        start_date: startCurrentDateStr,
        end_date: endCurrentDateStr,
      };

      axios
        .get(url, {
          params: propsItem,
        })
        .then((response) => {
          this.paymentsList = response.data;

          this.$emit('updateComplete', true);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    closeDay() {
      const props = {
        closedBy: this.$store.getters.getAuthUser,
        walletId: null,
      };

      this.walletsList.forEach((item) => {
        const propsCloseDay = Object.assign({}, props);
        propsCloseDay.walletId = item.id;

        // this.$apollo.mutate({
        //   mutation: gql`mutation closeDay (
        //     $props: CloseDay
        //   ) {
        //     closeDay(input: $props) {
        //       id
        //     }
        //   }`,
        //   variables: {
        //     props: propsCloseDay,
        //   },
        // }).then(() => {
        //   this.dialogCloseDay = false;
        // }).catch((error) => {
        //   console.error(error);
        // });
      });
    },
    submit() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsService = {
          clientID: 1904,
          userID: this.$store.getters.getAuthUser,
          payments: [
            {
              paymentTypeId: 8,
              price: this.sumEncashment,
              comment: '',
            },
          ],
        };

        // this.$apollo.mutate({
        //   mutation: gql`mutation createService (
        //     $props: NewService!
        //   ) {
        //     createService(input: $props) {
        //       id
        //     }
        //   }`,
        //   variables: {
        //     props: propsService,
        //   },
        // }).then(() => {
        //   this.createdSuccess = true;
        //   this.refreshPayments();

        //   setTimeout(() => {
        //     this.dialog = false;
        //     this.createdSuccess = false;
        //   }, 1000);
        // }).catch((error) => {
        //   console.error(error);
        // });

        // const itemParams = {
        //   type: "payments",
        //   props: {
        //     paymentType: {
        //       id: 8,
        //       name: "Инкассация",
        //       isActive: true,
        //       code: "collection"
        //     },
        //     amount: this.sumEncashment
        //   }
        // };

        // this.$store.dispatch("addItem", itemParams).then(() => {
        //   this.createdSuccess = true;
        //   this.refreshPayments();

        //   setTimeout(() => {
        //     this.dialog = false;
        //     this.createdSuccess = false;
        //   }, 1000);
        // });
      }
    }
  },
  mounted() {
    this.getPaymentsList();
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
  width: 322px;
  padding: 9px 10px;
  border: 1px solid #ccc;
}
</style>
