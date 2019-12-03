<template>
  <v-card class="order">
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Сохранено</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4 py-2"
      >
        <span class="headline">Настройки</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4 pt-1"
      >
        <!-- <v-layout
          row
          wrap
        >
          <v-flex
            xs3
            px-1
            class="mb-5"
          >
            <v-select
              label="Сортировка по умолчанию"
              :items="propsList"
              :rules="[v => !!v || 'Заполните поле']"
              item-text="name"
              item-value="code"
              v-model.number="settings.sortField"
              hide-details
            ></v-select>
          </v-flex>
          <v-flex
            xs1
          >
            <v-select
              label="Сортировать"
              :items="sortOrder"
              item-text="name"
              item-value="code"
              v-model.number="settings.sortOrder"
              hide-details
            ></v-select>
          </v-flex>
        </v-layout> -->

        <div style="overflow: auto;">
          <v-layout
            row
            nowrap
          >
            <template v-for="(col, colIndex) in settings.orderSettings">
              <v-flex
                px-1
                :key="`col-${colIndex}`"
                class="mb-5"
                style="flex-shrink: 0; flex-basis: 350px; max-width: 350px;"
              >
                <v-layout
                  row
                  wrap
                  align-center
                >
                  <v-flex
                    xs10
                  >
                    <v-text-field
                      label="Название столбца"
                      v-model="col.columnName"
                      hide-details
                      class="mb-2"
                    ></v-text-field>
                  </v-flex>

                  <v-flex
                    xs2
                  >
                    <v-btn
                      small
                      color="error"
                      @click="delCol(colIndex)"
                    >
                      <v-icon dark>delete</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap
                  align-center
                >
                  <v-flex
                    xs8
                  >
                    <v-select
                      label="Свойство"
                      :items="propsList"
                      :rules="[v => !!v || 'Заполните поле']"
                      item-text="name"
                      item-value="code"
                      v-model.number="col.sortField"
                      hide-details
                      class="mb-2"
                    ></v-select>
                  </v-flex>
                  <v-flex
                    xs4
                  >
                    <v-select
                      label="Сортировать"
                      :items="sortOrder"
                      item-text="name"
                      item-value="code"
                      v-model.number="col.sortOrder"
                      hide-details
                      class="mb-2"
                    ></v-select>
                  </v-flex>

                  <v-flex
                    xs12
                  >
                    <v-text-field
                      label="Ширина столбца"
                      v-model.number="col.width"
                      hide-details
                      class="mb-4"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <template v-for="(prop, propIndex) in col.dataFields">
                  <v-card
                    :key="`prop-${colIndex}-${propIndex}`"
                    class="mb-2"
                  >
                    <v-card-text>
                      <v-layout
                        row
                        wrap
                        align-center
                      >
                        <v-flex
                          xs10
                        >
                          <v-select
                            label="Свойство"
                            :items="propsList"
                            :rules="[v => !!v || 'Заполните поле']"
                            item-text="name"
                            item-value="code"
                            v-model.number="prop.field"
                            hide-details
                            class="mb-4"
                          ></v-select>
                        </v-flex>

                        <v-flex
                          xs2
                        >
                          <v-btn
                            small
                            color="error"
                            @click="delProp(colIndex, propIndex)"
                          >
                            <v-icon dark>delete</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                      <v-text-field
                        label="Название свойства в таблице"
                        v-model="prop.displayName"
                        hide-details
                        class="mb-4"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                </template>
                <v-btn
                  fab
                  color="info"
                  @click="addProp(colIndex)"
                >
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-flex>
            </template>
            <v-flex
              xs2
              px-1
            >
              <v-btn
                fab
                color="info"
                @click="addCol()"
              >
                <v-icon dark>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </v-card-text>
      <v-card-actions
        class="px-4 py-2"
      >
        <v-btn
          @click.native="cancel()"
        >Отмена</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="submitForm"
        >Сохранить</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    userSettings: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      settings: {
        // sortField: '',
        // sortOrder: '',
        orderSettings: [],
      },
      propsList: [
        {
          code: 'clientName',
          name: 'Имя клиента',
        },
        {
          code: 'clientPhone',
          name: 'Телефон клиента',
        },
        {
          code: 'clientType',
          name: 'Тип клиента',
        },
        {
          code: 'courier',
          name: 'Курьер',
        },
        {
          code: 'deliveryType',
          name: 'Тип доставки',
        },
        {
          code: 'deliveryDate',
          name: 'Дата доставки',
        },
        {
          code: 'deliveryTime',
          name: 'Время доставки',
        },
        {
          code: 'deliveryTimeOfDayList',
          name: 'Время суток',
        },
        {
          code: 'createdAt',
          name: 'Дата создания заказа',
        },
        {
          code: 'createdBy',
          name: 'Создатель заказа',
        },
        {
          code: 'orderStatus',
          name: 'Статус заказа',
        },
        {
          code: 'orderSourceType',
          name: 'Т/С',
        },
        {
          code: 'id',
          name: 'Номер заказа',
        },
        {
          code: 'orderCost',
          name: 'Сумма заказа',
        },
        {
          code: 'addresseeName',
          name: 'Имя получателя',
        },
        {
          code: 'addresseePhone',
          name: 'Телефон получателя',
        },
        {
          code: 'address',
          name: 'Адрес',
        },
        {
          code: 'entrance',
          name: 'Подъезд',
        },
        {
          code: 'flat',
          name: 'Квартира',
        },
        {
          code: 'floor',
          name: 'Этаж',
        },
        {
          code: 'incognito',
          name: 'Инкогнито',
        },
        {
          code: 'description',
          name: 'Комментарий',
        },
        {
          code: 'bouquets',
          name: 'Букеты',
        },
      ],
      sortOrder: [
        {
          name: 'Нет',
          code: '',
        },
        {
          name: '↑',
          code: 'asc',
        },
        {
          name: '↓',
          code: 'desc',
        },
      ],
      createdSuccess: false,
    };
  },
  methods: {
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    addCol() {
      const newCol = {
        id: this.settings.orderSettings.length + 1,
        columnName: '',
        sortField: '',
        sortOrder: '',
        width: 100,
        dataFields: [],
      };

      this.settings.orderSettings.push(newCol);
    },
    delCol(index) {
      this.settings.orderSettings.splice(index, 1);
    },
    addProp(index) {
      const newProp = {
        id: this.settings.orderSettings.length + 1,
        field: '',
        displayName: '',
      };

      this.settings.orderSettings[index].dataFields.push(newProp);
    },
    delProp(colIndex, propIndex) {
      this.settings.orderSettings[colIndex].dataFields.splice(propIndex, 1);
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        // const propsItem = Object.assign({}, this.editedItem);
        // delete propsItem.id;

        const itemParams = {
          type: `users/${this.$store.getters.getAuthUser}/settings`,
          props: {
            settings: this.settings,
          },
        };

        this.$store.dispatch('addItem', itemParams).then(() => {
          this.createdSuccess = true;
          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        });
      }
    },
  },
  mounted() {
    this.settings.orderSettings = this.userSettings;
  },
};
</script>

<style lang="scss">
  .order.v-card {
    position: relative;
  }
  .order .v-card__text {
    padding-bottom: 52px;
  }
  .order .v-card__actions {
    position: fixed;
    width: 100%;
    bottom: 0;
    background: #fff;
    box-shadow: 0 0 5px;
  }
</style>
