<template>
  <v-container grid-list-lg fluid>
    <v-layout row wrap>
      <template v-for="(prop, index) in filterProps">
        <v-flex
          xs2
          :key="index"
        >
          <template v-if="prop.type === 'date'">
            <v-menu
              :close-on-content-click="false"
              v-model="prop.datepickerShow"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="prop.value"
                :label="prop.title"
                prepend-icon="event"
                readonly
                color="light-blue"
              ></v-text-field>
              <v-date-picker
                v-model="prop.value"
                no-title
                locale="ru-ru"
                @input="prop.datepickerShow = false"
              ></v-date-picker>
            </v-menu>
          </template>

          <template v-if="prop.type === 'select'">
            <v-select
              :items="prop.items"
              v-model="prop.value"
              :label="prop.title"
              color="light-blue"
            ></v-select>
          </template>
        </v-flex>
      </template>
    </v-layout>

    <v-layout row wrap>
      <template
        v-for="(item, index) in requestList"
      >
        <v-flex
          xs4
          :key="index"
        >
          <v-card
            class="my-4"
          >
            <v-card-title class="light-blue lighten-2 white--text">
              <div>Заявка №{{ item.id }}</div>
              <v-spacer></v-spacer>
              <div>{{ item.date }}</div>
            </v-card-title>
            <v-list two-line>
              <v-list-tile
                avatar
              >
                <v-list-tile-content>
                  <v-list-tile-title class="mb-2">{{ item.title }}</v-list-tile-title>
                  <v-list-tile-sub-title>Статус: {{ item.status }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </template>
    </v-layout>

    <div class="text-xs-center">
      <v-btn
        color="light-blue lighten-2"
        dark
        ripple
      >
        Показать еще
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'RequestsList',
  data() {
    return {
      filterProps: [
        {
          title: 'Начальная дата',
          datepickerShow: false,
          type: 'date',
          value: null,
        },
        {
          title: 'Конечная дата',
          datepickerShow: false,
          type: 'date',
          value: null,
        },
        {
          title: 'Статус',
          type: 'select',
          items: [
            'Принята',
            'В рассмотрении',
          ],
          value: null,
        },
      ],
      menuDateStart: false,
      menuDateEnd: false,
      requestList: [
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
        {
          title: 'Подача заявки на ТП',
          status: 'Принята',
          date: '04.08.2018',
          id: 5,
        },
      ],
    };
  },
};
</script>
