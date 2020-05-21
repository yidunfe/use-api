// import Api, { Loading, Cache, CacheClear, VueLoadingPlugin } from '../../../dist/use-api.umd'
import Api, { Loading, Cache, CacheClear, VueLoadingPlugin } from '@imllz/use-api'
import fetch from './fetch'
import Vue from 'vue'
import store from '@/store'

Api.setOptions({
  fetch
})

// Loading.on('beforeDecorator', payload => {
//   console.log('beforeDecorator：', payload)
// })

Vue.use(VueLoadingPlugin, { store })

export {
  Api,
  Loading,
  Cache,
  CacheClear
}