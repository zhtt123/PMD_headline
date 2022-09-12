import request from 'axios'
import { getToken, removeToken, setToken } from '@/utils/token'
import Notify from '@/utils/Notify'
import router from '@/router'
import { getNewTokenAPI } from '@/api'
const axios = request.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 5000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // ?. 可选链操作符，如果前面对象没有length，整个表达式返回的是undefined
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, async function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response.status === 401) {
    removeToken()
    // 方法1：跳转到login页面
    // router.replace('/login')
    // Notify({ type: 'warning', message: '用户身份已过期 ' })

    // 方法2：更新token
    const result = await getNewTokenAPI()
    setToken(result.data.data.token)
    // 再发起一遍刚才报错的请求
    return axios(error.config)
  } else if (error.response.status === 500) { // 如果是500状态码证明refresh_token也过期了，只能重新发起请求
    removeToken('refresh_token')
    // 当身份过期跳转到login页面的时候,携带跳转之前的路由信息,登录成功之后就会跳转到之前正在进行的页面
    router.replace('/login?path=' + router.currentRoute.fullPath)
    Notify({ type: 'warning', message: '用户身份已过期 ' })
  }
  return Promise.reject(error)
})

export default ({
  url,
  method = 'GET',
  params = {},
  data = {},
  headers = {}
}) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
