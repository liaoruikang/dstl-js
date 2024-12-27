# @dstl-js/linklist

## Download

**You can download the source code directly from the CDN and use it:**

- [https://unpkg.com/@dstl-js/linklist/dist/index.js](https://unpkg.com/@dstl-js/linklist/dist/index.js)
- [https://unpkg.com/@dstl-js/linklist/dist/index.min.js](https://unpkg.com/@dstl-js/linklist/dist/index.min.js)

**You can also install it directly using the package manager:**

```
npm i @dstl-js/linklist
```

```
pnpm add @dstl-js/linklist
```

```
yarn add @dstl-js/linklist
```

## Usage

```
import { LinkList } from '@dstl-js/linklist';

const linklist = new LinkList<number>([1, 2, 3, 4, 5]);

linklist.unshift(6);
console.log(linklist.at(0)); // 6
console.log(linklist.tail); // 5

for (const [i, v] of linklist) console.log(v); // 6, 1, 2, 3, 4, 5
```

## Iterable

The LinkList container is an iterable, you can use [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loop, [`spread syntax`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), [`yield*`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*) keyword, and [`array deconstruction`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) operate on container

**Example**

```
import { LinkList } from '@dstl-js/linklist';

const linklist = new LinkList<number>([1, 2, 3, 4, 5]);

// for...of
for (const [i, v] of linklist) {
  //...
}

// spread syntax
const arr = [...linklist]; // [1, 2, 3, 4, 5]

// yield*
function* fn() {
  yield* linklist;
}
const it = fn();
console.log(it.next().value); // 1

// array deconstruction
const [a, b, c, d, e] = linklist;
console.log(a, b, c, d, e); // 1, 2, 3, 4, 5
```

## API

### Constructor

- **`new LinkList(iterable?: Iterable<T>)`** Create a linklist container
  - **parameters:**
    - **`iterable?`** Accepts an iterable as the initial value of the container

### Attributes

- **`size: number`** Linklist size
  <br/>

- **`isEmpty: boolean`** Whether the linklist is empty
  <br/>

- **`head: T`** View the linklist head element
  <br/>

- **`tail: T`** View the linklist tail element

### Methods

- **`push(value: T): this`** Add an element to the tail of the linklist

  - **parameters:** - **`value: T`** The value to add
    <br/>

- **`pop(): T`** Remove and return the tail element of the linklist
  <br/>

- **`unshift(value: T): this`** Add an element to the head of the linklist

  - **parameters:** - **`value: T`** The value to add
    <br/>

- **`shift(): T`** Remove and return the head element of the linklist
  <br/>

- **`indexOf(value: T): number`** Get index by element

  - **parameters:** - **`value: T`**
    <br/>

- **`at(index: number): T`** Get element by index

  - **parameters:** - **`index: number`**
    <br/>

- **`removeAt(index: number): T`** Remove element by index

  - **parameters:** - **`index: number`**
    <br/>

- **`forEach(callback: (value: T) => void): void`** Traverse the linklist with callbacks

  - **parameters:** - **`callback: (value: T) => void`**
    <br/>

- **`values(): Generator<T>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) consisting of all elements
  <br/>

- **`entries(): Generator<T>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) consisting of all key-value pairs
  <br/>

- **`clear(): this`** Clear linklist
