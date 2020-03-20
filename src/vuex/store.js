//vuex管理对象 store

import Vue from 'vue'
import Vuex from 'vuex'


import  mutations from './mutations'
import  actions from './actions'
import  getters from './getters'
import msite from './module/msite'
import user from './module/user'
import shop from './module/shop'


Vue.use(Vuex)

export default new Vuex.Store({
    
    mutations,
    actions,
    getters,
    modules:{
        msite,
        user,
        shop

    }
})