import EventEmitter from '../../src/utils/event'

describe('测试 event 类', () => {
  test('测试 listener 合法性', () => {
    const myEvent = new EventEmitter()

    function listener() {}

    const result = myEvent.on('', '')
    expect(result).toBe(void 0)
    const result2 = myEvent.on('myEvent', '')
    expect(result2).toBe(void 0)

    try {
      myEvent.on('myEvent', '1212')
    } catch (error) {
      expect(error.message).toBe('listener must be a function')
    }
    try {
      myEvent.on('myEvent', { listener: '1212' })
    } catch (error) {
      expect(error.message).toBe('listener must be a function')
    }
    myEvent.on('myEvent', { listener })
    myEvent.on('myEvent', { listener })
    myEvent.emit('myEvent', [1])

    expect(myEvent._events['myEvent']).toBeDefined()

    myEvent.off('noEvent', function() {})
    myEvent.off('myEvent', listener)
  })
})
