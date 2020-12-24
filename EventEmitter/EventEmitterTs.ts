// TypeScript

interface OneListener {
  once?: boolean
  listener: Function
}


interface Events {
  [key: string]: OneListener[]
}

class EventEmitterTs {

  _events:Events = {}

  constructor() {

  }

  addListener(evt: string, listener: Function, once: boolean = false) {
    if (typeof listener !== 'function') {
      return console.error('listener is not a function!')
    }
    let events = this.getListeners(evt)
    if (events && Array.isArray(events) && this.indexOfListener(events, listener) === -1) {
      events.push({
        once,
        listener: listener
      })
    } else {
      events = [{
        once,
        listener: listener
      }]
    }
  }

  emit(evt: string, ...args) {
    const events = this._events[evt]
    if (events && events.length) {
      // 这里一定要 slice(0) 做复制
      let evtArr = events.slice(0)
      evtArr.forEach(v => {
        v.listener.apply(this, args)
        if (v.once) {
          this.removeListener(evt, v.listener)
        }
      })
      console.log('??', events, evtArr)
    } else {
      console.warn(`暂时没有${evt}对应的事件`)
    }
  }

  // 筛选某个动作的所有回调 并保持 interface Events 的格式
  getListenersAsObject(evt: string): Events | OneListener[] {
    const listeners = this.getListeners(evt);
    let response
    if (listeners instanceof Array) {
      response = {};
      response[evt] = listeners;
    }
    return response || listeners;
  }

  // 删除某个动作对应的所有回调
  removeEvent(evt: string) {
    const events: Events = this._getEvents();
    delete events[evt]
  }

  // 删除某个动作的某个回调
  removeListener(env: string, listener: Function) {
    // 暂时不考虑 OneListener 的情况 所以用了 类型断言...
    const events: Events = this.getListenersAsObject(env) as Events;
    let index
    let key
    for(key of Reflect.ownKeys(events)) {
      index = this.indexOfListener(events[key], listener);
      if (index !== -1) {
        events[key].splice(index, 1);
      }
    }
    
  }

  _getEvents() {
    return this._events || (this._events = {})
  }

  // 取某个动作对应的 OneListener[]
  getListeners(evt: string): OneListener[] {
    const events: Events = this._getEvents()
    let response = events[evt] || (events[evt] = [])
    return response 
  }

  // 在 listeners 数组中找值为 listener 的下标。
  indexOfListener(listeners: OneListener[], listener: Function): number {
    let i = listeners.length;
    while (i--) {
      if (listeners[i].listener === listener) {
        return i;
      }
    }
    return -1;
  }

}

window['EventEmitterTs'] = EventEmitterTs