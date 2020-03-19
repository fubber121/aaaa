import Vue from 'vue'
import 'lib-flexible'
import {Button} from 'mint-ui' 
import App from './App.vue'

import router from './router'
import * as API from '@/api'
import Header from './component/Header/Header.vue'
import Star from './component/Star/Star.vue'
import store from './vuex/store'
import './validate'

Vue.config.productionTip = false
//注册全局组件
Vue.component('Header',Header)
Vue.component('Star',Star)
Vue.component(Button.name,Button)
Vue.prototype.$API=API
new Vue({
  render: h => h(App),
  router,//$router $route <router-link></router-link>
  store,
}).$mount('#app')
