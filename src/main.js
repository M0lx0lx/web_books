import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
const axios = require('axios').default;

Vue.config.productionTip = false
Vue.prototype.axios= axios;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
