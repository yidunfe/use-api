import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import AntD from 'ant-design-vue'
import 'ant-design-vue/dist/antd.min.css'
import { VueLoadingPlugin } from '../../dist/use-api.umd'

Vue.config.productionTip = false
Vue.use(AntD)
Vue.use(VueLoadingPlugin, { store })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
