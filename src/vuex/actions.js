//包含n个用于间接更新状态数据的方法的对象
//方法可以包含异步个逻辑处理代码
import {
    reqAddress,
    reqCategorys,
    reqShops,
}from '../api'
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
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

}