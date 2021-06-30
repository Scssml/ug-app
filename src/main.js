// import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vClickOutside from "v-click-outside";
import { createProvider } from "./vue-apollo";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import Notifications from "vue-notification";

console.log(process.env.VUE_APP_SENTRY_ENABLE);
if (process.env.VUE_APP_SENTRY_ENABLE === "true") {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    serverName: process.env.VUE_APP_SENTRY_SERVER_NAME,
    environment: process.env.VUE_APP_SENTRY_ENVIRONMENT,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  });
}

Vue.config.productionTip = false;
window.GOOGLE_API_KEY = process.env.VUE_APP_GOOGLE_MAP_API_KEY;
Vue.use(vClickOutside);
Vue.use(Notifications);

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");
