# @dstl-js/queue

## Download

**You can download the source code directly from the CDN and use it:**

- [https://unpkg.com/@dstl-js/queue/dist/index.js](https://unpkg.com/@dstl-js/queue/dist/index.js)
- [https://unpkg.com/@dstl-js/queue/dist/index.min.js](https://unpkg.com/@dstl-js/queue/dist/index.min.js)

**You can also install it directly using the package manager:**

```
npm i @dstl-js/queue
```

```
pnpm add @dstl-js/queue
```

```
yarn add @dstl-js/queue
```

## Usage

```
import { Queue } from '@dstl-js/queue';

const queue = new Queue<number>([1, 2, 3, 4, 5]);

console.log(queue.dequeue()); // 1
console.log(queue.peek); // 2

for (const v of queue) console.log(v); // 2, 3, 4, 5
```

## Iterable

The Queue container is an iterable, you can use [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loop, [`spread syntax`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), [`yield*`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*) keyword, and [`array deconstruction`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) operate on container

**Example**

```
import { Queue } from '@dstl-js/queue';

const queue = new Queue<number>([1, 2, 3, 4, 5]);

// for...of
for (const v of queue) {
  //...
}

// spread syntax
const arr = [...queue]; // [1, 2, 3, 4, 5]

// yield*
function* fn() {
  yield* queue;
}
const it = fn();
console.log(it.next().value); // 1

// array deconstruction
const [a, b, c, d, e] = queue;
console.log(a, b, c, d, e); // 1, 2, 3, 4, 5
```

## API

### Constructor

- **`new Queue(iterable?: Iterable<T>)`** Create a queue container
  **parameters:**
  - **`iterable?`** Accepts an iterable as the initial value of the container

### Attributes

- **`size: number`** Queue size
- **`isEmpty: boolean`** Whether the queue is empty
- **`peek: T`** View the queue head element

### Methods

- **`enqueue(value: T): this`** Add the element to the queue
  **parameters:**
  - **`value： T`** The value to add
- **`dequeue(): T`** dequeue head element
- **`forEach(callback: (value: T) => void): void`** Traverse the queue with callbacks
  **parameters:**
  - **`callback: (value: T) => void`**
- **`values(): Generator<T>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) object
- **`clear(): this`** Clear queue
