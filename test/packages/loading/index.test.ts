import Loading from '../../../src/packages/loading/index'
import createFetch, { createErrorFetch } from '../../fetchMock'

describe('use-api loading test', () => {
  test('测试对 Loading 装饰的方法连续执行多次，返回同一个 result', async () => {
    class MyService {
      @Loading()
      query() {
        return createFetch(1, 2)()
      }
    }
    const myService = new MyService()
    const p1 = myService.query()
    const p2 = myService.query()
    const [r1, r2] = await Promise.all([p1, p2])
    expect(r1).toEqual(r2)
  })

  test('测试 Loading 传入可选参数 key', async () => {
    class MyService {
      @Loading('aliasKey')
      query() {
        return createFetch(1, 2)()
      }
    }
    const myService = new MyService()
    const p1 = myService.query()
    const p2 = myService.query()
    const [r1, r2] = await Promise.all([p1, p2])
    expect(r1).toEqual(r2)
  })

  test('测试对 Loading 装饰的方法报错', async () => {
    class MyService {
      @Loading()
      query() {
        return createErrorFetch('error')()
      }
    }
    const myService = new MyService()
    try {
      await myService.query()
    } catch (error) {
      expect(error).toBe('error')
    }
  })
})
