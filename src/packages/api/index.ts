import { isFunction, validateNamespace } from '../../utils'
import extend from '../../utils/extend'
import { MethodDecoratorFactory, ApiOptions } from '../../index'

const Api: MethodDecoratorFactory = extend(function(
  url: string,
  options: ApiOptions = {}
): MethodDecorator {
  const _fetch = Api._options && Api._options.fetch
  if (!isFunction(_fetch)) {
    throw new Error(
      '[use-api] error: before use Api decorator, you must call setOptions firstly to set custom fetch'
    )
  }
  const { schema, ...rest } = options
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): TypedPropertyDescriptor<any> {
    const namespace = target.namespace
    validateNamespace(namespace, target)
    target.$url = url
    const original = descriptor.value

    Api.emit('beforeDecorator', {
      namespace,
      propertyKey,
      args: [url, options]
    })

    descriptor.value = async function(...args: any[]): Promise<any> {
      let ctx = {
        propertyKey,
        url,
        options,
        result: null
      }
      try {
        await Api._runMiddlewares(ctx, [
          async () => {
            const result = await _fetch(url, {
              body: args && args.length > 0 ? args[0] : void 0,
              ...rest
            })
            const newArgs = [...args, result]
            const resolveResult = original.apply(this, newArgs)
            ctx.result = resolveResult === void 0 ? result : resolveResult
          }
        ])
      } catch (error) {
        return Promise.reject(error)
      }
      return ctx.result
    }

    Api._pushDecoratoredMethod({
      namespace,
      propertyKey,
      method: descriptor.value
    })

    return descriptor
  }
})

export default Api
