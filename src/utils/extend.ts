const compose = require('koa-compose')
import EventEmitter from '../utils/event'
import { MethodDecoratorFactory, DecoratoredMethodDesc } from '../index'

export default function(module: any): MethodDecoratorFactory {
  let middlewares: Function[] = []
  const events = new EventEmitter()
  let decoratoredMethods: DecoratoredMethodDesc[] = []

  module._options = {}
  module._middlewares = middlewares
  module._events = events
  module._decoratoredMethods = decoratoredMethods

  module.setOptions = function(options: any) {
    module._options = options
  }

  module.on = function(eventName: string, listener: Function) {
    events.on(eventName, listener)
  }
  module.off = function(eventName: string, listener: Function) {
    events.off(eventName, listener)
  }
  module.emit = function(eventName: string, ...args: any[]) {
    events.emit(eventName, args)
  }
  module.once = function(eventName: string, listener: Function) {
    events.once(eventName, listener)
  }

  module.use = function(middleware: Function) {
    module._middlewares.push(middleware)
  }

  module.getDecoratoredMethods = function() {
    return decoratoredMethods
  }
  module._pushDecoratoredMethod = function(methodDesc: DecoratoredMethodDesc) {
    module._decoratoredMethods.push(methodDesc)
  }

  module._runMiddlewares = async function(ctx: any, extraMiddlewares: Function[] = []) {
    const exec = compose(this._middlewares.concat(extraMiddlewares))
    // tslint:disable-next-line: no-empty
    await exec(ctx, async function() {})
    return ctx
  }

  return module
}
