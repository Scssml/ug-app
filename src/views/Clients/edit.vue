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
          v-model="editedItem.client_type"
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
        <v-text-field
          label="Адрес"
          v-model="editedItem.address"
        ></v-text-field>
        <v-text-field
          label="Квартира"
          v-model.number="editedItem.flat_number"
        ></v-text-field>
        <v-text-field
          label="Этаж"
          v-model.number="editedItem.floor"
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
            v-model="editedItem.birth_day"
            prepend-icon="event"
            hide-details
            readonly
            :rules="[v => !!v || 'Заполните поле']"
            clearable
          ></v-text-field>
          <v-date-picker
            v-model="editedItem.birth_day"
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
          v-if="isCurrentUserAdmin"
        ></v-text-field>
        <v-text-field
          label="Лимит"
          v-model.number="editedItem.limit"
          type="number"
          v-if="isCurrentUserAdmin"
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
import axios from 'axios';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dataPicker: false,
      editedItem: {},
      typeClient: [
        {
          id: 'individual',
          name: 'Физ. лицо',
        },
        {
          id: 'legal',
          name: 'Юр. лицо',
        },
        {
          id: 'counter_party',
          name: 'Контрагент',
        },
        {
          id: 'our',
          name: 'Наш',
        },
      ],
      createdSuccess: false,
    };
  },
  methods: {
    getItem() {
      this.editedItem = {
        active: this.item.active,
        address: this.item.address,
        bill: this.item.bill,
        birth_day: this.item.birth_day.split('T')[0],
        client_type: this.item.client_type,
        flat_number: this.item.flat_number,
        floor: this.item.floor,
        limit: this.item.limit,
        name: this.item.name,
        phone: this.item.phone,
        sale: this.item.sale,
      };
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
        const url = `clients/${this.item.id}`;

        axios
          .post(url, propsItem)
          .then(() => {
            this.createdSuccess = true;

            setTimeout(() => {
              this.$emit('cancel');
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  computed: {
    isCurrentUserAdmin() {
      return this.$store.getters.getAuthUserGroup.code === 'admin';
    },
  },
  mounted() {
    this.getItem();
  },
};
</script>
