<template>
  <v-card
    flat
    width="300"
    style="border-left: 1px solid #ccc; font-size: 16px;"
    :class="($route.query.selectOrder === order) ? 'selected' : ''"
  >
    <div class="px-0" style="height: 30px;">
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
        no-data-text="Не найдено"
        @change="updateProps()"
      ></v-select>
    </div>
    <v-divider></v-divider>
    <div class="px-0" style="height: 30px;">
      <!-- <v-select
        label="Клиент"
        :items="clientsList"
        item-text="name"
        item-value="id"
        solo
        flat
        hide-details
        v-model="client"
        class="scs-small"
        @change="updateProps()"
      ></v-select> -->
      <v-autocomplete
        label="Клиент"
        :items="clientsList"
        :filter="clientsFilter"
        item-text="name"
        item-value="id"
        solo
        flat
        v-model="client"
        hide-details
        class="mb-4 scs-small"
        no-data-text="Не надено"
        @change="updateProps()"
      ></v-autocomplete>
    </div>
    <v-divider></v-divider>
    <v-layout
      row
    >
      <v-flex
        xs5
      >
        <div class="pl-0" style="height: 30px;">
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
            @change="updateProps()"
          ></v-select>
        </div>
      </v-flex>
      <v-flex
        xs7
      >
        <div class="pr-0" style="height: 30px;">
          <v-select
            label="Букет"
            :items="orderBouquets"
            item-text="name"
            item-value="id"
            solo
            flat
            hide-details
            no-data-text="Нет букетов"
            v-model="bouquet"
            class="scs-small"
            @change="updateProps()"
          ></v-select>
        </div>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <div class="px-0" style="height: 30px;">
      <v-text-field
        label="Оформление, %"
        solo
        flat
        hide-details
        v-model="decorPersent"
        class="scs-small"
        @change="updateProps()"
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <!-- <div class="py-1 px-3" style="height: 30px;">
      <span class="px-3">{{ sumFlowers }}</span>
    </div> -->
    <div class="px-0" style="height: 30px;">
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
    <v-layout
      row
      wrap
    >
      <v-flex
        xs3
      >
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="Доставка"
            solo
            flat
            hide-details
            v-model="delivery"
            class="scs-small"
            @change="updateProps()"
          ></v-text-field>
        </div>
      </v-flex>
      <v-flex
        xs9
      >
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="Комментарий"
            solo
            flat
            hide-details
            v-model="comment"
            class="scs-small"
            @change="updateProps()"
          ></v-text-field>
        </div>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <!-- <div class="py-1 px-3" style="height: 30px;">
      <span class="px-3">{{ sumDecor }}</span>
    </div> -->
    <!-- <div class="px-0" style="height: 30px;">
      <v-text-field
        label="0"
        solo
        flat
        hide-details
        :value="sumDecor"
        class="scs-small"
        @input="sumDecorCustom = $event"
        @change="updateProps()"
      ></v-text-field>
    </div> -->
    <v-layout
      row
      wrap
    >
      <v-flex
        xs6
      >
        <div class="px-0" style="height: 30px;">
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
      </v-flex>
      <v-flex
        xs6
      >
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="0"
            solo
            flat
            hide-details
            type="number"
            v-model="sumDecorAdditional"
            class="scs-small"
            @input="updateProps()"
          ></v-text-field>
        </div>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout
      row
      wrap
    >
      <v-flex
        xs6
      >
        <div class="px-0" style="height: 30px;">
          <v-text-field
            label="Скидка, %"
            solo
            flat
            hide-details
            :value="clientSale"
            :background-color="(clientSale > 0) ? 'deep-orange lighten-4' : ''"
            class="scs-small"
            @input="clientSaleCustom = $event"
            @change="updateProps()"
          ></v-text-field>
        </div>
      </v-flex>
      <v-flex
        xs6
      >
        <!-- <div class="py-1 px-3" style="height: 30px;">
          <span class="px-3">{{ sumSale }}</span>
        </div> -->
        <div class="px-0" style="height: 30px;">
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
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <!-- <div class="py-1 px-3" style="height: 30px;">
      <span class="px-3">{{ sumPay }}</span>
    </div> -->
    <div class="pl-0" style="height: 30px;">
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
    <div class="px-0 text-xs-center" style="height: 40px;">
      <v-btn
        color="info"
        @click.native="dialogPay = true"
        small
      >Оплатить</v-btn>
      <v-btn
        @click.native="dialogClear = true"
        flat
        small
        color="error"
        class="mx-0"
      >
        <v-icon dark>clear</v-icon>
      </v-btn>
      <v-btn
        @click.native="$emit('copy')"
        flat
        small
        color="warning"
        class="mx-0"
      >
        <v-icon dark>library_add</v-icon>
      </v-btn>
      <div class="pr-0 input-min" style="height: 30px;">
        <v-text-field
          label="Кол-во"
          solo
          flat
          hide-details
          v-model="bouquetCount"
          class="scs-small text-lg-right"
        ></v-text-field>
      </div>
      <v-btn
        @click="checkCard()"
        flat
        small
        color="gray"
        class="mx-0"
      >
        <v-icon
          dark
          v-if="check"
        >check_box</v-icon>
        <v-icon
          dark
          v-else
        >check_box_outline_blank</v-icon>
      </v-btn>
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
              :rules="[v => (v >= sumPay || typePay === 'На баланс') || 'Заполните поле']"
              v-model="sumClient"
              v-if="typePay !== 'На баланс'"
            ></v-text-field>
            <v-text-field
              label="Сдача"
              readonly
              :value="sumChange"
              v-if="typePay !== 'На баланс'"
            ></v-text-field>
            <v-select
              label="Способ оплаты"
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

    <v-dialog
      v-model="dialogClear"
      persistent
      max-width="320px"
    >
      <v-card>
        <v-card-title
          class="px-4"
        >
          <span class="headline">Очистить?</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions
          class="px-4 py-3"
        >
          <v-btn
            @click.native="dialogClear = false"
          >Отмена</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="$emit('delete')"
          >Очистить</v-btn>
        </v-card-actions>
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
    propsDefault: {
      type: Object,
    },
  },
  data() {
    return {
      createdSuccess: false,
      florist: '',
      client: 0,
      order: '',
      decorPersent: 10,
      delivery: 0,
      comment: '',
      sumDecorAdditional: 0,
      salePersent: null,
      dialogPay: false,
      sumClient: 0,
      typePay: '',
      // typePayList: [
      //   'Наличные',
      //   'На баланс',
      //   'Яндекс',
      //   'Карта',
      //   'Терминал',
      // ],
      dialogClear: false,
      sumDecorCustom: '',
      clientSaleCustom: '',
      check: false,
      orderBouquets: [
        {
          name: 'Букет 1 (2шт)',
          id: 1,
          disabled: false,
        },
        {
          name: 'Букет 2 (1шт)',
          id: 2,
          disabled: false,
        },
        {
          name: 'Букет 3 (0шт)',
          id: 3,
          disabled: true,
        },
      ],
      bouquetCount: 1,
      bouquet: null,
    };
  },
  computed: {
    typePayList() {
      const typePay = [
        'Наличные',
        'Яндекс',
        'Карта',
        'Терминал',
      ];
      if (this.client !== 0) typePay.push('На баланс');
      return typePay;
    },
    clientOrdersList: function clientOrdersList() {
      const ordersList = this.ordersList.filter(item => item.client === this.client);
      return ordersList;
    },
    sumDecor: function decorSum() {
      let sum = 0;
      if (this.sumDecorCustom !== '') {
        sum = this.sumDecorCustom;
      } else {
        sum = Math.ceil(this.sumFlowers * (this.decorPersent / 100));
      }
      return this.priceRound(sum);
    },
    sumSale: function sumSale() {
      const sum = Math.ceil((this.sumFlowers + this.sumDecor) * (this.clientSale / 100));
      return this.priceRound(sum);
    },
    sumPay: function sumPay() {
      let sum = this.sumFlowers;
      sum += this.sumDecor;
      sum += +this.delivery;
      sum += +this.sumDecorAdditional;
      sum -= this.sumSale;
      return this.priceRound(sum);
    },
    sumChange: function sumChange() {
      const sum = this.sumClient - this.sumPay;
      return (sum > 0) ? sum : 0;
    },
    activePayBtn: function activePayBtn() {
      const active = (this.florist !== '') ? 1 : 0;
      return active;
    },
    clientSale: function clientSale() {
      const client = this.clientsList.find(item => item.id === this.client);
      let salePersent = 0;
      if (this.clientSaleCustom !== '') {
        salePersent = this.clientSaleCustom;
      } else if (client !== undefined && client.sale > 0) {
        salePersent = client.sale;
      } else if ((this.sumFlowers + this.sumDecor) >= 3000) {
        salePersent = 5;
      } else {
        salePersent = null;
      }
      return salePersent;
    },
  },
  methods: {
    clearProps() {
      this.florist = 0;
      this.client = 0;
      this.order = 0;
      this.decorPersent = 10;
      this.delivery = 0;
      this.salePersent = null;

      this.dialogClear = false;
      this.updateProps();
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1;
    },
    submitForm: function submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        this.createdSuccess = true;

        const props = {
          date: new Date().toISOString().split('T')[0],
          florist: this.florist,
          user: this.$store.state.authUser,
          client: this.client,
          order: +this.order,
          sum: this.sumFlowers,
          decorPersent: this.decorPersent,
          sumDecor: +this.sumDecor + +this.sumDecorAdditional,
          delivery: +this.delivery,
          salePersent: this.clientSale,
          sumSale: this.sumSale,
          sumPay: this.sumPay,
          typePay: this.typePay,
        };

        setTimeout(() => {
          this.dialogPay = false;
          this.$emit('saveProps', props);
        }, 1000);
      }
    },
    updateProps: function updateProps() {
      const props = {
        // florist: this.florist,
        // client: this.client,
        // order: this.order,
        // decorPersent: this.decorPersent,
        // delivery: this.delivery,
        // salePersent: this.clientSale,


        date: new Date().toISOString().split('T')[0],
        florist: this.florist,
        user: this.$store.state.authUser,
        client: this.client,
        order: +this.order,
        sum: this.sumFlowers,
        decorPersent: this.decorPersent,
        sumDecor: +this.sumDecor + +this.sumDecorAdditional,
        delivery: +this.delivery,
        salePersent: this.clientSale,
        sumSale: this.sumSale,
        sumPay: this.sumPay,
        typePay: this.typePay,
      };

      this.$emit('updateProps', props);
    },
    checkCard() {
      this.check = !this.check;
      this.$emit('checkCard', this.sumPay);
    },
    priceRound: function priceRound(sum) {
      // const remainder = (sum % 10 <= 5 && sum % 10 > 0 && sum > 0) ? -5 : 0;
      // return (Math.ceil(sum / 10) * 10) + remainder;
      return +sum;
    },
    setValueDefault: function setValueDefault() {
      if (Object.keys(this.propsDefault).length > 0) {
        this.florist = this.propsDefault.florist;
        this.client = this.propsDefault.client;
        this.order = this.propsDefault.order;
        this.decorPersent = this.propsDefault.decorPersent;
        this.delivery = this.propsDefault.delivery;
        this.salePersent = this.propsDefault.salePersent;
      }
    },
  },
  updated() {
    // if ((this.salePersent === null || this.salePersent === '')
    //   && (this.sumFlowers + this.sumDecor) >= 5000) {
    //   this.salePersent = 10;
    // }
  },
  created() {
    this.setValueDefault();
  },
};
</script>
