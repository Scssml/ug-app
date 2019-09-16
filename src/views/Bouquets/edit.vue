<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Букет изменен</v-alert>
    <v-form
      ref="form"
      lazy-validation
      v-if="!loading"
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Просмотр букета №{{ id }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-layout
          row
          wrap
        >
          <v-flex
            xs6
            px-2
          >
            <p class="title mb-4">Букет</p>
            <v-text-field
              label="Клиент"
              :value="`${editedItem.client.name} (${editedItem.client.phone})`"
              readonly
            ></v-text-field>
            <v-text-field
              label="Флорист"
              :value="editedItem.florist"
               readonly
            ></v-text-field>
            <v-text-field
              label="Менеджер"
              :value="editedItem.user.name"
              readonly
            ></v-text-field>
            <v-text-field
              label="Оформление"
              :value="`${editedItem.decorCost} (${editedItem.decorPercent}%)`"
              readonly
            ></v-text-field>
            <v-text-field
              label="Скидка"
              :value="`${editedItem.sumSale} (${editedItem.salePercent}%)`"
              readonly
            ></v-text-field>
            <v-text-field
              label="Доставка"
              :value="editedItem.deliveryCost"
              readonly
            ></v-text-field>
            <v-textarea
              label="Комментарий к доставке"
              auto-grow
              :value="editedItem.comment"
              row-height="15"
              readonly
            ></v-textarea>
          </v-flex>

          <v-flex
            xs6
            px-2
          >
            <p class="title mb-4">Оплаты</p>
            <template v-for="(payment, index) in editedItem.payments">
              <v-card
                :key="index"
                flat
              >
                <v-text-field
                  label="Дата"
                  :value="payment.creationDate"
                  readonly
                ></v-text-field>
                <v-text-field
                  label="Стоимость"
                  :value="payment.amount"
                  readonly
                ></v-text-field>
                <v-text-field
                  label="Тип оплаты"
                  :value="payment.paymentType.name"
                  readonly
                ></v-text-field>
                <v-textarea
                  label="Комментарий к оплате"
                  auto-grow
                  :value="payment.description"
                  row-height="20"
                  readonly
                  v-if="payment.paymentType.id === 7"
                ></v-textarea>
              </v-card>
            </template>
          </v-flex>
          <v-flex
            xs12
            px-2
            mt-4
          >
            <p class="title mb-4">Товары</p>
            <v-data-table
              :headers="headersTableGoods"
              :items="editedItem.goods"
              hide-actions
              no-data-text="Товаров не найдено"
              no-results-text="Товаров не найдено"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.good.name }}</td>
                <td>{{ props.item.good.price }}</td>
                <td>{{ props.item.count }}</td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions
        class="px-4 pb-4"
      >
        <v-btn
          @click.native="cancel()"
        >Отмена</v-btn>
        <!-- <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="submitForm"
        >Сохранить</v-btn> -->
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      editedItem: {},
      createdSuccess: false,
      headersTableGoods: [
        {
          text: 'Название',
          align: 'left',
          value: 'good.name',
        },
        {
          text: 'Стоимость',
          align: 'left',
          value: 'good.price',
        },
        {
          text: 'Количество',
          align: 'left',
          value: 'count',
        },
      ],
    };
  },
  methods: {
    getItem() {
      if (this.id) {
        const itemParams = {
          type: 'bouquets',
          id: this.id,
        };

        this.$store.dispatch('getItem', itemParams).then((response) => {
          this.editedItem = response;
          this.loading = false;
        }).catch(() => {
          console.log('error');
        });
      }
    },
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsItem = Object.assign({}, this.editedItem);
        delete propsItem.id;

        const itemParams = {
          type: 'payments',
          id: this.id,
          props: propsItem,
        };

        this.$store.dispatch('updateItem', itemParams).then(() => {
          this.createdSuccess = true;
          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        });
      }
    },
  },
  mounted() {
    this.getItem();
  },
};
</script>
