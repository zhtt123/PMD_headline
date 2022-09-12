import Vue from 'vue'

// 封装中间件函数插件
export default {
  install () {
    Vue.directive('getFocus', {
      // inserted对隐藏了再显示的DOM元素不管用
      inserted (el) {
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          el.focus()
        } else {
          if (el.querySelector('input')) {
            el.querySelector('input').focus()
          }
          if (el.querySelector('textarea')) {
            el.querySelector('textarea').focus()
          }
        }
      },
      update (el) {
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          el.focus()
        } else {
          if (el.querySelector('input')) {
            el.querySelector('input').focus()
          }
          if (el.querySelector('textarea')) {
            el.querySelector('textarea').focus()
          }
        }
      }
    })
  }
}
