export function isFunction(value: any): boolean {
  return typeof value === 'function'
}

export function generateKey(name: string, ...args: any[]): string {
  return `[name]=${name}_${JSON.stringify(args)}`
}

export function isPromise(obj: any): boolean {
  return obj && typeof obj.then === 'function'
}
