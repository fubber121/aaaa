//包含n个用于间接更新状态数据的方法的对象
//方法可以包含异步个逻辑处理代码
import {
    reqAddress,
    reqCategorys,
    reqShops,
    reqAutoLogin
}from '../api'
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_TOKEN,
    RECEIVE_USER,
    RESET_TOKEN,
    RESET_USER
} from './mutation-types'

export default{
    //获取当前信息对象的异步action
     async getAddress ({commit,state}){
        const {longitude,latitude} = state
        //发布异步请求
        const result = await reqAddress(longitude,latitude)
      //请求成功后，提交给mutation

        if(result.code === 0 ){
            const address = result.data

            commit(RECEIVE_ADDRESS,address)
        }
    },
    async getCategorys ({commit}){
      
        //发布异步请求
        const result = await reqCategorys()
      //请求成功后，提交给mutation

        if(result.code === 0 ){
            const categorys = result.data

            commit(RECEIVE_CATEGORYS,categorys)
        }
    },
    async getShops ({commit,state}){
        const {longitude,latitude} = state
        //发布异步请求
        const result = await reqShops(longitude,latitude)
      //请求成功后，提交给mutation

        if(result.code === 0 ){
            const shops = result.data

            commit( RECEIVE_SHOPS,shops)
        }
    },
    // 保护用户信息
    saveUser ({commit},user){
        const token =user.token
        //将token保存local
        localStorage.setItem('token_key',token)
        
        delete user.token//删除user内的token
        //将token保存到state
        
        commit(RECEIVE_USER,{user})

        //将user保存到state
        commit(RECEIVE_TOKEN,(token))
    },
    //自动登录的异步
    async autoLogin({commit,state}){
        if(state.token && !state.user._id){//必须有token且没有user信息

            //发送自动登录的请求
            const result = await reqAutoLogin()
            if(result.code===0){
                const user =result.data//五token
                commit(RECEIVE_USER,{user})

            }
        }
       

    },
    logout({commit}){
        localStorage.removeItem('token_key')
        commit(RESET_USER)
        commit(RESET_TOKEN)
    }
}