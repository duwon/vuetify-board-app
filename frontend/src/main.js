import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'
import './plugins'

// Google OAUTH
import GAuth from 'vue-google-oauth2'
import configenv from '../config'
const gauthOption = {
  clientId: configenv.google_client_id,
  scope: 'profile email https://www.googleapis.com/auth/plus.login',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

// Cookie
import VueCookies from "vue-cookies"
Vue.use(VueCookies);
Vue.$cookies.config("1h") // expire 1시간

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
