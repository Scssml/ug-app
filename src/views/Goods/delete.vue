<template>
  <v-card>
    <v-alert
      :value="success"
      type="success"
      class="my-0"
    >Товар удален</v-alert>
    <v-card-title
      class="px-4"
    >
      <span class="headline">Удалить товар?</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-actions
      class="px-4 py-3"
    >
      <v-btn
        @click.native="cancel()"
      >Отмена</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        @click="submitForm()"
      >Удалить</v-btn>
    </v-card-actions>
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
      success: false,
    };
  },
  methods: {
    cancel() {
      this.success = false;
      this.$emit('cancel');
    },
    submitForm() {
      const goodId = this.id;

      this.$apollo.mutate({
        mutation: gql`mutation removeGood (
          $props: Int!
        ) {
          removeGood(input: $props)
        }`,
        variables: {
          props: goodId,
        },
      }).then(() => {
        this.success = true;
        setTimeout(() => {
          this.$emit('cancel', true);
        }, 1000);
      }).catch((error) => {
        console.error(error);
      });
    },
  },
};
</script>
