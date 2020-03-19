//封装axios

import axios from 'axios'
import qs from 'qs'
import { Indicator ,Toast,MessageBox} from 'mint-ui'
import store from '../vuex/store'
import router from '../router'

const instance = axios.create({
  baseURL:'/api',
//超时时间
  timeout:20000
})
//请求拦截器
instance.interceptors.request.use((config)=>{
    //显示请求loading
    Indicator.open()
    const data = config.data
    if(data instanceof Object){
       config.data= qs.stringify(data)
    }
    //通过请求头携带token数据
    const token = store.state.token
    //如果当前接口需要token校验，但没有token,不发请求，进入错误流程
    const needCheck = config.headers.needCheck
   
    if(token){
      config.headers['Authorization'] =token

    }else{
      if(needCheck){
        throw new Error('没有登录，不能请求')

      }
    }
    return config
})

//响应拦截器
instance.interceptors.response.use(
    response=>{
        //隐藏请求loading
        Indicator.close()
      

        //return response
        return response.data
    },
    error=>{
        //隐藏请求loading
        Indicator.close()
        const response = error.response
        //没发请求的错误
        if(!response){
          const path = router.currentRoute.path
          if(path!=='/login'){
            router.replace('/login')
            Toast(error.message)
          }
          
        }else{
           //发了请求的错误
        //如果响应状态码是401，且当前没在登录页面，退出登录（清楚数据/自动跳转到login）
        if(error.response.status ===401){
         const path = router.currentRoute.path
         if(path !== '/login'){
           store.dispatch('logout')
          router.replace('/login')
          Toast(error.response.data.message ||'登录失效，请重新登录')
         }
         
        }else if(error.response.status === 404){//404
           MessageBox('提示','访问的资源不存在')
        }
        
        else{
  // return Promise.rejiect(error)
        // 统一处理请求异常
        MessageBox('提示','请求出错：'+error.message)
        }
      
        }

       
        return new Promise(()=>{ })
    }
)

export default instance