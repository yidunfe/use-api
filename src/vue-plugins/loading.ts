import Loading from '../packages/loading'

/**
 * 创建 vuex loadings 模块
 */
function createLoadingsModule(Vue: any) {
  return {
    namespaced: true,
    state: {},
    mutations: {
      SET_LOADING(state: any, payload: any) {
        const { parent, key, value } = payload
        state[parent][key] = value
      },
      // 针对state中未定义的loading进行初始化
      INIT_LOADING(state: any, payload: any) {
        const { parent, key, value = false } = payload
        if (state[parent] === void 0) {
          Vue.set(state, parent, {})
        }
        if (state[parent][key] === void 0) {
          Vue.set(state[parent], key, value)
        }
      }
    }
  }
}

export default class LoadingManager {
  static install(Vue: any, options: any) {
    const { store } = options
    // 注册模块 `loadings`
    store.registerModule('loadings', createLoadingsModule(Vue))
    // 在 store 注册 loadings 模块之前，loading 装饰器已经被执行，store 对应的 state 需要被初始化
    Loading.getDecoratoredMethods().forEach(item => {
      store.commit('loadings/INIT_LOADING', { parent: item.namespace, key: item.key, value: false })
    })
    Loading.use(async (ctx: any, next: Function) => {
      const { namespace, key } = ctx
      store.commit('loadings/SET_LOADING', { parent: namespace, key, value: true })
      await next()
      store.commit('loadings/SET_LOADING', { parent: namespace, key, value: false })
    })

    Vue.prototype.$loadings = store.state.loadings
  }
}
