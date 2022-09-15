import axios from 'axios'
// import { Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
// import { loginApi } from '@/api/api'
// import CryptoJS from 'crypto-js' 
// 缓存请求的数组
let cacheRequestArr = []
let count = 0
let Token = null
// 将请求都push到数组中,数组是[function(token){}, function(token){},...]
function cacheRequestArrHandle(cb) {
  cacheRequestArr.push(cb)
}

// 数组中的请求得到新的token之后执行，用新的token去重新发起请求
function afreshRequest(token) {
  cacheRequestArr.map((cb) => cb(token))
  cacheRequestArr = []
}

// 获取sign签名
function getSign(signBefore) {
  // const arr = ['appSecret', 'timestamp', 'nonceStr', 'token', 'body']
  // let str = ''
  // arr.forEach((item) => {
  //   const value = signBefore[item]
  //   if (!value) {
  //     return
  //   } else {
  //     str += `&${item}=${signBefore[item]}`
  //   }
  // })
  return 'dsfasdfasdfasdfsdf'
}

let cacheList = []
let status = false
// 防止重复请求获取临时秘钥的接口

const getToken = async () => {
  if (status) {
    return new Promise((resolve) => {
      cacheList.push((data) => {
        resolve(data)
      })
    })
  } else {
    status = true
    const { data } = await axios.get('http://rest.apizza.net/mock/8b3df8e547994a420afc353aafe94efd/login')
    cacheList.forEach((item) => {
      item(data)
    })
    cacheList = []
    status = false
    Token = '12312312321'
    return data
  }
}

// 是否为开发环境
const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' // 是否是开发环境

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})
service.interceptors.request.use(
  async (config) => {
    count += 1
    console.log('count', count)
    let appId, appSecret, nonceStr
    if (isDev) {
      appId = 'FvI0ogwb'
      appSecret = '66d9570cb545b46abc05945ce7df2a13609de5e7'
      nonceStr = 'HomeAdmin'
    } else {
      appId = 'FvI0ogwb'
      appSecret = '66d9570cb545b46abc05945ce7df2a13609de5e7'
      nonceStr = 'HomeAdmin'
    }

    const timestamp = Date.now()
    config.headers['app_id'] = appId
    config.headers['timestamp'] = timestamp
    config.headers['nonce_str'] = nonceStr
    const signBefore = {
      appSecret,
      timestamp,
      nonceStr
    }

    const body = JSON.stringify(config.data)
    // console.log('body', body)
    // if (body != undefined && body.length > 0) {
    //   // base64
    //   var words = CryptoJS.enc.Utf8.parse(body)
    //   var base64 = CryptoJS.enc.Base64.stringify(words)
    //   signBefore.body = base64
    // }

    if (!Token) {
      let token = await getToken()

      config.headers['token'] = token
      // signBefore.token = getToken()[0]
      // const now = new Date().getTime()
      // const tokenExpTime = getToken()[3]
      // if ((!tokenExpTime || tokenExpTime < now) && config.url !== loginApi.sessionRefresh) {
      //   // console.log(config.url + '时token过期')
      //   //将请求缓存起来
      //   // console.log('缓存' + config.url + '的请求')
      //   let retry = new Promise((resolve) => {
      //     cacheRequestArrHandle((token) => {
      //       signBefore.token = token
      //       const sign = getSign(signBefore)
      //       config.headers['sign'] = sign
      //       config.headers['token'] = token // token为刷新完成后传入的token
      //       // console.log('开始执行缓存的请求' + config.url + '--token是' + token)
      //       resolve(config)
      //     })
      //   })

      //   if (!store.getters.isRefreshing) {
      //     //开始刷新token
      //     // console.log('开始刷新')
      //     store
      //       .dispatch('user/sessionRefresh')
      //       .then(() => {
      //         // console.log('刷新成功')
      //         // 刷新token完成后重新请求之前的请求
      //         afreshRequest(getToken()[0])
      //       })
      //       .catch(() => {
      //         //刷新token失败，跳转登陆页
      //         cacheRequestArr = []
      //         store.dispatch('user/resetToken').then(() => {
      //           location.reload()
      //         })
      //       })
      //   }
      //   return retry
      // }
      // return new Promise((rol, rej) => {
      //   setTimeout(() => {
      //     rol(config)
      //   }, 4000)
      // })
      return config
    }
    const sign = getSign(signBefore)
    config.headers['sign'] = sign

    return config
  },
  (error) => {
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
  (response) => {
    const res = response.data
    const { config } = response
    //不校验code是否为1，直接把交给页面去处理
    if (config.unCheckCode) {
      return res
    }
    // if the custom code is not 1, it is judged as an error.
    if (res.code !== 1) {
      // token无效
      if (res.code === 1003 || res.code === 1004 || res.code === 1005) {
        store.dispatch('user/resetToken').then(() => {
          setTimeout(() => {
            location.reload()
          }, 1000)
          Message({
            message: '登录状态失效，请重新登录',
            type: 'error',
            duration: 2.5 * 1000
          })
        })

        return
      }
      const msg = res.code === -1 ? '服务器繁忙,请稍后再试' : res.msg || 'Error'
      // Message({
      //   message: msg,
      //   type: 'error',
      //   duration: 2.5 * 1000
      // })
      console.log('msg' + msg) // for debug 
      return Promise.reject()
    } else {
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message || 'Error',
    //   type: 'error',
    //   duration: 2.5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default function request(url, data = {}, { method = 'post', unCheckCode = false } = {}) {
  return service({
    url,
    data,
    method,
    unCheckCode
  })
}
