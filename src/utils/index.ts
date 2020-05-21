export function isFunction(value: any): boolean {
  return typeof value === 'function'
}

export function generateKey(name: string, ...args: any[]): string {
  return `[name]=${name}_${JSON.stringify(args)}`
}

export function isPromise(obj: any): boolean {
  return obj && typeof obj.then === 'function'
}

export const log = {
  error (...args: any[]) {
    console.error('[use-api]: ', ...args)
  },
  warn (args: any[]) {
    console.warn('[use-api]: ', ...args)
  }
}

export function validateNamespace (namespace: any, prototype: any) {
  if (typeof namespace !== 'string' || namespace === '') {
    log.error(`${prototype.constructor.name} need set unique namespace in prototype.`)
  }
}