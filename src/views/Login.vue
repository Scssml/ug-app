<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex
        xs3
        pt-5
      >
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            label="Логин"
            :rules="[v => !!v || 'Заполните поле']"
            v-model="login"
          ></v-text-field>
          <v-text-field
            label="Пароль"
            :rules="[v => !!v || 'Заполните поле']"
            type="password"
            v-model="password"
          ></v-text-field>
          <v-btn
            color="info"
            @click="submitForm"
          >Войти</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      login: '',
      password: '',
    };
  },
  methods: {
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const { login, password } = this;
        this.$store.dispatch('login', { login, password }).then(() => {
          this.$router.push('/');
        });
      }
    },
  },
  mounted() {
    this.$store.dispatch('autoAuth').then(() => {
      this.$router.push('/');
    });
  },
};
</script>
