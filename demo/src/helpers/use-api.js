import Api, { Loading, Cache, CacheClear } from '../../../dist/use-api.umd'
import fetch from './fetch'

Api.setOptions({
  fetch
})

Loading.on('beforeDecorator', payload => {
  console.log('beforeDecorator：', payload)
})

export {
  Api,
  Loading,
  Cache,
  CacheClear
}