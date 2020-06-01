<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Средства переброшены</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Переброска средств</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-text-field
          label="Сумма"
          :rules="[v => !!v || 'Заполните поле']"
          v-model.number="amount"
        ></v-text-field>

        <autosuggest
          :suggestions="suggestions"
          placeholder="От кого"
          :value="clientFrom.name"
          @onChange="onInputChange($event, 'from')"
          @onSelect="onSelected($event, 'from')"
          class="mt-3 mb-4 view-filter"
        />

        <autosuggest
          :suggestions="suggestions"
          placeholder="Кому"
          :value="clientTo.name"
          @onChange="onInputChange($event, 'to')"
          @onSelect="onSelected($event, 'to')"
          class="mt-4 mb-4 view-filter"
        />

        <v-textarea
          label="Комментарий"
          auto-grow
          :rules="[v => !!v || 'Заполните поле']"
          v-model="comment"
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
  components: {
    Autosuggest,
  },
  data() {
    return {
      amount: 0,
      comment: '',
      from: null,
      to: null,
      clientsList: [],
      clientFrom: {},
      clientTo: {},
      suggestions: [],
      skipClientsQuery: true,
      queryName: '',
      createdSuccess: false,
    };
  },
  apollo: {
    clientsList: {
      query: gql`
        query ClientsList($name: String) {
          clientsList: clients(
            where: {
              _or: [{ name: { _ilike: $name } }, { phone: { _ilike: $name } }]
              deleted_at: { _is_null: true }
            }
            limit: 50
          ) {
            id
            name
          }
        }
      `,
      update({ clientsList: data }) {
        this.suggestions = [{ data }];

        return data;
      },
      variables() {
        return {
          name: this.queryName,
        };
      },
      skip() {
        return this.skipClientsQuery;
      },
    },
  },
  methods: {
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    onSelected(item, type) {
      if (type === 'from') {
        this.clientFrom = item;
        this.from = item.id;
      } else if (type === 'to') {
        this.clientTo = item;
        this.to = item.id;
      }
    },
    onInputChange(text, type) {
      this.queryName = `%${text}%`;
      this.skipClientsQuery = false;

      if (text === '') {
        if (type === 'from') {
          this.from = null;
        } else if (type === 'to') {
          this.to = null;
        }
      }
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const props = {
          amount: this.amount,
          comment: this.comment,
          from: this.from,
          to: this.to,
          managerId: this.$store.getters.getAuthUser,
        };

        this.$apollo.mutate({
          mutation: gql`mutation moveDebt (
            $props: MoveDebtReq!
          ) {
            moveDebt(input: $props)
          }`,
          variables: {
            props,
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
