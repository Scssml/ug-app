<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >
      Товар добавлен
    </v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Добавление товара</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-text-field
          label="Название"
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.name"
        ></v-text-field>
        <v-text-field
          label="Цена"
          :rules="[v => !!v || 'Заполните поле']"
          v-model.number="editedItem.price"
          type="number"
        ></v-text-field>
        <v-text-field
          label="На складе"
          :rules="[v => !!v || 'Заполните поле']"
          v-model.number="editedItem.stock"
          type="number"
        ></v-text-field>
        <v-text-field
          label="Сортировка"
          :rules="[v => !!v || 'Заполните поле']"
          v-model.number="editedItem.sort_index"
          type="number"
        ></v-text-field>
        <v-text-field
          label="Цвет"
          :rules="[v => !!v || 'Заполните поле']"
          v-model.number="editedItem.color"
          type="color"
        ></v-text-field>
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
  data() {
    return {
      editedItem: {
        name: '',
        price: 0,
        stock: 0,
        sort_index: 0,
        color: '#FFF',
      },
      createdSuccess: false,
    };
  },
  methods: {
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsGood = Object.assign({}, this.editedItem);
        const url = 'goods';

        axios
          .post(url, propsGood)
          .then(() => {
            this.createdSuccess = true;

            setTimeout(() => {
              this.$emit('cancel', true);
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>
