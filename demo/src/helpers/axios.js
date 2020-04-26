import axios from 'axios'
import Qs from 'qs'

const instance = axios.create({
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  paramsSerializer (params) {
    return Qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

export const APPLICATION_FORM = 'application/x-www-form-urlencoded;charset=UTF-8'

export function responseInterceptor (response) {
  const res = response.data
  if (res.code !== 200 && res.code !== 401) {
    // let params = []
    // try {
    //   params = JSON.parse(res.desc)
    // } catch (e) {
    //   console.error('response desc format error')
    // }
    const err = new Error(res.msg)
    err._code = res.code
    err.config = response.config
    err.response = response
    err.request = response.request
    return Promise.reject(err)
  }
  return res.code === 401 ? { needLogin: true, _code: res.code } : res.data
}

instance.interceptors.response.use(responseInterceptor)

export default instance
