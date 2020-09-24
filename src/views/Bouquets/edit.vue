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
              :value="`${editedItem.client.name} (${editedItem.client.phone})`"
              readonly
            ></v-text-field>
            <v-text-field
              label="Флорист"
              :value="(editedItem.florist) ? editedItem.florist.name : ''"
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
              label="Оформление (дополнительное)"
              :value="editedItem.sumDecorAdditional"
              readonly
              v-if="editedItem.sumDecorAdditional"
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
              :value="editedItem.deliveryComment"
              row-height="15"
              readonly
            ></v-textarea>
            <v-text-field
              label="Заказ"
              :value="editedItem.orderBouquet.orderId"
              readonly
              v-if="editedItem.orderBouquet"
            ></v-text-field>
            <v-text-field
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
                  :value="payment.created_at"
                  readonly
                ></v-text-field>
                <v-text-field
                  label="Стоимость"
                  :value="(payment.paymentType.id === 5) ? `-${payment.amount}` : payment.amount"
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
                  v-if="payment.description"
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
              :items="editedItem.bouquetGoodsMappings"
              hide-actions
              no-data-text="Товаров не найдено"
              no-results-text="Товаров не найдено"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.good.name }}</td>
                <td>{{ props.item.good.price }}</td>
                <td>{{ props.item.goodsCount }}</td>
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
        <v-btn
          color="info"
          @click="submitForm()"
        >Сохранить</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";

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
      order: {},
      place: '',
    };
  },
  apollo: {
    bouquetsList: {
      query: gql`
        query bouquetsList(
          $id: bigint
        ) {
          bouquetsList: bouquets(
            where: {
              id: { _eq: $id }
            }
          ) {
            id
            client {
              name
              phone
            }
            florist {
              name
            }
            user {
              name
            }
            decorCost
            decorPercent
            sumDecorAdditional
            sumSale
            salePercent
            deliveryCost
            deliveryComment
            orderBouquet {
              orderId
              name
              count
              place
            }
            payments {
              created_at
              amount
              paymentType {
                name
                id
              }
              description
            }
            bouquetGoodsMappings {
              good {
                price
                name
              }
              goodsCount
            }
          }
        }
      `,
      variables() {
        return {
          id: this.id,
        };
      },
      update({ bouquetsList }) {
        this.editedItem = bouquetsList.shift();
        this.editedItem.payments = this.editedItem.payments.map((item) => {
          item.created_at = this.formatDate(item.created_at, 'dd.MM.yyyy HH:mm:ss');
          return item;
        });
        this.loading = false;
      },
    },
  },
  methods: {
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const bouquetOrderIndex = this.order.bouquets.findIndex(item => item.id === this.editedItem.orderBouquet.id);
        this.order.bouquets[bouquetOrderIndex].place = this.place;

        const propsItem = Object.assign({}, this.order);
        delete propsItem.id;

        const itemParams = {
          type: 'orders',
          id: this.order.id,
          props: propsItem,
        };

        this.$store.dispatch('updateItem', itemParams).then(() => {
          this.createdSuccess = true;
          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        });
        // const propsItem = Object.assign({}, this.editedItem);
        // delete propsItem.id;

        // const itemParams = {
        //   type: 'payments',
        //   id: this.editedItem.id,
        //   props: propsItem,
        // };

        // this.$store.dispatch('updateItem', itemParams).then(() => {
        //   this.createdSuccess = true;
        //   setTimeout(() => {
        //     this.$emit('cancel');
        //   }, 1000);
        // });
      }
    },
  },
};
</script>
