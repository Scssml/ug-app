import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
window.GOOGLE_API_KEY = "AIzaSyDASkWtsVYdG_Z419Vbw5IZH2Da5h8QiWA";

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
