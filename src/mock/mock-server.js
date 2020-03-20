//使用mockjs提供mock接口数据
import  Mock from 'mockjs'
import data from './data.json' //得到的js对象自动解析好了

//定义mock接口
Mock.mock('/api/goods',{code:0,data:data.goods})
Mock.mock('/api/info',{code:0,data:data.info})
Mock.mock('/api/ratings',{code:0,data:data.ratings})


//export default