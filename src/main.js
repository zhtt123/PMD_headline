// 需要在其他之前引入console文件，覆盖所有的打印语句
import '@/utils/console'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import 'highlight.js/styles/default.css' // 代码高亮的样式
// 引入vant组件
import './VueComponent'

// 引入自定义封装的组件(自动聚焦)
import getFocus from '@/utils/getFocus'
Vue.use(getFocus)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
