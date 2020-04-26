import Service from '../../../src/packages/service/index'

describe('use-api test', () => {
  test('测试 Service 往被装饰的原型上默认添加 $namespace', async () => {
    @Service()
    class MyService {}
    const myService = new MyService()
    expect((myService as any).$namespace).toBe('MyService')
  })

  test('测试 Service 往被装饰的原型上添加自定义 $namespace', async () => {
    @Service('myNamespace')
    class MyService {}
    const myService = new MyService()
    expect((myService as any).$namespace).toBe('myNamespace')
  })
})
