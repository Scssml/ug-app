<template>
  <v-card>
    <v-alert
      :value="success"
      type="success"
      class="my-0"
    >Пользователь удален</v-alert>
    <v-card-title
      class="px-4"
    >
      <span class="headline">Удалить?</span>
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
      const itemParams = {
        type: 'users',
        id: this.id,
      };

      this.$store.dispatch('deleteItem', itemParams).then(() => {
        this.success = true;
        setTimeout(() => {
          this.$emit('cancel');
        }, 1000);
      });
    },
  },
};
</script>
