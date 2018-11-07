<template>
  <v-card
    flat
    width="300"
    style="border-left: 1px solid #ccc; font-size: 16px;"
  >
    <div class="px-3" style="height: 30px;">
      <v-select
        label="Флорист"
        :items="floristsList"
        item-text="name"
        item-value="id"
        solo
        flat
        hide-details
        v-model="florist"
        class="scs-small"
      ></v-select>
    </div>
    <v-divider></v-divider>
    <div class="px-3" style="height: 30px;">
      <v-select
        label="Клиент"
        :items="clientsList"
        item-text="name"
        item-value="id"
        solo
        flat
        hide-details
        v-model="client"
        class="scs-small"
      ></v-select>
    </div>
    <v-divider></v-divider>
    <div class="px-3" style="height: 30px;">
      <v-select
        label="Заказ"
        :items="clientOrdersList"
        item-text="id"
        item-value="id"
        solo
        flat
        hide-details
        no-data-text="Нет заказов"
        v-model="order"
        class="scs-small"
      ></v-select>
    </div>
    <v-divider></v-divider>
    <div class="px-3" style="height: 30px;">
      <v-text-field
        label="Оформление, %"
        solo
        flat
        hide-details
        v-model="decorPersent"
        class="scs-small"
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <!-- <div class="py-1 px-3" style="height: 30px;">
      <span class="px-3">{{ sumFlowers }}</span>
    </div> -->
    <div class="px-3" style="height: 30px;">
      <v-text-field
        label="0"
        solo
        flat
        hide-details
        :value="sumFlowers"
        class="scs-small"
        readonly
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <div class="px-3" style="height: 30px;">
      <v-text-field
        label="Доставка"
        solo
        flat
        hide-details
        v-model="delivery"
        class="scs-small"
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <!-- <div class="py-1 px-3" style="height: 30px;">
      <span class="px-3">{{ sumDecor }}</span>
    </div> -->
    <div class="px-3" style="height: 30px;">
      <v-text-field
        label="0"
        solo
        flat
        hide-details
        :value="sumDecor"
        class="scs-small"
        readonly
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <div class="px-3" style="height: 30px;">
      <v-text-field
        label="Скидка, %"
        solo
        flat
        hide-details
        v-model="salePersent"
        :background-color="(salePersent > 0) ? 'deep-orange lighten-4' : ''"
        class="scs-small"
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <!-- <div class="py-1 px-3" style="height: 30px;">
      <span class="px-3">{{ sumSale }}</span>
    </div> -->
    <div class="px-3" style="height: 30px;">
      <v-text-field
        label="0"
        solo
        flat
        hide-details
        :value="sumSale"
        class="scs-small"
        readonly
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <!-- <div class="py-1 px-3" style="height: 30px;">
      <span class="px-3">{{ sumPay }}</span>
    </div> -->
    <div class="px-3" style="height: 30px;">
      <v-text-field
        label="0"
        solo
        flat
        hide-details
        :value="sumPay"
        class="scs-small"
        readonly
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <div class="px-3 text-xs-center" style="height: 40px;">
      <v-btn
        color="info"
        @click.native="dialogPay = true"
        :disabled="!activePayBtn"
        small
      >Оплатить</v-btn>
    </div>
    <v-divider></v-divider>
    <v-dialog
      v-model="dialogPay"
      persistent
      max-width="420px"
    >
      <v-card>
        <v-alert
          :value="createdSuccess"
          type="success"
          class="my-0"
        >
          Букет создан
        </v-alert>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-card-title
            class="px-4"
          >
            <span class="headline">Оплата заказа</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text
            class="px-4"
          >
            <v-text-field
              label="К оплате"
              readonly
              :value="sumPay"
            ></v-text-field>
            <v-text-field
              label="Сумма"
              :rules="[v => v >= sumPay || 'Заполните поле']"
              v-model="sumClient"
            ></v-text-field>
            <v-text-field
              label="Сдача"
              readonly
              :value="sumChange"
            ></v-text-field>
            <v-select
              label="Тип оплаты"
              :items="typePayList"
              :rules="[v => !!v || 'Заполните поле']"
              v-model="typePay"
            ></v-select>
          </v-card-text>
          <v-card-actions
            class="px-4 pb-4"
          >
            <v-btn
              @click.native="dialogPay = false"
            >Отмена</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="info"
              @click="submitForm"
            >Оплатить</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: 'CreatedBouquetCard',
  props: {
    floristsList: {
      type: Array,
      required: true,
    },
    clientsList: {
      type: Array,
      required: true,
    },
    ordersList: {
      type: Array,
      required: true,
    },
    sumFlowers: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      createdSuccess: false,
      florist: '',
      client: '',
      order: '',
      decorPersent: 10,
      delivery: 0,
      salePersent: null,
      dialogPay: false,
      sumClient: 0,
      typePay: '',
      typePayList: [
        'Наличные',
        'Безнал',
      ],
    };
  },
  computed: {
    clientOrdersList: function clientOrdersList() {
      const ordersList = this.ordersList.filter(item => item.client === this.client);
      return ordersList;
    },
    sumDecor: function decorSum() {
      const sum = Math.ceil(this.sumFlowers * (this.decorPersent / 100));
      return this.priceRound(sum);
    },
    sumSale: function sumSale() {
      const sum = Math.ceil((this.sumFlowers + this.sumDecor) * (this.salePersent / 100));
      return this.priceRound(sum);
    },
    sumPay: function sumPay() {
      const sum = (this.sumFlowers + this.sumDecor + +this.delivery) - this.sumSale;
      return this.priceRound(sum);
    },
    sumChange: function sumChange() {
      const sum = this.sumClient - this.sumPay;
      return (sum > 0) ? sum : 0;
    },
    activePayBtn: function activePayBtn() {
      const active = (!!this.florist && !!this.client) ? 1 : 0;
      return active;
    },
  },
  methods: {
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        this.createdSuccess = true;

        setTimeout(() => {
          this.dialogPay = false;
          this.$emit('createdSuccess', true);
        }, 1000);
      }
    },
    priceRound: function priceRound(sum) {
      const remainder = (sum % 10 <= 5 && sum > 0) ? -5 : 0;
      return (Math.ceil(sum / 10) * 10) + remainder;
    },
  },
  updated() {
    if (this.salePersent === null && (this.sumFlowers + this.sumDecor) >= 5000) {
      this.salePersent = 10;
    }
  },
};
</script>
