<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-card>
      <v-card-title
        class="print-hidden"
      >
        <v-form
          ref="form"
          lazy-validation
          style="width: 100%"
        >
          <v-layout
            row
            wrap
            align-center
          >
            <v-flex
              xs2
              class="px-2"
            >
              <v-select
                label="Тип отчета"
                :items="reportType"
                item-text="name"
                item-value="id"
                v-model="data.type"
                :rules="[v => !!v || 'Заполните поле']"
                hide-details
                @change="validateForm()"
              ></v-select>
            </v-flex>
            <v-flex
              xs2
              class="px-2"
            >
              <v-menu
                :close-on-content-click="false"
                v-model="dataStartPicker"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Дата (с)"
                  v-model="data.dateStart"
                  prepend-icon="event"
                  hide-details
                  readonly
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
                <v-date-picker
                  v-model="data.dateStart"
                  @input="dataStartPicker = false"
                  @change="validateForm()"
                  no-title
                  scrollable
                  locale="ru-ru"
                  first-day-of-week="1"
                  :max="!!data.dateEnd ? data.dateEnd : undefined"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex
              xs2
              class="px-2"
            >
              <v-menu
                :close-on-content-click="false"
                v-model="dataEndPicker"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Дата (по)"
                  v-model="data.dateEnd"
                  prepend-icon="event"
                  hide-details
                  readonly
                  :rules="[v => !!v || 'Заполните поле']"
                ></v-text-field>
                <v-date-picker
                  v-model="data.dateEnd"
                  @input="dataEndPicker = false"
                  @change="validateForm()"
                  no-title
                  locale="ru-ru"
                  scrollable
                  first-day-of-week="1"
                  :min="!!data.dateStart ? data.dateStart : undefined"
                ></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-title>

      <v-card-text
        class="report"
      >
        <template v-if="validate">
          <courier-stat
            :date-start="data.dateStart"
            :date-end="data.dateEnd"
            v-if="data.type === 'courier_stats'"
          ></courier-stat>

          <florist-stat
            :date-start="data.dateStart"
            :date-end="data.dateEnd"
            v-if="data.type === 'florist_stats'"
          ></florist-stat>

          <client-stat
            :date-start="data.dateStart"
            :date-end="data.dateEnd"
            v-if="data.type === 'client_stat'"
          ></client-stat>

          <manager-stat
            :date-start="data.dateStart"
            :date-end="data.dateEnd"
            v-if="data.type === 'manager_stat'"
          ></manager-stat>
        </template>
      </v-card-text>

      <!-- <v-card-text
        v-html="report"
        class="report"
      ></v-card-text> -->
    </v-card>

    <br>
    <v-btn
      color="primary"
      dark
      class="mb-4 print-btn"
      @click.prevent="printPage()"
    >Распечатать</v-btn>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import courierStat from "./GraphQL/courier.vue";
import floristStat from "./GraphQL/florist.vue";
import clientStat from "./GraphQL/client.vue";
import managerStat from "./GraphQL/manager.vue";

export default {
  components: {
    courierStat,
    floristStat,
    clientStat,
    managerStat,
  },
  data() {
    return {
      dataStartPicker: false,
      dataEndPicker: false,
      data: {
        type: '',
        dateStart: '',
        dateEnd: '',
      },
      reportType: [
        {
          name: 'Курьеры',
          id: 'courier_stats',
        },
        {
          name: 'Флористы',
          id: 'florist_stats',
        },
        {
          name: 'Клиенты',
          id: 'client_stat',
        },
        {
          name: 'Менеджеры',
          id: 'manager_stat',
        },
      ],
      validate: false,
    };
  },
  methods: {
    validateForm() {
      setTimeout(() => {
        this.validate = this.$refs.form.validate();
      }, 300);
    },
    printPage() {
      window.print();
    },
  },
};
</script>

<style lang="scss">
  .report {

    table {
      // width: 100%;
      border-collapse: collapse;

      td, th {
        padding: 5px;
        border: 1px solid #ccc;
      }
    }
  }
</style>
