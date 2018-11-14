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
          link: '#',
        },
        {
          title: 'Клиенты',
          link: '/clients/',
        },
        {
          title: 'Товары',
          link: '#',
        },
        {
          title: 'Оплаты',
          link: '#',
        },
        {
          title: 'Букеты',
          link: '#',
        },
        {
          title: 'Флористы',
          link: '#',
        },
        {
          title: 'Пользователи',
          link: '#',
        },
        {
          title: 'Выход',
          link: '#',
        },
      ],
      yearNow: new Date().getFullYear(),
    };
  },
};
</script>

<style lang="sass">
  .fade-enter, .fade-leave-to { opacity: 0; }
  .fade-enter-active { transition: opacity .5s ease-in-out .5s; }
  .fade-leave-active { transition: opacity .5s ease-in-out; }
</style>
