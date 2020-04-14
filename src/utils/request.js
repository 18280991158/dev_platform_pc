import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import router from '../router'
import store from '@/store'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code === 200) {
      return res
    }

    if (res.code === 401) {
      if (store.getters.roles.length === 0) {
        store.dispatch('user/logout').then(() => {
          router.push({ path: '/login' })
        })
      } else {
        MessageBox.confirm('您已注销，可以取消停留在此页面上，或者再次登录', '确定注销', {
          confirmButtonText: '再次登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout').then(() => {
            router.push({ path: '/login' })
          })
        })
      }

      return
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }
  }
)

export default service

