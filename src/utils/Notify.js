// 封装一个提示框组件
// import { Notify } from 'vant'
// export default Notify

import { Toast } from 'vant'
export default ({ type, message }) => {
  if (type === 'danger' || type === 'warning') {
    type = 'fail'
  }
  Toast({
    type,
    message
  })
}
