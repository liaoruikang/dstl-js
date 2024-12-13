export class Queue<T> {
  private static _MaxChunk = 1 << 10;
  private static _Factor = 0.5;

  private _data: T[] = [];
  private _start = 0;
  private _end = 0;
  private _size = 0;

  [Symbol.iterator]() {
    return this.values();
  }

  constructor(iterable?: Iterable<T>) {
    if (iterable) for (const value of iterable) this.enqueue(value);
  }

  get size() {
    return this._size;
  }

  get isEmpty() {
    return this._size === 0;
  }

  enqueue(value: T) {
    this._data[this._end++] = value;
    this._size++;
    if (
      this._start / this._end <= Queue._Factor ||
      this._size <= Queue._MaxChunk
    )
      return;
    this._data = this._data.slice(this._start, this._end);
    this._start = 0;
    this._end = this._size;
  }

  dequeue() {
    if (this.isEmpty) return;
    return this._data[(this._size--, this._start++)];
  }

  clear() {
    this._data = [];
    this._size = this._end = this._start = 0;
  }

  peek() {
    if (this.isEmpty) return;
    return this._data[this._start];
  }

  *values() {
    for (let i = this._start; i < this._end; i++) yield this._data[i];
  }

  forEach(callback: (value: T) => void): void {
    for (const v of this) callback(v);
  }
}
