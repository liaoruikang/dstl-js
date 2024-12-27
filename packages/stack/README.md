# @dstl-js/stack

## Download

**You can download the source code directly from the CDN and use it:**

- [https://unpkg.com/@dstl-js/stack/dist/index.js](https://unpkg.com/@dstl-js/stack/dist/index.js)
- [https://unpkg.com/@dstl-js/stack/dist/index.min.js](https://unpkg.com/@dstl-js/stack/dist/index.min.js)

**You can also install it directly using the package manager:**

```
npm i @dstl-js/stack
```

```
pnpm add @dstl-js/stack
```

```
yarn add @dstl-js/stack
```

## Usage

```
import { Stack } from '@dstl-js/stack'

const stack = new Stack<number>([1, 2, 3, 4, 5]);

console.log(stack.pop()); // 5
console.log(stack.top); // 4

for (const v of stack) console.log(v); // 4, 3, 2, 1
```

## Iterable

The Stack container is an iterable, you can use [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loop, [`spread syntax`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), [`yield*`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*) keyword, and [`array deconstruction`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) operate on container

**Example**

```
import { Stack } from '@dstl-js/stack';

const stack = new Stack<number>([1, 2, 3, 4, 5]);

// for...of
for (const v of stack) {
  //...
}

// spread syntax
const arr = [...stack]; // [5, 4, 3, 2, 1]

// yield*
function* fn() {
  yield* stack;
}
const it = fn();
console.log(it.next().value); // 5

// array deconstruction
const [a, b, c, d, e] = stack;
console.log(a, b, c, d, e); // 5, 4, 3, 2, 1
```

## API

### Constructor

- **`new Stack(iterable?: Iterable<T>)`** Create a stack container
  - **parameters:**
    - **`iterable?`** Accepts an iterable as the initial value of the container

### Attributes

- **`size: number`** Stack size
  <br/>
- **`isEmpty: boolean`** Whether the stack is empty
  <br/>
- **`top: T`** Gets the top element of the stack

### Methods

- **`push(value: T): this`** Inserts an element to the top of the stack

  - **parameters:**
    - **`value： T`** The value to insert
      <br/>

- **`pop(): T`** Remove the top of the stack element
  <br/>

- **`forEach(callback: (value: T) => void): void`** Traverse the stack with callbacks

  - **parameters:**
    - **`callback: (value: T) => void`**
      <br/>

- **`values(): Generator<T>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) consisting of all elements
  <br/>

- **`clear(): this`** Clear stack
