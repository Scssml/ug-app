<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Данные внесены</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Внесение данных бухгалтерии</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-text-field
          label="Сумма"
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.accountingAmounts"
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
      editedItem: {
        accountingAmounts: null,
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
        const propsDayReport = {
          reportId: this.id,
          closedBy: this.$store.getters.getAuthUser,
          accountingAmounts: this.editedItem.accountingAmounts,
        };

        this.$apollo.mutate({
          mutation: gql`mutation verifyDayReport (
            $props: VerifyDayReport!
          ) {
            verifyDayReport(input: $props) {
              id
            }
          }`,
          variables: {
            props: propsDayReport,
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
