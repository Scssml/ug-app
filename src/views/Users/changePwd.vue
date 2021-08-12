<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Пароль изменен</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Изменение пароля</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-text-field
          label="Пароль"
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.password"
          type="password"
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
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editedItem: {
        password: '',
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
        const propsItem = Object.assign({}, this.editedItem);
        const url = `users/${this.id}`;

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
};
</script>
