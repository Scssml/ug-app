<template>
  <div style="width: 620px; margin: 0 auto">
    <div style="display: flex">
      <header style="display: flex; flex-flow: column; align-items: center; width: 300px">
        <div style="text-transform: uppercase; font-size: 18px;">Товарный чек</div>
        <div contenteditable>{{ orderData.created_at_date }}</div>
        <div contenteditable>{{ orderData.created_at_time }}</div>
      </header>
      <ul
        style="display: flex; flex-flow: column; width: 320px; margin: 0 0 5px 0; font-size: 14px"
      >
        <li style="display: flex; font-size: 12px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Флорист</div>
          <div style="width: calc(320px / 2)">
            <div style="text-align: center">
              <template v-if="orderData.florist">
                {{ orderData.florist.name }}
              </template>
            </div>
          </div>
        </li>
        <li style="display: flex; font-size: 12px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Получатель</div>
          <div style="width: calc(320px / 2); text-align: center">{{ orderData.client.name }}</div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">№</div>
          <div style="width: calc(320px / 2); text-align: center;">
            {{ orderData.id }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">% ставка на оформление</div>
          <div style="width: calc(320px / 2); text-align: center;">
            {{ orderData.decorPercent }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Сумма товара</div>
          <div style="width: calc(320px / 2); text-align: center">
            {{ orderData.goodsSum }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Стоимость доставки</div>
          <div style="width: calc(320px / 2); text-align: center">
            {{ orderData.deliveryCost }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">Стоимость оформления</div>
          <div style="width: calc(320px / 2); text-align: center">
            {{ orderData.decorCost + orderData.sumDecorAdditional }}
          </div>
        </li>
        <li style="display: flex; font-size: 16px; font-weight: 600">
          <div style="width: calc(320px / 2); text-align: end">% ставка на скидку</div>
          <div style="width: calc(320px / 2); text-align: center;">
            {{ orderData.salePercent }}
          </div>
        </li>
        <li style="display: flex; font-size: 12px;">
          <div style="width: calc(320px / 2); text-align: end"> Сумма скидки</div>
          <div style="width: calc(320px / 2); text-align: center;">
            {{ orderData.sumSale }}
          </div>
        </li>
        <li style="display: flex ; font-size: 16px">
          <div style="width: calc(320px / 2); text-align: end">К оплате</div>
          <div style="width: calc(320px / 2); text-align: center">{{ orderData.totalCost }}</div>
        </li>
      </ul>
    </div>

    <table style="width: 620px; border-collapse: collapse; padding: 2px;">
      <tr>
        <th style="border: 1px solid black">Тип</th>
        <th style="border: 1px solid black">Наименование</th>
        <th style="border: 1px solid black">цена без оформ.</th>
        <th style="border: 1px solid black">цена с оформ.</th>
        <th style="border: 1px solid black">кол-во</th>
      </tr>
      <template v-for="(item, index) in orderData.bouquetGoodsMappings">
        <tr style="padding-left: 5px;" :key="index">
          <td style="border: 1px solid black; padding-left: 5px;"></td>
          <td style="border: 1px solid black; padding-left: 5px;">{{ item.good.name }}</td>
          <td style="border: 1px solid black; padding-left: 5px;">{{ item.sum }}</td>
          <td style="border: 1px solid black; padding-left: 5px;">{{ item.sumDecor }}</td>
          <td style="border: 1px solid black; padding-left: 5px;">{{ item.goodsCount }}</td>
        </tr>
      </template>
    </table>
    <br>
    <v-btn
      :color="(orderData.isAlreadyPrinted) ? 'success' : 'primary'"
      dark
      class="mb-4 print-btn"
      @click.prevent="printPage()"
    >{{ (orderData.isAlreadyPrinted) ? 'Повторная печать' : 'Распечатать' }}</v-btn>
  </div>
</template>

<script>
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";

export default {
  data() {
    return {
      id: 0,
      orderData: {},
    };
  },
  apollo: {
    floristsList: {
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
            created_at
            florist {
              name
            }
            client {
              name
            }
            id
            decorPercent
            bouquetGoodsMappings {
              goodsCount
              good {
                name
                price
              }
            }
            deliveryCost
            decorCost
            sumDecorAdditional
            salePercent
            sumSale
            totalCost
          }
        }
      `,
      variables() {
        return {
          id: this.id,
        };
      },
      update({ bouquetsList }) {
        this.orderData = bouquetsList.shift();
        this.orderData.created_at = this.formatDate(this.orderData.created_at, 'dd.MM.yyyy HH:mm:ss');

        const createdAt = this.orderData.created_at.split(' ');
        [this.orderData.created_at_date, this.orderData.created_at_time] = createdAt;

        const countGoods = this.orderData.bouquetGoodsMappings.reduce((sum, item) => {
          return item.goodsCount + sum;
        }, 0);

        const decorOneGood = Math.ceil((this.orderData.decorCost + this.orderData.sumDecorAdditional) / countGoods);

        this.orderData.bouquetGoodsMappings = this.orderData.bouquetGoodsMappings.map((item) => {
          item.sum = item.good.price * item.goodsCount;
          item.sumDecor = (item.good.price + decorOneGood) * item.goodsCount;
          return item;
        });

        this.orderData.goodsSum = this.orderData.bouquetGoodsMappings.reduce((sum, item) => {
          return item.sum + sum;
        }, 0);
      },
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
    printPage() {
      window.print();
    },
  },
  mounted() {
    this.id = this.$route.params.id;
  },
};
</script>
