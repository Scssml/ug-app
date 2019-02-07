<template>
  <v-app>
    <v-toolbar
      app
      color="blue-grey lighten-4"
      height="42px"
    >
      <v-toolbar-items>
        <template
          v-for="(item, index) in menuTop"
        >
          <v-btn
            :to="item.link"
            :key="index"
            flat
            ripple
            exact
          >
            {{ item.title }}
          </v-btn>
        </template>
        <v-btn
          @click="logout()"
          flat
          ripple
          exact
        >
          Выход
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <transition name="fade">
        <router-view/>
      </transition>
    </v-content>
    <v-footer
      height="auto"
      color="blue-grey darken-3"
      dark
    >
      <v-layout
        justify-center
        row
      >
        <v-flex
          text-xs-center
          xs12
        >
          &copy; {{ yearNow }}
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      menuTop: [
        {
          title: 'Сбор букета',
          link: '/',
        },
        {
          title: 'Заказы',
          link: '/orders/',
        },
        {
          title: 'Клиенты',
          link: '/clients/',
        },
        {
          title: 'Товары',
          link: '/goods/',
        },
        {
          title: 'Оплаты',
          link: '/pays/',
        },
        {
          title: 'Букеты',
          link: '/bouquets/',
        },
        {
          title: 'Флористы',
          link: '/florists/',
        },
        {
          title: 'Курьеры',
          link: '/couriers/',
        },
        {
          title: 'Пользователи',
          link: '/users/',
        },
      ],
      yearNow: new Date().getFullYear(),
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login');
      });
    },
  },
  created() {
    this.$store.dispatch('autoAuth').then(() => {
      // this.$router.push('/');
    }).catch(() => {
      this.$router.push('/login');
    });
  },
};
</script>

<style lang="sass">
  .fade-enter, .fade-leave-to { opacity: 0; }
  .fade-enter-active { transition: opacity .5s ease-in-out .5s; }
  .fade-leave-active { transition: opacity .5s ease-in-out; }
</style>
