import extend from '../../utils/extend'
import { MethodDecoratorFactory } from '../../index'
import { generateKey } from '../../utils'

const Loading: MethodDecoratorFactory = extend(function(key?: string) {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): TypedPropertyDescriptor<any> {
    const namespace = target.$namespace || target.constructor.name
    const original = descriptor.value
    let peddingPromises: Map<string, Promise<any>> = new Map()
    key = key || propertyKey.toString()

    Loading.emit('beforeDecorator', {
      namespace,
      propertyKey,
      args: [key]
    })

    descriptor.value = async function(...args: any[]) {
      let ctx: any = {
        namespace,
        key,
        result: null
      }
      try {
        await Loading._runMiddlewares(ctx, [
          async () => {
            const uniquKey = generateKey(target.$url || propertyKey, args)
            let fetchPromise = peddingPromises.has(uniquKey)
              ? (peddingPromises.get(uniquKey) as Promise<any>)
              : original.apply(this, args)
            peddingPromises.set(uniquKey, fetchPromise)
            const result = await fetchPromise
            peddingPromises.delete(uniquKey)
            ctx.result = result
          }
        ])
        return ctx.result
      } catch (error) {
        return Promise.reject(error)
      }
    }

    Loading._pushDecoratoredMethod({
      namespace,
      propertyKey,
      key,
      method: descriptor.value
    })

    return descriptor
  }
})

export default Loading
