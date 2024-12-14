# DSTL-JS ![NPM Version](https://img.shields.io/npm/v/dstl-js)

data structure tool lib for Javascript

## Download

**You can download the source code directly from the CDN and use it:**

- [https://unpkg.com/dstl-js/dist/index.js](https://unpkg.com/dstl-js/dist/index.js)
- [https://unpkg.com/dstl-js/dist/index.min.js](https://unpkg.com/dstl-js/dist/index.min.js)

**You can also install it directly using the package manager:**

```
npm i dstl-js
```

```
pnpm add dstl-js
```

```
yarn add dstl-js
```

## All data structures

### [Stack](https://github.com/liaoruikang/dstl-js/tree/main/packages/stack#@dstl-js/stack)

First-in-last-out data container

**Example**

```
import { Stack } from 'dstl-js';

const stack = new Stack<number>([1, 2, 3, 4, 5]);

console.log(stack.pop()); // 5
console.log(stack.top); // 4

for (const v of stack) console.log(v); // 4, 3, 2, 1
```

### [Queue](https://github.com/liaoruikang/dstl-js/tree/main/packages/queue#@dstl-js/queue)

First-in-first-out data container

**Example**

```
import { Queue } from 'dstl-js';

const queue = new Queue<number>([1, 2, 3, 4, 5]);

console.log(queue.dequeue()); // 1
console.log(queue.peek); // 2

for (const v of queue) console.log(v); // 2, 3, 4, 5
```

### [LinkList](https://github.com/liaoruikang/dstl-js/tree/main/packages/linklist#@dstl-js/linklist)

Chain storage structure data container

**Example**

```
import { LinkList } from 'dstl-js';

const list = new LinkList<number>([1,2,6,4,8,5])

list.push(9)
console.log(list.head,list.tail); // 1, 9
console.log(list.at(3)); // 4
list.removeAt(3)

for (const [i,v] of list) console.log(v); // 1, 2, 6, 8, 5, 9
```

### [BSTree](https://github.com/liaoruikang/dstl-js/tree/main/packages/bst#@dstl-js/bst)

binary search tree

**Example**

```
import { BSTree } from 'dstl-js';

const bst = new BSTree<string>([
  [4, '4'],
  [3, '3'],
  [9, '9'],
  [7, '7'],
  [2, '2'],
  [8, '8'],
  [1, '1']
]);

bst.insert(5, '5');
console.log(bst.has(5)); // true
console.log(bst.prev(5)); // [4, '4']
console.log(bst.next(5)); // [7, '7']

for (const [k] of bst) console.log(k); // 1, 2, 3, 4, 5, 7, 8, 9
for (const [k] of bst.inorder()) console.log(k); // 1, 2, 3, 4, 5, 7, 8, 9

for (const [k] of bst.preorder()) console.log(k); // 4, 3, 2, 1, 9, 7, 5, 8
for (const [k] of bst.postorder()) console.log(k); // 1, 2, 3, 5, 8, 7, 9, 4
```

### [AVLTree](https://github.com/liaoruikang/dstl-js/tree/main/packages/avl#@dstl-js/avl)

Self-balancing binary search tree

**Example**

```
import { AVLTree } from 'dstl-js';

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
for (const [k] of avl.inorder()) console.log(k); // 1, 2, 3, 4, 5, 7, 8, 9

for (const [k] of avl.preorder()) console.log(k); // 4, 3, 2, 1, 9, 7, 5, 8
for (const [k] of avl.postorder()) console.log(k); // 1, 2, 3, 5, 8, 7, 9, 4
```

## License

[MIT](https://opensource.org/licenses/MIT)
