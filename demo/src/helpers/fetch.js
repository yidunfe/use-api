import { stringify } from 'qs'
import axiosInstance from '@/helpers/axios'

function mockApi (promise) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(promise)
    }, 1000)
  })
}

export default function (url, options = {}) {
  const defaultMethod = 'post'
  const conf = Object.assign({ method: defaultMethod }, options)
  let { method, mock, body, download } = conf
  method = method.toLowerCase()
  const payload = ['post', 'put', 'patch', 'delete'].includes(method) ? 'data' : 'params'
  if (mock) url += (~url.indexOf('?') ? '&' : '?') + '__mock__'

  const config = Object.assign({}, conf, {
    url,
    method,
    [payload]: body
  }, options)

  if (download) {
    window.open(url + '?' + stringify(body))
    return Promise.resolve(true)
  } else {
    return mockApi(axiosInstance.request(config))
  }
}
