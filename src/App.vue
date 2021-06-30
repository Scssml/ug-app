<template>
  <v-app>
    <v-toolbar
      app
      color="blue-grey lighten-4"
      height="42px"
      v-if="!$route.meta.pagePrint"
      class="hidden-sm-and-down print-hidden"
    >
      <v-toolbar-items>
        <template v-for="(item, index) in menuTop">
          <v-btn :to="item.link" :key="index" flat ripple exact>
            {{ item.title }}
          </v-btn>
        </template>
        <v-btn @click="logout()" flat ripple exact>
          Выход
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <transition name="fade">
        <router-view />
      </transition>
    </v-content>

    <v-footer
      height="auto"
      color="blue-grey darken-3"
      dark
      v-if="!$route.meta.pagePrint"
      class="hidden-sm-and-down print-hidden"
    >
      <v-layout justify-center row>
        <v-flex text-xs-center xs12> &copy; {{ yearNow }} </v-flex>
      </v-layout>
    </v-footer>
    <notifications group="global" />
  </v-app>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "App",
  data() {
    return {
      menuTop: [
        {
          title: "Сбор букета",
          link: "/"
        },
        {
          title: "Заказы",
          link: "/orders/"
        },
        {
          title: "Клиенты",
          link: "/clients/"
        },
        {
          title: "Товары",
          link: "/goods/"
        },
        {
          title: "Оплаты",
          link: "/pays/"
        },
        {
          title: "Букеты",
          link: "/bouquets/"
        },
        {
          title: "Флористы",
          link: "/florists/"
        },
        {
          title: "Курьеры",
          link: "/couriers/"
        },
        {
          title: "Доставки",
          link: "/deliveries/"
        },
        {
          title: "Отчеты",
          link: "/reports/"
        },
        {
          title: "Отзывы",
          link: "/reviews/"
        },
        {
          title: "Пользователи",
          link: "/users/"
        },
        {
          title: "Группы",
          link: "/users-groups/"
        }
      ],
      yearNow: new Date().getFullYear()
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  },
  mounted() {
    this.$store
      .dispatch("autoAuth")
      .then(() => {})
      .catch(() => {
        this.$router.push("/login");
      });

    const socketCouriersGps = io(window.location.origin, {
      path: `${process.env.VUE_APP_API_PREFIX}zont-socket`,
      transports: ["websocket"]
    });

    socketCouriersGps.on("DEVICE_UPDATE", devices => {
      this.$store.commit("setCouriersGps", devices);
    });

    const socketOrders = io(window.location.origin, {
      path: `${process.env.VUE_APP_API_PREFIX}main-socket`,
      transports: ["websocket"]
    });

    socketOrders.on("update_order", () => {
      this.$store.commit("setUpdateOrderList", true);
    });

    socketOrders.on("new_order", () => {
      this.$store.commit("setUpdateOrderList", true);
    });
  }
};
</script>

<style lang="sass">
.fade-enter, .fade-leave-to 
  opacity: 0

.fade-enter-active
  transition: opacity .5s ease-in-out .5s

.fade-leave-active
  transition: opacity .5s ease-in-out

.print-visible
  display: none

.report
  table
    width: 100%
    border-collapse: collapse

    td, th
      padding: 5px
      border: 1px solid #ccc

@media print
  .print-btn
    display: none

  .print-hidden
    display: none

  .print-visible
    display: block

@media (max-width: 959px)
  main.v-content
    padding: 0 !important
</style>
