import { Stack } from '@dstl-js/stack';
import { Queue } from '@dstl-js/queue';

export enum BSNodeType {
  ROOT = 'root',
  LEFT = 'left',
  RIGHT = 'right'
}

export interface BSNode<Key, T> {
  key: Key;
  value: T;
  type: BSNodeType;
  parent: BSNode<Key, T> | null;
  left: BSNode<Key, T> | null;
  right: BSNode<Key, T> | null;
}

export enum BSTraverseType {
  PREORDER,
  INORDER,
  POSTORDER,
  SEQUENCE
}

export type BSComparer<Key> = (a: Key, b: Key) => number;

type BSTreeArgs<Key, T> = Key extends number
  ? [
      iterable?: Iterable<[key: Key, value: T]>,
      comparer?: BSComparer<Key>,
      repeatable?: boolean
    ]
  : [
      iterable: Iterable<[key: Key, value: T]> | undefined | null,
      comparer: BSComparer<Key>,
      repeatable?: boolean
    ];

export class BSTree<T, Key = number> {
  protected _root: BSNode<Key, T> | null = null;
  protected _comparer: BSComparer<Key>;
  protected _size = 0;
  protected _repeatable: boolean;

  [Symbol.iterator]() {
    return this.inorder();
  }

  constructor(...[iterable, comparer, repeatable]: BSTreeArgs<Key, T>) {
    this._repeatable = repeatable ?? false;
    this._comparer =
      comparer ?? ((a, b) => Math.sign((a as number) - (b as number)));
    if (iterable) this.batchInsert(iterable);
  }

  get depth() {
    let depth = 0;
    for (const [, , d] of this.sequence()) depth = Math.max(depth, d);
    return depth;
  }

  get size() {
    return this._size;
  }

  get isEmpty() {
    return this._size === 0;
  }

  insert(key: Key, value: T) {
    this._insert(key, value);
    return this;
  }

  batchInsert(nodes: Iterable<[key: Key, value: T]>) {
    for (const [key, value] of nodes) this.insert(key, value);
    return this;
  }

  find(key: Key) {
    return this._findNode(key)?.value;
  }

  remove(key: Key | Key[]) {
    if (!Array.isArray(key)) key = [key];

    return key
      .map(k => {
        const node = this._remove(k);
        if (!node) return;
        return [node.key, node.value];
      })
      .filter(Boolean) as [key: Key, value: T][];
  }

  forEach(
    callback: (value: T, key: Key) => void,
    type = BSTraverseType.INORDER
  ) {
    const functions = {
      [BSTraverseType.PREORDER]: this.preorder.bind(this),
      [BSTraverseType.INORDER]: this.inorder.bind(this),
      [BSTraverseType.POSTORDER]: this.postorder.bind(this),
      [BSTraverseType.SEQUENCE]: this.sequence.bind(this)
    };
    for (const [v, k] of functions[type]()) callback(v, k);
  }

  entries() {
    return this.inorder();
  }

  *keys() {
    for (const [, k] of this.inorder()) yield k;
  }

  *values() {
    for (const [v] of this.inorder()) yield v;
  }

  *preorder() {
    let current = this._root;
    const stack = new Stack<BSNode<Key, T>>();
    while (current || stack.size) {
      if (current) {
        yield [current.value, current.key] as const;
        stack.push(current);
        current = current.left;
        continue;
      }
      current = stack.pop()!.right;
    }
  }

  *inorder() {
    let current = this._root;
    const stack = new Stack<BSNode<Key, T>>();
    while (current || stack.size) {
      if (current) {
        stack.push(current);
        current = current.left;
        continue;
      }
      const node = stack.pop()!;
      yield [node.value, node.key] as const;
      current = node.right;
    }
  }

  *postorder() {
    let visited: BSNode<Key, T> | null = null;
    let current = this._root;
    const stack = new Stack<BSNode<Key, T>>();
    while (current || stack.size) {
      if (current) {
        stack.push(current);
        current = current.left;
        continue;
      }
      const node = stack.top!;
      if (node.right && node.right !== visited) {
        current = node.right;
        continue;
      }

      yield [node.value, node.key] as const;
      current = null;
      visited = node;
      stack.pop();
    }
  }

  *sequence() {
    if (!this._root) return;
    const queue = new Queue<[BSNode<Key, T>, number]>([[this._root, 1]]);

    while (queue.size) {
      const [node, depth] = queue.dequeue()!;
      yield [node.value, node.key, depth] as const;
      if (node.left) queue.enqueue([node.left, depth + 1]);
      if (node.right) queue.enqueue([node.right, depth + 1]);
    }
  }

