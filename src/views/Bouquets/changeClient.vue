<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Смена клиента выполнена</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Смена клиента в букете №{{ id }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <autosuggest
          :suggestions="suggestions"
          placeholder="Клиенты"
          :value="client.name"
          @onChange="onInputChange"
          @onSelect="onSelected"
          class="mt-3 view-filter"
        />
        <v-textarea
          label="Комментарий"
          auto-grow
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.description"
          row-height="12"
        ></v-textarea>
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
import Autosuggest from "../../components/Autosuggest";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  components: {
    Autosuggest,
  },
  data() {
    return {
      propsItem: {},
      editedItem: {
        description: null,
        clientId: '',
      },
      createdSuccess: false,
      client: {},
      queryName: '',
      skipClientsQuery: true,
      suggestions: [],
    };
  },
  apollo: {
    clientsList: {
      query: gql`
        query ClientsList($name: String) {
          clientsList: clients(
            where: {
              _or: [{ name: { _ilike: $name } }, { phone: { _ilike: $name } }]
            }
            limit: 50
          ) {
            id
            name
            type: clientType {
              id
            }
            discountPercent: sale
          }
        }
      `,
      update({ clientsList: data }) {
        this.suggestions = [{ data }];

        return data;
      },
      variables() {
        return {
          name: this.queryName
        };
      },
      skip() {
        return this.skipClientsQuery;
      }
    },
  },
  methods: {
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    onSelected(item) {
      this.client = item;
      this.editedItem.clientId = item.id;
    },
    onInputChange(text) {
      this.queryName = `%${text}%`;
      this.skipClientsQuery = false;

      if (text === "") {
        this.editedItem.clientId = "";
      }
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate && this.editedItem.clientId !== '') {
        const propsService = {
          serviceId: this.id,
          managerId: this.$store.getters.getAuthUser,
          comment: this.editedItem.description,
          newClientId: this.editedItem.clientId,
        };

        this.$apollo.mutate({
          mutation: gql`mutation changeServiceRecipient (
            $props: ChangeServiceRecipient!
          ) {
            changeServiceRecipient(input: $props) {
              id
            }
          }`,
          variables: {
            props: propsService,
          },
        }).then(() => {
          this.createdSuccess = true;

          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        }).catch((error) => {
          console.error(error);
        });
      }
    },
  },
};
</script>
