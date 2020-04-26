import Api from '../../../src/packages/api/index'
import Cache, { CacheClear } from '../../../src/packages/cache/index'
import createFetch, { createErrorFetch } from '../../fetchMock'

const fetchResultListMock = [
  { id: 1, name: 'name1' },
  { id: 2, name: 'name2' }
]

const fetchResultListMock2 = [
  { id: 11, name: 'name11' },
  { id: 21, name: 'name21' }
]

describe('use-api test', () => {
  test('测试 Cache 单独使用', async () => {
    const fetchMock = createFetch(fetchResultListMock, fetchResultListMock2)
    class MyService {
      @Cache()
      query() {
        return fetchMock()
      }
    }
    const myService = new MyService()
    const r1 = await myService.query()
    const r2 = await myService.query()
    expect(r1).toBe(r2)
  })

  test('测试 Cache 设置唯一 key', async () => {
    const fetchMock = createFetch(fetchResultListMock, fetchResultListMock2)
    class MyService {
      @Cache('uniqueKey')
      query() {
        return fetchMock()
      }
      @CacheClear('uniqueKey')
      create() {
        return createFetch(true)()
      }
    }
    const myService = new MyService()
    const r1 = await myService.query()
    const r2 = await myService.query()
    await myService.create()
    const r4 = await myService.query()
    expect(r1).toBe(r2)
    expect(r4).toBe(fetchResultListMock2)
  })

  test('测试 Cache 装饰的方法报错', async () => {
    const fetchMock = createFetch(fetchResultListMock, fetchResultListMock2)
    class MyService {
      @Cache('uniqueKey')
      query() {
        return createErrorFetch('cache error')()
      }
      @CacheClear('uniqueKey')
      create() {
        return createErrorFetch('cache clear error')()
      }
    }
    const myService = new MyService()
    try {
      await myService.query()
    } catch (error) {
      expect(error).toBe('cache error')
    }
    try {
      await myService.create()
    } catch (error) {
      expect(error).toBe('cache clear error')
    }
  })
})
