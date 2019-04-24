<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Клиент изменен</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Изменение клиента</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-select
          label="Тип клиента"
          :items="typeClient"
          :rules="[v => !!v || 'Заполните поле']"
          item-text="name"
          item-value="id"
          v-model="editedItem.type"
          hide-details
          class="mb-4"
        ></v-select>
        <v-text-field
          label="Имя"
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.name"
        ></v-text-field>
        <v-text-field
          label="Телефон"
          v-model="editedItem.phone"
        ></v-text-field>
        <v-menu
          :close-on-content-click="false"
          v-model="dataPicker"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
          class="mb-4"
        >
          <v-text-field
            slot="activator"
            label="День рождения"
            v-model="editedItem.birthDay"
            prepend-icon="event"
            hide-details
            readonly
          ></v-text-field>
          <v-date-picker
            v-model="editedItem.birthDay"
            @input="dataPicker = false"
            no-title
            scrollable
            locale="ru-ru"
            first-day-of-week="1"
          ></v-date-picker>
        </v-menu>
        <v-text-field
          label="Счет"
          v-model.number="editedItem.bill"
          type="number"
        ></v-text-field>
        <v-text-field
          label="Лимит"
          v-model.number="editedItem.credit"
          type="number"
        ></v-text-field>
        <v-text-field
          label="Скидка"
          v-model.number="editedItem.sale"
          type="number"
        ></v-text-field>
        <v-checkbox
          label="Активность"
          v-model="editedItem.active"
          color="primary"
        ></v-checkbox>
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
          @click="submitForm"
        >Сохранить</v-btn>
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
      dataPicker: false,
      editedItem: {},
      typeClient: [],
      createdSuccess: false,
    };
  },
  methods: {
    getItem() {
      if (this.id) {
        const itemParams = {
          type: 'clients',
          id: this.id,
        };

        this.$store.dispatch('getItem', itemParams).then((response) => {
          this.editedItem = response;
          this.editedItem.bill = +this.editedItem.bill;
          this.editedItem.sale = +this.editedItem.sale;
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
          type: 'clients',
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
    getClientTypeList() {
      const itemParams = {
        type: 'client-type',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.typeClient = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
  },
  mounted() {
    this.getItem();
    this.getClientTypeList();
  },
};
</script>