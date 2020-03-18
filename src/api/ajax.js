//封装axios

import axios from 'axios'
import qs from 'qs'

const instance = axios.create({
  baseURL:'/api',
//超时时间
  timeout:20000
})
//请求拦截器
instance.interceptors.request.use((config)=>{
    const data = config.data
    if(data instanceof Object){
       config.data= qs.stringify(data)
    }
    return config
})

//响应拦截器
instance.interceptors.response .use(
    response=>{
    
        //return response
        return response.data
    },
    error=>{
        
        // return Promise.rejiect(error)
        // 统一处理请求异常
        alert('请求出错：'+error.message)
        return new Promise(()=>{ })
    }
)

export default instance