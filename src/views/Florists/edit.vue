<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Флорист изменен</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Изменение флориста</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-text-field
          label="Имя"
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.name"
        ></v-text-field>
        <v-checkbox
          label="Активность"
          v-model="editedItem.active"
          color="primary"
        ></v-checkbox>
        <v-text-field
          label="Адрес"
          v-model="editedItem.address"
        ></v-text-field>
        <v-text-field
          label="Телефон"
          v-model="editedItem.phone"
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
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editedItem: {},
      createdSuccess: false,
    };
  },
  apollo: {
    floristsList: {
      query: gql`
        query floristsList(
          $id: bigint
        ) {
          floristsList: florists(
            where: {
              id: { _eq: $id }
            }
          ) {
            id
            active
            address
            name
            phone
          }
        }
      `,
      variables() {
        return {
          id: this.id,
        };
      },
      update({ floristsList }) {
        this.editedItem = floristsList.shift();
        this.loading = false;
      },
    },
  },
  methods: {
    getItem() {
      if (this.id) {
        const itemParams = {
          type: 'florists',
          id: this.id,
        };

        this.$store.dispatch('getItem', itemParams).then((response) => {
          this.editedItem = response;
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
          type: 'florists',
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
  },
};
</script>
