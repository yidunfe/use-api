# use-api

### 特性
* 轻量级，与视图层框架无关
* 提供装饰器 api，可插拔，良好的代码阅读性
* 支持数据的 cache
* 支持接口的 loading。提供 vue 插件，视图模板仅需对 loading 进行绑定，不再关心其值何时赋值
* 提供关键流程钩子
* 支持类 koa 风格的中间件
* ...

### 快速上手

```
npm install @yidun/use-api -S

import Api, { Cache, Loading, VueLoadingPlugin } from '@yidun/use-api'

// 需要自定义 fetch 方法，规范的 fetch 接口定义参见更多的 api
Api.setOptions({ fetch })

class MyService {
  @Cache()
  @Loading()
  @Api('/api/query')
  query () {}
}

Loading 提供了 vue 插件，可以在模板中使用 loading 的状态

Vue.use(VueLoadingPlugin, { store })

class MyService {
  @Loading()
  @Api('/api/query')
  query () {}
}

Vue 模板使用，默认以类名称和方法key作为 loading 的唯一标识
<template>
  <button :loading="$loadings.MyService.query">click</button>
</template>

```

### api 详解

#### @Service(namespance?: string)

类装饰器，目前仅用于定义 namespance，默认为 class 名称

```
@Service('MyCustomService')
class MyService {
  query (params) {}
}

// namespance 默认为 MyService
class MyService {
  query (params) {}
}
```


#### @Api(url: string, options: object)

Api 目前的功能更像是对自定义 fetch 的简写，参数目前都会透传给自定义的 fetch。fetch 的接口定义，需要自行实现。FetchOptions 规定 body 字段为传给后端的 data

```
export interface FetchOptions {
  body?: any
}
export interface Fetch {
  (url: string, options: FetchOptions): Promise<any>
}

// 场景1：接口传值
// params: 所有传给后端接口的参数请包装成一个对象，装饰器会取传实际调用的方法的第一个参数当成 body 字段传递给 fetch
class MyService {
  @Api('/api/query')
  query (params) {}
}

// 场景2：options 会透传给 fetch
// 如 quiet: true，具体逻辑由 fetch 自行实现
class MyService {
  @Api('/api/query', { quiet: true })
  query (params) {}
}

// 场景3：对接口返回值做修改
// 允许对接口返回值做修改，会以最后一个参数回调的形式提供；被装饰的方法需要 return 处理后的值，return undefined 会被忽略
class MyService {
  @Api('/api/query', { quiet: true })
  query (params, flag, result) {
    if (flag) {
      return result.filter(item => !!item)
    }
  }
}
```

#### @Loading(key?: string)

为接口提供 loading 功能，解决快速点击触发多次接口调用的问题。并且提供了 vue 插件来实现视图中 loading 状态的同步，借助 vuex store 来实现

```
import VueLoadingPlugin from '@yidun/use-api'

Vue.use(VueLoadingPlugin, { store })

class MyService {
  @Loading()
  @Api('/api/query')
  query (params) {}
}
// 会往 vue 原型上扩充 $loadings 属性；
// 如果未定义 key，则直接以 $loadings[namespance].[propertyKey] 来访问
<template>
  <a-button :loading="$loadings.MyService.query">loading 按钮</a-button>
</template>

```
#### @Cache(uniqueKey?: string)

默认以 namespance 和 propertyKey 以及请求参数 组成唯一标识缓存，所以是支持请求级别的缓存的。默认缓存5分钟

```
class MyService {
  @Cache()
  @Api('/api/query')
  query (params) {}
}
```

接收可选参数 uniqueKey，一旦设定 uniqueKey 后，全局唯一；主要是配合 CacheClear 使用

#### @CacheClear(uniqueKey: string)

接收参数 uniqueKey，用于清除由 Cache(uniqueKey) 缓存的数据

```
class MyService {
  @Cache('uniqueKey')
  @Api('/api/query')
  query (params) {}

  @CacheClear('uniqueKey')
  @Api('/api/query')
  create () {}
}

```

### 更高级的用法

#### 事件机制

所有函数装饰器工厂方法，即 Api、Loading 等均支持事件绑定，会在一些关键流程触发相应的事件回调

* beforeDecorator

```
例如：

Api.on('beforeDecorator', ({ namespance: string, propertyKey: string | symbol, args: any[] }) => {})

Api.once('beforeDecorator', listener)

Api.off('beforeDecorator', listener)

```

#### 中间件机制

所有函数装饰器工厂方法，即 Api、Loading 等均支持类 koa 形式的中间件

```
Api.use(async (ctx, next) {
  const startTime = Date.now()
  await next()
  const usedTime = Date.now() - startTime
  console.log(usedTime)
})
```