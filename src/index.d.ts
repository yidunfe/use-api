import EventEmitter from './utils/event'

interface DecoratoredMethodDesc {
  key?: string
  propertyKey: string | symbol
  namespace: string
  method: Function
}

export interface MethodDecoratorFactory extends Function {
  _options: any
  _middlewares: Function[]
  _events: EventEmitter
  _decoratoredMethods: DecoratoredMethodDesc
  setOptions: (options: any) => void
  use: Function
  on: (eventName: string, listener: Function) => void
  off: (eventName: string, listener: Function) => void
  once: (eventName: string, listener: Function) => void
  emit: (eventName: string, ...args: any[]) => void
  _runMiddlewares: (ctx: any, extraMiddlewares?: Function[]) => any
  _pushDecoratoredMethod: (decoratoredMethod: DecoratoredMethodDesc) => void
  getDecoratoredMethods: () => DecoratoredMethodDesc[]
}

export interface ApiOptions {
  schema?: any
}

export interface FetchOptions {
  body?: any
}
export interface Fetch {
  (url: string, options: FetchOptions): Promise<any>
}
