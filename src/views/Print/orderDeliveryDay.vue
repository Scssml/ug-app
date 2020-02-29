<template>
  <div>
    <v-card-text
      v-html="report"
      class="report"
    ></v-card-text>
    <!-- <table style="width: 620px; border-collapse: collapse; padding: 2px;">
      <tr>
        <th style="border: 1px solid black">
          Номер
        </th>
        <th style="border: 1px solid black">
          ФИО
        </th>
        <th style="border: 1px solid black">
          Тип
        </th>
        <th style="border: 1px solid black">
          Время доставки
        </th>
        <th style="border: 1px solid black">
          Комментарий
        </th>
      </tr>
      <template v-for="(elem, index) in ordersList">
        <tr :key="index">
          <td style="border: 1px solid black; text-align: center;">{{ elem.id }}</td>
          <td style="border: 1px solid black; text-align: center;">{{ elem.name }}</td>
          <td style="border: 1px solid black; text-align: center;">{{ elem.deliveryType }}</td>
          <td style="border: 1px solid black; text-align: center;">{{ elem.deliveryTime }}</td>
          <td style="border: 1px solid black; text-align: center;">{{ elem.description }}</td>
        </tr>
      </template>
    </table> -->
    <br>
    <v-btn
      color="primary"
      dark
      class="mb-4 print-btn"
      @click.prevent="printPage()"
    >Распечатать</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: '',
      // ordersList: {},
      report: '',
    };
  },
  methods: {
    getItems() {
      const itemParams = {
        type: 'print/day-orders',
        id: `${this.date}`,
      };

      this.$store.dispatch('getItem', itemParams).then((response) => {
        // this.ordersList = response;
        this.report = response;
      }).catch(() => {
        console.log('error');
      });
    },
    printPage() {
      window.print();
    },
  },
  mounted() {
    this.date = this.$route.params.date;
    this.getItems();
  },
};
</script>

<style lang="scss">
  .report {

    table {
      width: 100%;
      border-collapse: collapse;

      td, th {
        padding: 5px;
        border: 1px solid #ccc;
      }
    }
  }
</style>
