import { generateKey } from './index'

export interface ItemCache {
  data: any
  timeout: number
  cacheTime: number
}

export default class CacheStore {
  private _data: Map<any, ItemCache>

  constructor() {
    this._data = new Map()
  }

  static generateKey(name: string, ...args: any[]) {
    return generateKey(name, args)
  }

  set(key: any, value: ItemCache): void {
    this._data.set(key, value)
  }

  get(key: any): any {
    return this._isOverTime(key) ? null : (this._data.get(key) as any).data
  }

  has(key: any): boolean {
    return !this._isOverTime(key)
  }

  _isOverTime(key: any): boolean {
    const data = this._data.get(key)
    // 没有数据 一定超时
    if (data === void 0) return true
    const currentTime = new Date().getTime()
    const overTime = currentTime - data.cacheTime
    if (Math.abs(overTime) > data.timeout) {
      this.delete(key)
      return true
    }
    return false
  }

  delete(key: any): boolean {
    return this._data.delete(key)
  }

  clear() {
    this._data.clear()
  }
}