  prev(key: Key): [key: Key, value: T] | null {
    const node = this._findNode(key);
    if (!node) return null;
    const prev = this._getPrevNode(node);
    if (!prev) return null;
    return [prev.key, prev.value];
  }

  next(key: Key): [key: Key, value: T] | null {
    const node = this._findNode(key);
    if (!node) return null;
    const next = this._getNextNode(node);
    if (!next) return null;
    return [next.key, next.value];
  }

  min(): [key: Key, value: T] | null {
    let current = this._root;
    while (current?.left) current = current.left;
    if (!current) return null;
    return [current.key, current.value];
  }

  max(): [key: Key, value: T] | null {
    let current = this._root;
    while (current?.right) current = current.right;
    if (!current) return null;
    return [current.key, current.value];
  }

  clear() {
    this._root = null;
    this._size = 0;
    return this;
  }

  has(key: Key) {
    return !!this._findNode(key);
  }

  private _createNode(
    key: Key,
    value: T,
    parent: BSNode<Key, T> | null = null,
    type: BSNodeType = BSNodeType.ROOT
  ): BSNode<Key, T> {
    return {
      key,
      value,
      parent,
      type: parent ? type : BSNodeType.ROOT,
      left: null,
      right: null
    };
  }

  protected _getNextNode(node: BSNode<Key, T>) {
    let current = node.right;
    while (current?.left) current = current.left;
    return current as (BSNode<Key, T> & { type: BSNodeType.LEFT }) | null;
  }

  protected _getPrevNode(node: BSNode<Key, T>) {
    let current = node.left;
    while (current?.right) current = current.right;
    return current as (BSNode<Key, T> & { type: BSNodeType.RIGHT }) | null;
  }

  protected _insert(key: Key, value: T) {
    if (this._root === null) {
      this._root = this._createNode(key, value!);
      this._size++;
      return this._root;
    }
    let current = this._root;
    let type: BSNodeType | undefined = void 0;
    while (type === void 0) {
      let comp = this._comparer(key, current.key);
      if (this._repeatable && comp === 0) comp = 1;
      if (comp === 1)
        if (current.right === null) type = BSNodeType.RIGHT;
        else current = current.right;
      else if (comp === -1)
        if (current.left === null) type = BSNodeType.LEFT;
        else current = current.left;
      else if (comp === 0) return (current.value = value!), current;
      else return null;
    }

    this._size++;
    return (current[type] = this._createNode(key, value!, current, type));
  }

  protected _remove(key: Key) {
    let target = this._findNode(key);
    if (!target) return null;
    let prev, next;
    if ((next = this._getNextNode(target))) {
      target.key = next.key;
      target.value = next.value;

      next.parent![next.type] = next.right;
      if (next.right) next.right.type = next.type;

      target = next;
    } else if ((prev = this._getPrevNode(target))) {
      target.key = prev.key;
      target.value = prev.value;

      prev.parent![prev.type] = prev.left;
      if (prev.left) prev.left.type = prev.type;

      target = prev;
    } else if (this._notRoot(target)) target.parent[target.type] = null;
    else this._root = null;
    this._size--;
    return target;
  }

  protected _isRoot(
    node: BSNode<Key, T>
  ): node is BSNode<Key, T> & { parent: null; type: BSNodeType.ROOT } {
    return node.type === BSNodeType.ROOT;
  }

  protected _notRoot(node: BSNode<Key, T>): node is BSNode<Key, T> & {
    parent: BSNode<Key, T>;
    type: BSNodeType.LEFT | BSNodeType.RIGHT;
  } {
    return !this._isRoot(node);
  }

  protected _findNode(key: Key) {
    let current = this._root;
    while (current) {
      const comp = this._comparer(key, current.key);
      if (comp === -1) current = current.left;
      else if (comp === 1) current = current.right;
      else if (comp === 0) return current;
    }
    return null;
  }

  protected _rotateLeft(node: BSNode<Key, T>) {
    const { right, parent } = node;
    if (!right) return false;
    right.parent = parent;
    if (this._notRoot(node)) parent![node.type] = right;
    else this._root = right;

    right.type = node.type;
    node.type = BSNodeType.LEFT;

    node.right = right.left;
    if (right.left)
      (right.left.parent = node), (right.left.type = BSNodeType.RIGHT);

    node.parent = right;
    right.left = node;
    return true;
  }

  protected _rotateRight(node: BSNode<Key, T>) {
    const { left, parent } = node;
    if (!left) return false;
    left.parent = parent;
    if (this._notRoot(node)) parent![node.type] = left;
    else this._root = left;

    left.type = node.type;
    node.type = BSNodeType.RIGHT;

    node.left = left.right;
    if (left.right)
      (left.right.parent = node), (left.right.type = BSNodeType.LEFT);

    left.right = node;
    node.parent = left;
    return true;
  }
}
