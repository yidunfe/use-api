function isValidListener(listener: any): any {
  if (typeof listener === 'function') {
    return true
  } else if (listener && typeof listener === 'object') {
    return isValidListener(listener.listener)
  } else {
    return false
  }
}

function indexOf(array: any, item: any) {
  let result = -1
  item = typeof item === 'object' ? item.listener : item

  for (let i = 0; i < array.length; i++) {
    if (array[i].listener === item) {
      result = i
      break
    }
  }

  return result
}

export default class EventEmitter {
  _events: any

  constructor() {
    this._events = {}
  }

  on(eventName: string, listener: any) {
    if (!eventName || !listener) return

    if (!isValidListener(listener)) {
      throw new TypeError('listener must be a function')
    }

    const events = this._events
    const listeners = (events[eventName] = events[eventName] || [])
    const listenerIsWrapped = typeof listener === 'object'

    // 不重复添加事件
    if (indexOf(listeners, listener) === -1) {
      listeners.push(
        listenerIsWrapped
          ? listener
          : {
              listener: listener,
              once: false
            }
      )
    }

    return this
  }

  once(eventName: string, listener: Function) {
    return this.on(eventName, {
      listener,
      once: true
    })
  }

  off(eventName: string, listener: Function) {
    const listeners = this._events[eventName]
    if (!listeners) return

    let index
    let len = listeners.length
    for (let i = 0; i < len; i++) {
      if (listeners[i] && listeners[i].listener === listener) {
        index = i
        break
      }
    }

    if (typeof index !== 'undefined') {
      listeners.splice(index, 1, null)
    }

    return this
  }

  emit(eventName: string, args: any[]) {
    const listeners = this._events[eventName]
    if (!listeners) return

    for (let i = 0; i < listeners.length; i++) {
      let listener = listeners[i]
      if (listener) {
        listener.listener.apply(this, args || [])
        if (listener.once) {
          this.off(eventName, listener.listener)
        }
      }
    }

    return this
  }
}
