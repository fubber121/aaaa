import Vue from 'vue'
import 'lib-flexible'
import App from './App.vue'

import router from './router'
import Header from './component/Header/Header.vue'

import store from './vuex/store'

Vue.config.productionTip = false
//注册全局组件
Vue.component('Header',Header)

new Vue({
  render: h => h(App),
  router,//$router $route <router-link></router-link>
  store,
}).$mount('#app')
