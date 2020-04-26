import CacheStore from '../../src/utils/cache'

describe('测试 CacheStore 类', () => {
  test('测试 cache 时效性', () => {
    const cacheStore = new CacheStore()
    cacheStore.set('testData', {
      data: 1,
      timeout: -1,
      cacheTime: Date.now()
    })
    const cacheData = cacheStore.get('testData')
    expect(cacheData).toBeNull()

    expect(cacheStore.has('testData')).toBeFalsy()

    cacheStore.set('testData2', {
      data: 1,
      timeout: 3000,
      cacheTime: Date.now()
    })

    expect(cacheStore.has('testData2')).toBeTruthy()
    expect(cacheStore.clear())
    expect(cacheStore.has('testData2')).toBeFalsy()
  })
})
