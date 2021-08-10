import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'

//axios.defaults.baseURL = 'https://desarrollowebproyecto2.herokuapp.com/api/'
axios.defaults.baseURL = 'http://localhost:8000/api/'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
