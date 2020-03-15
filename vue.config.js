const path = require('path')
const px2rem = require('postcss-px2rem')
// 配置postcs-px2rem
const postcss = px2rem({
  remUnit: 37.5   // 设计稿10等分之后的值
})

module.exports={
  css: { // 添加postcss配置
    loaderOptions: {
      postcss: {
        plugins: [
          postcss
        ]
      }
    }
  },
    configureWebpack: {
        resolve: {
          extensions:['.js','.vue','.json'],
          alias: { // 别名
            // 'vue$': 'vue/dist/vue.esm.js', // 使用vue库带编译器的es版本
           '@':path.resolve(__dirname,'src'),
            'components': path.resolve(__dirname,'src/components'),
          }
        }
      },
      devServer: {
        proxy: {
          // 处理以/api开头路径的请求
          // '/api': 'http://localhost:4000'
          '/api': {
            target: 'http://localhost:4000', // 转发的目标地址
            pathRewrite: {
              '^/api' : ''  // 转发请求时去除路径前面的/api
            },
            changeOrigin: true, // 支持跨域
          }
        }
      }
      
}