import Api from '../../../src/packages/api/index'
import createFetch, { createErrorFetch } from '../../fetchMock'

const fetchResultListMock = [
  { id: 1, name: 'name1' },
  { id: 2, name: 'name2' }
]

const fetchResultListMock2 = [
  { id: 11, name: 'name11' },
  { id: 21, name: 'name21' }
]

const fetchMock = createFetch(fetchResultListMock)

describe('use-api test', () => {
  test('测试 Api 必须设置 fetch', () => {
    expect.assertions(1)
    try {
      class MyService {
        @Api('/api/query')
        query() {}
      }
    } catch (error) {
      expect(error.message).toMatch('error')
    }
  })

  test('测试 Api 装饰器可用', async () => {
    Api.setOptions({ fetch: fetchMock })
    class MyService {
      @Api('/api/query')
      query() {}
    }
    const myService = new MyService()
    const result = await myService.query()
    expect(result).toBe(fetchResultListMock)
  })

  test('测试对 Api 返回值进行修改', async () => {
    Api.setOptions({ fetch: fetchMock })
    class MyService {
      @Api('/api/query')
      query(params: any, result?: any) {
        return result.filter((i: any) => i.id > 1)
      }
    }
    const myService = new MyService()
    const result = await myService.query({ test: 1 })
    expect(result).toEqual([{ id: 2, name: 'name2' }])
  })

  test('测试对 Api 工厂函数带第二个参数', async () => {
    Api.setOptions({ fetch: fetchMock })
    class MyService {
      @Api('/api/query', { schema: {} })
      query() {}
    }
  })

  test('测试对 Api 装饰的方法接口响应返回失败', async () => {
    const fetchResult = { id: 1 }
    const fetchResult2 = { id: 2 }
    Api.setOptions({ fetch: createErrorFetch('error') })
    class MyService {
      @Api('/api/query')
      query() {}
    }
    const myService = new MyService()
    try {
      const p1 = await myService.query()
    } catch (error) {
      expect(error).toBe('error')
    }
  })
})
