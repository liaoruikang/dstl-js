export class Stack<T> {
  private _data: T[] = [];

  [Symbol.iterator]() {
    return this.values();
  }

  constructor(iterable?: Iterable<T>) {
    if (iterable) for (const value of iterable) this.push(value);
  }

  get size() {
    return this._data.length;
  }

  get isEmpty() {
    return this.size === 0;
  }
  get top() {
    if (this.isEmpty) return;
    return this._data[this.size - 1];
  }

  *values() {
    for (let i = this.size - 1; i >= 0; i--) yield this._data[i];
  }

  push(value: T) {
    this._data.push(value);
    return this;
  }

  pop() {
    return this._data.pop();
  }

  clear() {
    this._data = [];
    return this;
  }

  forEach(callback: (value: T) => void) {
    for (const v of this.values()) callback(v);
  }
}
