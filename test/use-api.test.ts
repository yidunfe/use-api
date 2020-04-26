import Api, { Cache, CacheClear, Loading, VueLoadingPlugin } from '../src/use-api'

describe('测试 use-api export 的接口', () => {
  test('测试所有导出的接口', () => {
    expect(typeof Api).toBe('function')
    expect(typeof Cache).toBe('function')
    expect(typeof CacheClear).toBe('function')
    expect(typeof Loading).toBe('function')
    expect(typeof VueLoadingPlugin).toBe('function')
  })
})
