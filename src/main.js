import Vue from 'vue'
import 'lib-flexible'
import {Button} from 'mint-ui' 
import App from './App.vue'
import Vuelazyload from 'vue-lazyload'
import router from './router'
import * as API from '@/api'
import Header from './component/Header/Header.vue'
import Star from './component/Star/Star.vue'
import CartControl from './component/CartControl/CartControl.vue'
import store from './vuex/store'
import './mock/mock-server'
import './validate'
import loading from './common/images/loading.gif'

Vue.config.productionTip = false
//注册全局组件
Vue.component('Header',Header)
Vue.component('Star',Star)
Vue.component(Button.name,Button)
Vue.component('CartControl',CartControl)
Vue.use(Vuelazyload,{
  loading,
})
Vue.prototype.$API=API
new Vue({
  render: h => h(App),
  router,//$router $route <router-link></router-link>
  store,
}).$mount('#app')
