import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'
import VueSession from 'vue-session'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

//axios.defaults.baseURL = 'https://desarrollowebproyecto2.herokuapp.com/api/'
axios.defaults.baseURL = 'http://localhost:8000/api/'

Vue.config.productionTip = false
Vue.use(VueSweetalert2);

var options = {
  persist: true
}

Vue.use(VueSession, options)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')


