import CacheStore, { ItemCache } from '../../utils/cache'
import { isPromise } from '../../utils'
import extend from '../../utils/extend'
import { MethodDecoratorFactory } from '../../index'

let cacheStore = new CacheStore()

function setToCacheStore(cacheKey: any, data: any) {
  const itemCache: ItemCache = {
    data,
    timeout: 5 * 60 * 1000,
    cacheTime: Date.now()
  }
  cacheStore.set(cacheKey, itemCache)
}

const Cache: MethodDecoratorFactory = extend(function(uniqueKey?: string): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): TypedPropertyDescriptor<any> {
    const namespace = target.$namespace || target.constructor.name
    const original = descriptor.value

    Cache.emit('beforeDecorator', {
      namespace,
      propertyKey,
      args: [uniqueKey]
    })

    descriptor.value = async function(...args: any[]): Promise<any> {
      let ctx = {
        uniqueKey,
        propertyKey,
        result: null
      }
      try {
        await Cache._runMiddlewares(ctx, [
          async () => {
            let result: any
            let cacheStoreKey = uniqueKey
              ? uniqueKey
              : CacheStore.generateKey(`${namespace}_${propertyKey.toString()}`, args)
            let cachedData = cacheStore.get(cacheStoreKey)
            if (cachedData !== null && !isPromise(cachedData)) {
              result = cachedData
            } else {
              let promise: Promise<any> = isPromise(cachedData)
                ? cachedData
                : original.apply(this, args)
              setToCacheStore(cacheStoreKey, promise)
              result = await promise
              setToCacheStore(cacheStoreKey, result)
            }
            ctx.result = result
          }
        ])
      } catch (error) {
        return Promise.reject(error)
      }
      return ctx.result
    }

    Cache._pushDecoratoredMethod({
      namespace,
      propertyKey,
      method: descriptor.value
    })

    return descriptor
  }
})

const CacheClear: MethodDecoratorFactory = extend(function(uniqueKey: string) {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): TypedPropertyDescriptor<any> {
    const namespace = target.$namespace || target.constructor.name
    const original = descriptor.value

    CacheClear.emit('beforeDecorator', {
      namespace,
      uniqueKey,
      propertyKey
    })

    descriptor.value = async function(...args: any[]) {
      let ctx = {
        namespace,
        uniqueKey,
        result: null
      }
      try {
        await CacheClear._runMiddlewares(ctx, [
          async () => {
            const result = await original.apply(this, args)
            ctx.result = result
          }
        ])
        cacheStore.delete(uniqueKey)
      } catch (error) {
        return Promise.reject(error)
      }
      return ctx.result
    }

    CacheClear._pushDecoratoredMethod({
      namespace,
      propertyKey,
      method: descriptor.value
    })

    return descriptor
  }
})

export default Cache

export { CacheClear }
