const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: 'localhost',
    port: 8080
  },
  // 告诉打包后的index.html引入其他资源文件以./开头
  publicPath: './'
})
