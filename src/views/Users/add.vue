<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Пользователь добавлен</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Добавление пользователя</span>
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
        <v-text-field
          label="Логин"
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.login"
        ></v-text-field>
        <v-text-field
          label="Пароль"
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.password"
          type="password"
        ></v-text-field>
        <v-select
          label="Группа"
          :items="usersGroupsList"
          :rules="[v => !!v || 'Заполните поле']"
          item-text="name"
          item-value="id"
          v-model="editedItem.group"
        ></v-select>
        <v-checkbox
          label="Активность"
          v-model="editedItem.isActive"
          color="primary"
        ></v-checkbox>
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
export default {
  data() {
    return {
      editedItem: {
        name: '',
        login: '',
        password: '',
        group: 0,
        isActive: true,
      },
      createdSuccess: false,
      usersGroupsList: [],
    };
  },
  methods: {
    getUsersGroupsList() {
      const itemParams = {
        type: 'users-groups',
        filter: {
          isActive: true,
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.usersGroupsList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
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

        const itemParams = {
          type: 'users',
          props: propsItem,
        };

        this.$store.dispatch('addItem', itemParams).then(() => {
          this.createdSuccess = true;
          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        });
      }
    },
  },
  mounted() {
    this.getUsersGroupsList();
  },
};
</script>
