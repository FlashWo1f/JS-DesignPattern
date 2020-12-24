// TypeScript
class EventEmitterTs {
    constructor() {
        this._events = {};
    }
    addListener(evt, listener, once = false) {
        if (typeof listener !== 'function') {
            return console.error('listener is not a function!');
        }
        let events = this.getListeners(evt);
        if (events && Array.isArray(events) && this.indexOfListener(events, listener) === -1) {
            events.push({
                once,
                listener: listener
            });
        }
        else {
            events = [{
                    once,
                    listener: listener
                }];
        }
    }
    emit(evt, ...args) {
        const events = this._events[evt];
        if (events && events.length) {
            // 这里一定要 slice(0) 做浅拷贝
            // 因为 this.removeListener 涉及到数组的 splice 方法 => splice 操作之后数组下标会发生变化
            // forEach 的底层应该也是 for 循环 所以 下标发生变化会导致 循环出问题
            let evtArr = events.slice(0);
            evtArr.forEach(v => {
                v.listener.apply(this, args);
                if (v.once) {
                    this.removeListener(evt, v.listener);
                }
            });
            console.log('??', events, evtArr, events[0] === evtArr[1]);
        }
        else {
            console.warn(`暂时没有${evt}对应的事件`);
        }
    }
    // 筛选某个动作的所有回调 并保持 interface Events 的格式
    getListenersAsObject(evt) {
        const listeners = this.getListeners(evt);
        let response;
        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }
        return response || listeners;
    }
    // 删除某个动作对应的所有回调
    removeEvent(evt) {
        const events = this._getEvents();
        delete events[evt];
    }
    // 删除某个动作的某个回调
    removeListener(env, listener) {
        // 暂时不考虑 OneListener 的情况 所以用了 类型断言...
        const events = this.getListenersAsObject(env);
        let index;
        let key;
        for (key of Reflect.ownKeys(events)) {
            index = this.indexOfListener(events[key], listener);
            if (index !== -1) {
                events[key].splice(index, 1);
            }
        }
    }
    _getEvents() {
        return this._events || (this._events = {});
    }
    // 取某个动作对应的 OneListener[]
    getListeners(evt) {
        const events = this._getEvents();
        let response = events[evt] || (events[evt] = []);
        return response;
    }
    // 在 listeners 数组中找值为 listener 的下标。
    indexOfListener(listeners, listener) {
        let i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }
        return -1;
    }
}
window['EventEmitterTs'] = EventEmitterTs;
