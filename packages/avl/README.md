# @dstl-js/avl

## Download

**You can download the source code directly from the CDN and use it:**

- [https://unpkg.com/@dstl-js/avl/dist/index.js](https://unpkg.com/@dstl-js/avl/dist/index.js)
- [https://unpkg.com/@dstl-js/avl/dist/index.min.js](https://unpkg.com/@dstl-js/avl/dist/index.min.js)

**You can also install it directly using the package manager:**

```
npm i @dstl-js/avl
```

```
pnpm add @dstl-js/avl
```

```
yarn add @dstl-js/avl
```

## Usage

```
import { AVLTree } from '@dstl-js/avl'

const avl = new AVLTree<string>([
  [4, '4'],
  [3, '3'],
  [9, '9'],
  [7, '7'],
  [2, '2'],
  [8, '8'],
  [1, '1']
]);

avl.insert(5, '5');
console.log(avl.has(5)); // true
console.log(avl.prev(5)); // [4, '4']
console.log(avl.next(5)); // [7, '7']

for (const [k] of avl) console.log(k); // 1, 2, 3, 4, 5, 7, 8, 9
```

## Iterable

The AVLTree container is an iterable, you can use [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loop, [`spread syntax`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), [`yield*`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*) keyword, and [`array deconstruction`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) operate on container

**Example**

```
import { AVLTree } from '@dstl-js/avl'

const avl = new AVLTree<string>([
  [1, '1'],
  [2, '2'],
  [3, '3'],
  [4, '4'],
  [5, '5']
]);

// for...of
for (const [k, v] of avl) {
  //...
}

/**
 * spread syntax
 * [
     [1, '1'],
     [2, '2'],
     [3, '3'],
     [4, '4'],
     [5, '5']
 * ]
 */
const arr = [...avl];

// yield*
function* fn() {
  yield* avl;
}
const it = fn();
console.log(it.next().value); // [1, '1']

// array deconstruction
const [a, b, c, d, e] = avl;
console.log(a, b, c, d, e); // [1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']
```

## API

### Constructor

- **`new AVLTree(iterable?: Iterable<[key: Key, value: T]>, comparer?: BSComparer<Key>, repeatable: boolaen = false)`** Create a bst container
  - **parameters:**
    - **`iterable?`** Accepts an iterable as the initial value of the container
    - **`comparer?`** This parameter is required when the type of key is not number
    - **`repeatable?`** Whether to allow duplicate key, overwrite old value if false


### Attributes

- **`size: number`** Tree size
  <br/>
- **`isEmpty: boolean`** Whether the tree is empty
  <br/>
- **`depth: number`** Tree depth

### Methods

- **`insert(value: T): this`** Insert element
  - **parameters:**
    - **`value: T`** The value to insert
  - **return:** this
    <br/>

- **`batchInsert(nodes: Iterable<[key: Key, value: T]>): this`** Batch insert element
  - **parameters:**
    - **`nodes: Iterable<[key: Key, value: T]`** Accepts an iterable containing a key-value pair
  - **return:** this
    <br/>

- **`find(key: Key): T | undefined`** Batch insert element
  - **parameters:**
    - **`key: Key`** To find the element key
  - **return:** Successful search return search results, failed search return undefined
    <br/>

- **`remove(key: Key | Key[]): [key: Key, value: T][]`** Batch insert element
  - **parameters:**
    - **`key: Key | Key[]`** The keys to delete the element
  - **return:** Delete the node array successfully
    <br/>

- **`forEach(callback: (value: T, key: Key) => void): void`** Traverse the tree using an left-root-right traversal, in the form of a callback
  - **parameters:**
    - **`callback: (value: T, key: Key) => void`**
      <br/>

- **`preorder(): Generator<[T, Key]>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) consisting of all nodes, in the form of root-left-right traversal
  <br/>

- **`inorder(): Generator<[T, Key]>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) consisting of all nodes, in the form of left-root-right traversal
  <br/>

- **`postorder(): Generator<[T, Key]>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) consisting of all nodes, in the form of left-right-root traversal
  <br/>

- **`sequence(): Generator<[T, Key]>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) consisting of all nodes, in the form of sequence traversal
  <br/>

- **`entries(): Generator<[T, Key]>`** Equivalent to the inorder function
  <br/>

- **`keys(): Generator<[T, Key]>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) consisting of all keys, in the form of left-root-right traversal
  <br/>

- **`values(): Generator<[T, Key]>`** Returns a [`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) consisting of all values, in the form of left-root-right traversal
  <br/>

- **`prev(key: Key): [T, Key] | null`** Get the precursor node
  - **parameters:**
    - **`key: Key`**
  - **return:** Return directly if the node has a precursor, or null if it does not.
    <br/>

- **`next(key: Key): [T, Key] | null`** Get the successor node
  - **parameters:**
    - **`key: Key`**
  - **return:** Return directly if the node has a successor, or null if it does not.
    <br/>

- **`min(): [T, Key] | null`** Get the node with the smallest key in the tree
    <br/>

- **`max(): [T, Key] | null`** Get the node with the largest key value in the tree
    <br/>

- **`has(key: Key): boolean`** Check whether the key exists
  - **parameters:**
    - **`key: Key`**
      <br/>

- **`clear(): this`** Clear tree
    <br/>