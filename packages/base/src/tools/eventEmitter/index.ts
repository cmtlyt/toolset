import { TObject } from '../../types/base';

type CallbackFunc<T> = (event: CustomEvent<T>) => void;

export class CustomEvent<T> {
  type: string;
  data: T;
  removeListenerFlag: boolean;

  constructor(type: string, data: T) {
    this.type = type;
    if (Array.isArray(data) && data.length === 1) data = data[0];
    this.data = data;
    this.removeListenerFlag = false;
  }

  removeListener() {
    this.removeListenerFlag = true;
  }
}

let instance: EventEmitter = null;

export class EventEmitter {
  static getDetaultEmitter() {
    return (instance ??= new EventEmitter());
  }

  eventMap: TObject<CallbackFunc<any>[]>;

  constructor() {
    this.eventMap = {};
  }

  on(eventName: string, callback: CallbackFunc<any>) {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [];
    }
    this.eventMap[eventName].push(callback);
    return this;
  }
  #_run<T>(eventName: string, callback: CallbackFunc<T>, event: CustomEvent<T>) {
    callback.apply(null, event);
    if (event.removeListenerFlag) {
      this.off(eventName, callback);
    }
  }
  emit(eventName: string, ...args: any[]) {
    if (!this.eventMap[eventName]) return;
    const event = new CustomEvent(eventName, args);
    this.eventMap[eventName].forEach((callback) => this.#_run(eventName, callback, event));
    return this;
  }
  once(eventName: string, callback: CallbackFunc<any>) {
    const onceCallback = (...args: any[]) => {
      callback.apply(null, args);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
    return this;
  }
  off(eventName: string, callback: CallbackFunc<any>) {
    if (!this.eventMap[eventName]) return;
    this.eventMap[eventName].splice(this.eventMap[eventName].indexOf(callback));
    return this;
  }
  clear(eventName: string) {
    this.eventMap[eventName] = [];
    return this;
  }
  clearAll() {
    this.eventMap = {};
    return this;
  }
  getFuncMap() {
    return {
      on: this.on.bind(this),
      emit: this.emit.bind(this),
      once: this.once.bind(this),
      off: this.off.bind(this),
      clear: this.clear.bind(this),
      clearAll: this.clearAll.bind(this),
    };
  }
}
