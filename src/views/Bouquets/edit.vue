<template>
  <v-card>
    <v-dialog :value="loadingDialog" persistent max-width="320px">
      <v-list>
        <v-list-tile
          v-for="(item, index) in loadingData"
          :key="index"
          avatar
          :color="item.error ? 'red' : item.color"
        >
          <v-list-tile-avatar>
            <v-progress-circular
              :value="100"
              :size="30"
              :color="item.error ? 'red' : item.color"
              :indeterminate="item.loading"
            ></v-progress-circular>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-dialog>
    <template v-if="!loadingDialog">
      <v-alert
        :value="createdSuccess"
        type="success"
        class="my-0"
      >Букет изменен</v-alert>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-card-title
          class="px-4"
        >
          <span class="headline">Просмотр букета №{{ this.editedItem.id }}</span>
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
                :value="(editedItem.client) ? `${editedItem.client.name} (${editedItem.client.phone})` : ''"
                readonly
              ></v-text-field>
              <v-text-field
                label="Флорист"
                :value="(editedItem.florist) ? editedItem.florist.name : ''"
                readonly
              ></v-text-field>
              <v-text-field
                label="Менеджер"
                :value="editedItem.created_by.name"
                readonly
              ></v-text-field>
              <v-text-field
                label="Оформление"
                :value="`${editedItem.decor_cost} (${editedItem.decor_percent}%)`"
                readonly
              ></v-text-field>
              <v-text-field
                label="Оформление (дополнительное)"
                :value="editedItem.sum_decor_additional"
                readonly
                v-if="editedItem.sum_decor_additional"
              ></v-text-field>
              <v-text-field
                label="Скидка"
                :value="`${editedItem.sum_sale} (${editedItem.sale_percent}%)`"
                readonly
              ></v-text-field>
              <v-text-field
                label="Доставка"
                :value="editedItem.delivery_cost"
                readonly
              ></v-text-field>
              <v-textarea
                label="Комментарий к доставке"
                auto-grow
                :value="editedItem.comment"
                row-height="15"
                readonly
              ></v-textarea>
              <v-text-field
                label="Заказ"
                :value="editedItem.order_id"
                readonly
                v-if="editedItem.order_id"
              ></v-text-field>
              <!-- <v-text-field
                label="Букет из заказа"
                :value="editedItem.orderBouquet.name + ' - ' + editedItem.orderBouquet.count + 'шт'"
                readonly
                v-if="editedItem.orderBouquet"
              ></v-text-field>
              <v-textarea
                label="Место букета"
                auto-grow
                row-height="10"
                :rules="[v => !!v || 'Заполните поле']"
                v-model="editedItem.orderBouquet.place"
                v-if="editedItem.orderBouquet"
              ></v-textarea> -->
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
                  v-if="payment.payment_type_id"
                >
                  <v-text-field
                    label="Дата"
                    :value="new Date(payment.created_at).toLocaleString()"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Стоимость"
                    :value="payment.amount"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Тип оплаты"
                    :value="(type = paymentTypes.find((item) => item.id === payment.payment_type_id)) ? type.name : 'Неизвестный тип'"
                    readonly
                  ></v-text-field>
                  <v-textarea
                    label="Комментарий к оплате"
                    auto-grow
                    :value="payment.comment"
                    row-height="20"
                    readonly
                    v-if="payment.comment"
                  ></v-textarea>
                </v-card>
              </template>
            </v-flex>
            <v-flex
              xs12
              px-2
              mt-4
              v-if="editedItem.goods.length"
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
                  <td>{{ props.item.original_price }}</td>
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
          <v-spacer></v-spacer>
          <!-- <v-btn
            color="info"
            @click="submitForm()"
          >Сохранить</v-btn> -->
        </v-card-actions>
      </v-form>
    </template>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loadingData: [
        {
          title: "Получение букета",
          error: false,
          loading: true,
          color: "cyan",
          id: "bouquets"
        },
        {
          title: "Получение типов оплат",
          error: false,
          loading: true,
          color: "cyan",
          id: "payment-types"
        },
      ],
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
          value: 'original_price',
        },
        {
          text: 'Количество',
          align: 'left',
          value: 'count',
        },
      ],
      order: {},
      place: '',
      paymentTypes: [],
    };
  },
  computed: {
    loadingDialog: function loadingDialog() {
      const loadData = this.loadingData.filter(
        item => !item.error && !item.loading
      );
      return loadData.length === this.loadingData.length ? 0 : 1;
    },
  },
  methods: {
    getItem() {
      const loadData = this.loadingData.find(item => item.id === 'bouquets');
      const url = `bouquets/${this.id}`;

      axios
        .get(url)
        .then((response) => {
          const item = response.data;
          this.editedItem = item;

          loadData.title = 'Букет получен!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения букета!';
          loadData.error = true;

          console.log(error);
        });
    },
    getPaymentTypesList() {
      const loadData = this.loadingData.find(item => item.id === 'payment-types');
      const url = 'payment-types';

      axios
        .get(url)
        .then((response) => {
          const items = response.data;
          this.paymentTypes = items;

          loadData.title = 'Типы оплат получены!';
          loadData.loading = false;
        })
        .catch((error) => {
          loadData.title = 'Ошибка получения типов оплат!';
          loadData.error = true;
          console.log(error);
        });
    },
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
  },
  mounted() {
    this.getItem();
    this.getPaymentTypesList();
  }
};
</script>
