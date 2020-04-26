import extend from '../../src/utils/extend'

describe('测试 extend 方法', () => {
  function decoratorFactory() {}
  const baseDecoratorFactory = extend(decoratorFactory)

  test('测试 use 方法', () => {
    baseDecoratorFactory.use(function(ctx: any, next: any) {})
    expect(baseDecoratorFactory._middlewares.length).toBe(1)
    baseDecoratorFactory._runMiddlewares({})
  })

  test('测试事件相关', () => {
    let myEventData = null
    function listener(payload: any) {
      myEventData = payload
    }
    baseDecoratorFactory.on('myEvent', listener)
    baseDecoratorFactory.emit('myEvent', 1)

    expect(myEventData).toBe(1)

    baseDecoratorFactory.off('myEvent', listener)
    baseDecoratorFactory.emit('myEvent', 2)

    expect(myEventData).toBe(1)

    baseDecoratorFactory.once('onceEvent', function(payload: any) {
      myEventData = payload
    })

    baseDecoratorFactory.emit('onceEvent', 3)
    expect(myEventData).toBe(3)
    baseDecoratorFactory.emit('onceEvent', 4)
    expect(myEventData).toBe(3)
  })

  test('测试 decoratoredMethod', () => {
    expect(baseDecoratorFactory.getDecoratoredMethods().length).toBe(0)
  })
})
