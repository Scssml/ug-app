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
          v-model.number="editedItem.stockBalance"
          type="number"
        ></v-text-field>
        <v-text-field
          label="Сортировка"
          :rules="[v => !!v || 'Заполните поле']"
          v-model.number="editedItem.sortIndex"
          type="number"
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
import gql from "graphql-tag";

export default {
  data() {
    return {
      editedItem: {
        name: '',
        price: 0,
        stockBalance: 0,
        sortIndex: 0,
        color: '',
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

        this.$apollo.mutate({
          mutation: gql`mutation {
            createGood(input:{
              name: "${propsGood.name}"
              price: ${propsGood.price}
              sortIndex: ${propsGood.sortIndex}
              stockBalance: ${propsGood.stockBalance}
              color: "${propsGood.color}"
            }) {
              id
            }
          }`,
        }).then(() => {
          this.createdSuccess = true;

          setTimeout(() => {
            this.$emit('cancel', true);
          }, 1000);
        }).catch((error) => {
          console.error(error);
        });
      }
    },
  },
};
</script>
