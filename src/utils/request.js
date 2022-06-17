import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import { Modal, notification } from 'ant-design-vue'
import { ACCESS_TOKEN, REFRESH_TOKEN, ACCESS_TIME, REFRESH_TIME, LOGIN_TIME } from '@/store/mutation-types'

/**
 * 【指定 axios的 baseURL】
 * 如果手工指定 baseURL: '/jeecg-boot'
 * 则映射后端域名，通过 vue.config.js
 * @type {*|string}
 */
let apiBaseUrl = window._CONFIG['domianURL'] || '/jeecg-boot'
console.log('apiBaseUrl= ', apiBaseUrl)
// 创建 axios 实例
const service = axios.create({
  //baseURL: '/jeecg-boot',
  baseURL: apiBaseUrl, // api base_url
  timeout: 9000 // 请求超时时间
})

const err = error => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.log('------异常响应------', token)
    console.log('------异常响应------', error.response.status)
    switch (error.response.status) {
      case 403:
        notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 })
        break
      case 500:
        //notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
        if (token && data.message == 'Token失效，请重新登录') {
          // update-begin- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
          // store.dispatch('Logout').then(() => {
          //     window.location.reload()
          // })
          loginOut('登录已过期','很抱歉，登录已过期，请重新登录','重新登录')
          // update-end- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
        }
        break
      case 404:
        notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
        break
      case 504:
        notification.error({ message: '系统提示', description: '网络超时' })
        break
      case 401:
        notification.error({ message: '系统提示', description: '未授权，请重新登录', duration: 4 })
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
}

// 是否有请求在刷新token
window.isRefreshing = false
// 被挂起的请求数组
let subscribesArr = []

// push所有请求到数组中
function subscribeTokenRefresh(cb) {
  subscribesArr.push(cb)
}

// 用新token发起请求
function reloadSubscribesArr(token) {
  subscribesArr.map(cb => cb(token))
}

/**
 * 判断快过期了 和 已经过期了
 * 0 返回登陆  1 刷新 token 2有效期内
 */
function isTokenExpired() {
  let expiredTime = Vue.ls.get(ACCESS_TIME)
  let refExpTime = Vue.ls.get(REFRESH_TIME)
  let loginTime = Vue.ls.get(LOGIN_TIME)
  if (loginTime) {
    let nowTime = new Date().getTime()
    if ((nowTime - loginTime) / 1000  > (expiredTime - 10) &&  (nowTime - loginTime) / 1000  < refExpTime) {
      return 1
    } else if ((nowTime - loginTime) / 1000  <= expiredTime) {
      return 2
    }
  }
  return 0
}

function loginOut (title, content, okText) {
  Modal.error({
    title: title,
    content: content,
    okText: okText,
    mask: false,
    onOk: () => {
      store.dispatch('Logout').then(() => {
        window.location.reload()
      })
    }
  })
}

// request interceptor
service.interceptors.request.use(
  config => {
    // 如果是不需要token的接口直接返回即可
    if (config.url.indexOf('/login') !== -1) {
      return config
    }
    if (config.method == 'get') {
      if (config.url.indexOf('sys/dict/getDictItems') < 0) {
        config.params = {
          // _t: Date.parse(new Date())/1000,
          ...config.params
        }
      }
    }
    const token = Vue.ls.get(ACCESS_TOKEN)
    const refToken = Vue.ls.get(REFRESH_TOKEN)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      let expired = isTokenExpired()
      if (expired == 1) {
        if (!window.isRefreshing) {
          window.isRefreshing = true
          axios({
            url: '/auth/refresh',
            method: 'post',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${refToken}`
            }
          }).then((res) => {
              window.isRefreshing = false
              if (res.data.code === 200) {
                const tokenVo = res.data.data
                Vue.ls.set(ACCESS_TOKEN, tokenVo.accessToken, 24 * 60 * 60 * 1000)
                Vue.ls.set(REFRESH_TOKEN, tokenVo.refreshToken, 24 * 60 * 60 * 1000)
                Vue.ls.set(LOGIN_TIME, new Date().getTime(), 24 * 60 * 60 * 1000)
                reloadSubscribesArr(tokenVo.accessToken)
              } else {
                subscribesArr = []
                loginOut('登录过期','登录帐号已过期，请重新登录','重新登录')
              }
            })
            .catch((err) => {
              window.isRefreshing = false
              subscribesArr = []
              window.localStorage.clear()
              loginOut('网络异常','网络异常，请重新登录','确定')
            })
        }
        let retry = new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            config.headers['Authorization'] = `Bearer ${newToken}`
            resolve(config)
          })
        })
        return retry
      } else if(expired == 2) {
        return config
      }
    }
    loginOut('未登录','当前帐号未登录，请重新登录','重新登录')
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data) {
    let code = response.data.errcode ? response.data.errcode : response.data.code
    switch (code) {
      case 403:
        loginOut('登录过期','登录帐号已过期，请重新登录','重新登录')
        break
      case 500:
        notification.error({ message: '系统提示', description: response.data.message, duration: 4 })
        break
      case 40005:
        loginOut('登录过期','登录帐号已过期，请重新登录','重新登录')
        break
      case 40007:
        loginOut('未登录','当前帐号未登录，请重新登录','重新登录')
        break
      case 40008:
        loginOut('重新登录','帐号已在其它地方登陆','确定')
        break
      case 404:
        notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
        break
      case 504:
        notification.error({ message: '系统提示', description: '网络超时' })
        break
      case 401:
        notification.error({ message: '系统提示', description: response.data.message, duration: 4 })
        // if (token) {
        //   store.dispatch('Logout').then(() => {
        //     setTimeout(() => {
        //       window.location.reload()
        //     }, 1500)
        //   })
        // }
        break
    }
  }
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export { installer as VueAxios, service as axios }
